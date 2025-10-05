// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IOmniPayNotifier {
    function notifyPaymentSuccess(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) external;

    function notifyPaymentFailure(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef,
        string calldata reason
    ) external;
}

interface IPushCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract OmniPayBridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct CrossChainPayment {
        address payer;
        address payee;
        address token;
        uint256 amount;
        uint256 sourceChainId;
        uint256 targetChainId;
        string paymentRef;
        uint256 timestamp;
        bool completed;
        bool refunded;
    }

    event CrossChainPaymentInitiated(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        string paymentRef
    );

    event CrossChainPaymentCompleted(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        string paymentRef
    );

    event CrossChainPaymentRefunded(
        uint256 indexed paymentId,
        address indexed payer,
        address token,
        uint256 amount,
        string reason
    );

    event RelayerAdded(address indexed relayer);
    event RelayerRemoved(address indexed relayer);

    CrossChainPayment[] public payments;
    mapping(address => bool) public authorizedRelayers;
    mapping(uint256 => bool) public supportedChains;
    
    address public notifier;
    address public pushComm;
    address public channel;
    
    uint256 public constant PAYMENT_TIMEOUT = 24 hours;
    uint256 public bridgeFee = 0.001 ether; // 0.001 ETH bridge fee

    modifier onlyRelayer() {
        require(authorizedRelayers[msg.sender], "Not authorized relayer");
        _;
    }

    constructor(
        address _notifier,
        address _pushComm,
        address _channel
    ) {
        notifier = _notifier;
        pushComm = _pushComm;
        channel = _channel;
        
        // Add supported chains (can be extended)
        supportedChains[1] = true;     // Ethereum
        supportedChains[8453] = true;  // Base
        supportedChains[137] = true;   // Polygon
        supportedChains[42161] = true; // Arbitrum
        supportedChains[42101] = true; // Push Donut
    }

    function setNotifier(address _notifier) external onlyOwner {
        notifier = _notifier;
    }

    function setPushComm(address _pushComm) external onlyOwner {
        pushComm = _pushComm;
    }

    function setChannel(address _channel) external onlyOwner {
        channel = _channel;
    }

    function setBridgeFee(uint256 _fee) external onlyOwner {
        bridgeFee = _fee;
    }

    function addRelayer(address _relayer) external onlyOwner {
        authorizedRelayers[_relayer] = true;
        emit RelayerAdded(_relayer);
    }

    function removeRelayer(address _relayer) external onlyOwner {
        authorizedRelayers[_relayer] = false;
        emit RelayerRemoved(_relayer);
    }

    function addSupportedChain(uint256 _chainId) external onlyOwner {
        supportedChains[_chainId] = true;
    }

    function removeSupportedChain(uint256 _chainId) external onlyOwner {
        supportedChains[_chainId] = false;
    }

    /// @notice Initiate cross-chain payment (locks tokens on source chain)
    /// @param payee Recipient address on target chain
    /// @param token Token contract address (address(0) for ETH)
    /// @param amount Amount to bridge
    /// @param targetChainId Target chain ID
    /// @param paymentRef Payment reference string
    function initiateCrossChainPayment(
        address payee,
        address token,
        uint256 amount,
        uint256 targetChainId,
        string calldata paymentRef
    ) external payable nonReentrant returns (uint256 paymentId) {
        require(payee != address(0), "Invalid payee");
        require(amount > 0, "Amount = 0");
        require(supportedChains[targetChainId], "Unsupported target chain");
        require(targetChainId != block.chainid, "Cannot bridge to same chain");
        require(msg.value >= bridgeFee, "Insufficient bridge fee");

        // Handle ETH payments
        if (token == address(0)) {
            require(msg.value >= amount + bridgeFee, "Insufficient ETH sent");
        } else {
            // Handle ERC20 payments
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        // Create payment record
        payments.push(
            CrossChainPayment({
                payer: msg.sender,
                payee: payee,
                token: token,
                amount: amount,
                sourceChainId: block.chainid,
                targetChainId: targetChainId,
                paymentRef: paymentRef,
                timestamp: block.timestamp,
                completed: false,
                refunded: false
            })
        );

        paymentId = payments.length - 1;

        emit CrossChainPaymentInitiated(
            paymentId,
            msg.sender,
            payee,
            token,
            amount,
            block.chainid,
            targetChainId,
            paymentRef
        );

        // Send Push notification
        if (pushComm != address(0) && channel != address(0)) {
            try IPushCommInterface(pushComm).sendNotification(
                channel,
                msg.sender,
                abi.encodePacked(
                    "0", // notification type
                    "+", // delimiter
                    "Cross-chain payment initiated", // title
                    "+", // delimiter
                    "Payment of ", // body start
                    _uint2str(amount),
                    " tokens initiated to chain ",
                    _uint2str(targetChainId)
                )
            ) {} catch {
                // Ignore notification failures
            }
        }
    }

    /// @notice Complete cross-chain payment (releases tokens on target chain)
    /// @param paymentId Payment ID from source chain
    /// @param payer Original payer address
    /// @param payee Recipient address
    /// @param token Token contract address
    /// @param amount Amount to release
    /// @param sourceChainId Source chain ID
    /// @param paymentRef Payment reference
    function completeCrossChainPayment(
        uint256 paymentId,
        address payer,
        address payee,
        address token,
        uint256 amount,
        uint256 sourceChainId,
        string calldata paymentRef
    ) external onlyRelayer nonReentrant {
        require(supportedChains[sourceChainId], "Unsupported source chain");
        
        // In a real implementation, this would verify the payment exists on source chain
        // For now, we trust the authorized relayer
        
        // Release tokens to payee
        if (token == address(0)) {
            // Release ETH
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = payee.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            // Release ERC20 tokens
            IERC20(token).safeTransfer(payee, amount);
        }

        emit CrossChainPaymentCompleted(
            paymentId,
            payer,
            payee,
            token,
            amount,
            sourceChainId,
            block.chainid,
            paymentRef
        );

        // Notify success
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                payer,
                payee,
                token,
                amount,
                paymentRef
            ) {} catch {
                // Ignore notification failures
            }
        }

        // Send Push notification
        if (pushComm != address(0) && channel != address(0)) {
            try IPushCommInterface(pushComm).sendNotification(
                channel,
                payee,
                abi.encodePacked(
                    "0", // notification type
                    "+", // delimiter
                    "Cross-chain payment received", // title
                    "+", // delimiter
                    "Received ", // body start
                    _uint2str(amount),
                    " tokens from chain ",
                    _uint2str(sourceChainId)
                )
            ) {} catch {
                // Ignore notification failures
            }
        }
    }

    /// @notice Refund payment if it times out or fails
    /// @param paymentId Payment ID to refund
    function refundPayment(uint256 paymentId) external nonReentrant {
        require(paymentId < payments.length, "Invalid payment ID");
        CrossChainPayment storage payment = payments[paymentId];
        
        require(!payment.completed, "Payment already completed");
        require(!payment.refunded, "Payment already refunded");
        require(
            msg.sender == payment.payer || 
            authorizedRelayers[msg.sender] || 
            block.timestamp > payment.timestamp + PAYMENT_TIMEOUT,
            "Not authorized to refund"
        );

        payment.refunded = true;

        // Refund tokens
        if (payment.token == address(0)) {
            // Refund ETH
            (bool success, ) = payment.payer.call{value: payment.amount}("");
            require(success, "ETH refund failed");
        } else {
            // Refund ERC20 tokens
            IERC20(payment.token).safeTransfer(payment.payer, payment.amount);
        }

        emit CrossChainPaymentRefunded(
            paymentId,
            payment.payer,
            payment.token,
            payment.amount,
            "Payment refunded"
        );

        // Notify failure
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentFailure(
                payment.payer,
                payment.payee,
                payment.token,
                payment.amount,
                payment.paymentRef,
                "Payment refunded"
            ) {} catch {
                // Ignore notification failures
            }
        }
    }

    /// @notice Get payment details
    /// @param paymentId Payment ID
    function getPayment(uint256 paymentId) external view returns (CrossChainPayment memory) {
        require(paymentId < payments.length, "Invalid payment ID");
        return payments[paymentId];
    }

    /// @notice Get total number of payments
    function paymentCount() external view returns (uint256) {
        return payments.length;
    }

    /// @notice Get payments for a specific payer
    /// @param payer Payer address
    function getPayerPayments(address payer) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](payments.length);
        uint256 count = 0;

        for (uint256 i = 0; i < payments.length; i++) {
            if (payments[i].payer == payer) {
                result[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory payerPayments = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            payerPayments[i] = result[i];
        }

        return payerPayments;
    }

    /// @notice Emergency withdrawal (owner only)
    /// @param token Token to withdraw (address(0) for ETH)
    /// @param amount Amount to withdraw
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            (bool success, ) = owner().call{value: amount}("");
            require(success, "ETH withdrawal failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    /// @notice Receive ETH
    receive() external payable {}

    /// @notice Convert uint to string (helper function)
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}