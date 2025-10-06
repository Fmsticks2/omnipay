// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title IOmniPayNotifier
 * @notice Interface for payment notification callbacks
 */
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

/**
 * @title IPushCommInterface
 * @notice Interface for Push Protocol notifications
 */
interface IPushCommInterface {
    function sendNotification(
        address _channel,
        address _recipient,
        bytes calldata _identity
    ) external;
}

/**
 * @title OmniPayBridge
 * @notice Cross-chain payment bridge supporting multiple chains and tokens
 * @dev Implements secure cross-chain payments with relayer-based message passing
 * @custom:security-contact security@omnipay.example
 */
contract OmniPayBridge is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @notice Status enumeration for cross-chain payments
    enum PaymentStatus {
        Initiated,
        Completed,
        Refunded,
        Cancelled
    }

    /// @notice Structure representing a cross-chain payment
    struct CrossChainPayment {
        address payer;              // Address that initiated the payment
        address payee;              // Intended recipient on target chain
        address token;              // Token address (address(0) for native ETH)
        uint256 amount;             // Payment amount
        uint256 sourceChainId;      // Chain ID where payment originated
        uint256 targetChainId;      // Chain ID where payment will be completed
        string paymentRef;          // Reference string for tracking
        uint256 timestamp;          // When payment was initiated
        PaymentStatus status;       // Current payment status
    }

    /// @notice Emitted when a cross-chain payment is initiated
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

    /// @notice Emitted when a cross-chain payment is completed
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

    /// @notice Emitted when a cross-chain payment is refunded
    event CrossChainPaymentRefunded(
        uint256 indexed paymentId,
        address indexed payer,
        address token,
        uint256 amount,
        string reason
    );

    /// @notice Emitted when a cross-chain payment fails
    event CrossChainPaymentFailed(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        string paymentRef,
        string reason
    );

    /// @notice Emitted when a payment is cancelled
    event CrossChainPaymentCancelled(
        uint256 indexed paymentId,
        address indexed payer,
        string reason
    );

    /// @notice Emitted when a relayer is added
    event RelayerAdded(address indexed relayer);

    /// @notice Emitted when a relayer is removed
    event RelayerRemoved(address indexed relayer);

    /// @notice Emitted when a chain support status changes
    event ChainSupportUpdated(uint256 indexed chainId, bool supported);

    /// @notice Emitted when bridge fee is updated
    event BridgeFeeUpdated(uint256 oldFee, uint256 newFee);

    /// @notice Emitted when notifier address is updated
    event NotifierUpdated(address indexed oldNotifier, address indexed newNotifier);

    /// @notice Emitted when Push Protocol configuration is updated
    event PushConfigUpdated(address indexed pushComm, address indexed channel);

    /// @notice Array storing all cross-chain payments
    CrossChainPayment[] public payments;

    /// @notice Mapping of authorized relayer addresses
    mapping(address => bool) public authorizedRelayers;

    /// @notice Mapping of supported chain IDs
    mapping(uint256 => bool) public supportedChains;

    /// @notice Mapping to track completed payment IDs from source chains
    mapping(bytes32 => bool) public processedPayments;

    /// @notice Address of the notification contract
    address public notifier;

    /// @notice Address of Push Protocol communicator
    address public pushComm;

    /// @notice Address of Push Protocol channel
    address public channel;

    /// @notice Timeout period for pending payments
    uint256 public constant PAYMENT_TIMEOUT = 24 hours;

    /// @notice Maximum length for payment reference strings
    uint256 public constant MAX_PAYMENT_REF_LENGTH = 256;

    /// @notice Bridge fee in native token
    uint256 public bridgeFee;

    /// @notice Minimum bridge fee (0.0001 ETH)
    uint256 public constant MIN_BRIDGE_FEE = 0.0001 ether;

    /// @notice Maximum bridge fee (1 ETH)
    uint256 public constant MAX_BRIDGE_FEE = 1 ether;

    /**
     * @notice Restricts function access to authorized relayers only
     */
    modifier onlyRelayer() {
        require(authorizedRelayers[msg.sender], "OmniPayBridge: Not authorized relayer");
        _;
    }

    /**
     * @notice Contract constructor
     * @param _notifier Notifier contract address
     * @param _pushComm Push Protocol communicator address
     * @param _channel Push Protocol channel address
     */
    constructor(
        address _notifier,
        address _pushComm,
        address _channel
    ) Ownable(msg.sender) {
        notifier = _notifier;
        pushComm = _pushComm;
        channel = _channel;
        bridgeFee = 0.001 ether;

        // Initialize supported chains
        _addSupportedChain(1);      // Ethereum Mainnet
        _addSupportedChain(8453);   // Base
        _addSupportedChain(137);    // Polygon
        _addSupportedChain(42161);  // Arbitrum One
        _addSupportedChain(10);     // Optimism
    }

    /**
     * @notice Updates the notifier contract address
     * @param _notifier New notifier address
     * @dev Only callable by contract owner
     */
    function setNotifier(address _notifier) external onlyOwner {
        address oldNotifier = notifier;
        notifier = _notifier;
        emit NotifierUpdated(oldNotifier, _notifier);
    }

    /**
     * @notice Updates Push Protocol configuration
     * @param _pushComm New Push communicator address
     * @param _channel New Push channel address
     * @dev Only callable by contract owner
     */
    function setPushConfig(address _pushComm, address _channel) external onlyOwner {
        pushComm = _pushComm;
        channel = _channel;
        emit PushConfigUpdated(_pushComm, _channel);
    }

    /**
     * @notice Updates the bridge fee
     * @param _fee New bridge fee amount
     * @dev Only callable by contract owner. Fee must be within min/max bounds
     */
    function setBridgeFee(uint256 _fee) external onlyOwner {
        require(_fee >= MIN_BRIDGE_FEE, "OmniPayBridge: Fee below minimum");
        require(_fee <= MAX_BRIDGE_FEE, "OmniPayBridge: Fee above maximum");
        
        uint256 oldFee = bridgeFee;
        bridgeFee = _fee;
        emit BridgeFeeUpdated(oldFee, _fee);
    }

    /**
     * @notice Adds an authorized relayer
     * @param _relayer Address to authorize as relayer
     * @dev Only callable by contract owner
     */
    function addRelayer(address _relayer) external onlyOwner {
        require(_relayer != address(0), "OmniPayBridge: Invalid relayer address");
        require(!authorizedRelayers[_relayer], "OmniPayBridge: Relayer already authorized");
        
        authorizedRelayers[_relayer] = true;
        emit RelayerAdded(_relayer);
    }

    /**
     * @notice Removes an authorized relayer
     * @param _relayer Address to remove from relayers
     * @dev Only callable by contract owner
     */
    function removeRelayer(address _relayer) external onlyOwner {
        require(authorizedRelayers[_relayer], "OmniPayBridge: Relayer not authorized");
        
        authorizedRelayers[_relayer] = false;
        emit RelayerRemoved(_relayer);
    }

    /**
     * @notice Adds support for a new chain
     * @param _chainId Chain ID to support
     * @dev Only callable by contract owner
     */
    function addSupportedChain(uint256 _chainId) external onlyOwner {
        require(!supportedChains[_chainId], "OmniPayBridge: Chain already supported");
        _addSupportedChain(_chainId);
    }

    /**
     * @notice Removes support for a chain
     * @param _chainId Chain ID to remove
     * @dev Only callable by contract owner
     */
    function removeSupportedChain(uint256 _chainId) external onlyOwner {
        require(supportedChains[_chainId], "OmniPayBridge: Chain not supported");
        require(_chainId != block.chainid, "OmniPayBridge: Cannot remove current chain");
        
        supportedChains[_chainId] = false;
        emit ChainSupportUpdated(_chainId, false);
    }

    /**
     * @notice Initiates a cross-chain payment
     * @param payee Recipient address on target chain
     * @param token Token contract address (address(0) for native ETH)
     * @param amount Amount to bridge
     * @param targetChainId Target chain ID
     * @param paymentRef Payment reference string
     * @return paymentId The ID of the created payment
     * @dev Locks tokens on source chain and emits event for relayers
     */
    function initiateCrossChainPayment(
        address payee,
        address token,
        uint256 amount,
        uint256 targetChainId,
        string calldata paymentRef
    ) external payable nonReentrant whenNotPaused returns (uint256 paymentId) {
        require(payee != address(0), "OmniPayBridge: Invalid payee address");
        require(amount > 0, "OmniPayBridge: Amount must be greater than zero");
        require(supportedChains[targetChainId], "OmniPayBridge: Unsupported target chain");
        require(targetChainId != block.chainid, "OmniPayBridge: Cannot bridge to same chain");
        require(bytes(paymentRef).length <= MAX_PAYMENT_REF_LENGTH, "OmniPayBridge: Payment ref too long");
        require(msg.value >= bridgeFee, "OmniPayBridge: Insufficient bridge fee");

        // Handle token transfers
        if (token == address(0)) {
            // Native ETH payment
            uint256 totalRequired = amount + bridgeFee;
            require(msg.value >= totalRequired, "OmniPayBridge: Insufficient ETH sent");
            
            // Refund excess
            if (msg.value > totalRequired) {
                (bool success, ) = msg.sender.call{value: msg.value - totalRequired}("");
                require(success, "OmniPayBridge: Excess refund failed");
            }
        } else {
            // ERC20 payment
            require(token.code.length > 0, "OmniPayBridge: Invalid token contract");
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        // Create payment record
        paymentId = payments.length;
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
                status: PaymentStatus.Initiated
            })
        );

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

        // Send Push notification (best effort)
        _sendPushNotification(
            msg.sender,
            "Cross-chain payment initiated",
            string(abi.encodePacked(
                "Payment initiated to ",
                _addressToString(payee),
                " on chain ",
                _uint2str(targetChainId)
            ))
        );
    }

    /**
     * @notice Completes a cross-chain payment on the target chain
     * @param paymentId Payment ID from source chain
     * @param payer Original payer address
     * @param payee Recipient address
     * @param token Token contract address
     * @param amount Amount to release
     * @param sourceChainId Source chain ID
     * @param paymentRef Payment reference
     * @dev Only callable by authorized relayers. Releases locked tokens to payee
     */
    function completeCrossChainPayment(
        uint256 paymentId,
        address payer,
        address payee,
        address token,
        uint256 amount,
        uint256 sourceChainId,
        string calldata paymentRef
    ) external onlyRelayer nonReentrant whenNotPaused {
        require(payee != address(0), "OmniPayBridge: Invalid payee address");
        require(amount > 0, "OmniPayBridge: Invalid amount");
        require(supportedChains[sourceChainId], "OmniPayBridge: Unsupported source chain");
        require(sourceChainId != block.chainid, "OmniPayBridge: Invalid source chain");

        // Generate unique payment hash to prevent double-processing
        bytes32 paymentHash = keccak256(
            abi.encodePacked(paymentId, payer, payee, token, amount, sourceChainId, paymentRef)
        );
        require(!processedPayments[paymentHash], "OmniPayBridge: Payment already processed");
        
        processedPayments[paymentHash] = true;

        // Release tokens to payee
        if (token == address(0)) {
            // Release native ETH
            require(address(this).balance >= amount, "OmniPayBridge: Insufficient ETH balance");
            (bool success, ) = payee.call{value: amount}("");
            require(success, "OmniPayBridge: ETH transfer failed");
        } else {
            // Release ERC20 tokens
            IERC20(token).safeTransfer(payee, amount);
        }

        // Create local payment record for completion tracking
        uint256 localPaymentId = payments.length;
        payments.push(
            CrossChainPayment({
                payer: payer,
                payee: payee,
                token: token,
                amount: amount,
                sourceChainId: sourceChainId,
                targetChainId: block.chainid,
                paymentRef: paymentRef,
                timestamp: block.timestamp,
                status: PaymentStatus.Completed
            })
        );

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
        _notifyPaymentSuccess(payer, payee, token, amount, paymentRef);

        // Send Push notification
        _sendPushNotification(
            payee,
            "Cross-chain payment received",
            string(abi.encodePacked(
                "Received ",
                _uint2str(amount),
                " tokens from ",
                _addressToString(payer)
            ))
        );
    }

    /**
     * @notice Refunds a timed-out or failed payment
     * @param paymentId Payment ID to refund
     * @dev Callable by payer after timeout, or by relayers/owner anytime
     */
    function refundPayment(uint256 paymentId) external nonReentrant {
        require(paymentId < payments.length, "OmniPayBridge: Invalid payment ID");
        CrossChainPayment storage payment = payments[paymentId];

        require(payment.status == PaymentStatus.Initiated, "OmniPayBridge: Payment not refundable");
        
        // Authorization checks
        bool isAuthorized = msg.sender == payment.payer ||
                           authorizedRelayers[msg.sender] ||
                           msg.sender == owner();
        bool isTimedOut = block.timestamp >= payment.timestamp + PAYMENT_TIMEOUT;
        
        require(
            isAuthorized || isTimedOut,
            "OmniPayBridge: Not authorized to refund"
        );

        payment.status = PaymentStatus.Refunded;

        // Process refund
        if (payment.token == address(0)) {
            // Refund native ETH
            (bool success, ) = payment.payer.call{value: payment.amount}("");
            require(success, "OmniPayBridge: ETH refund failed");
        } else {
            // Refund ERC20 tokens
            IERC20(payment.token).safeTransfer(payment.payer, payment.amount);
        }

        string memory reason = isTimedOut ? "Payment timed out" : "Payment refunded by authorized party";

        emit CrossChainPaymentRefunded(
            paymentId,
            payment.payer,
            payment.token,
            payment.amount,
            reason
        );

        // Notify failure
        _notifyPaymentFailure(
            payment.payer,
            payment.payee,
            payment.token,
            payment.amount,
            payment.paymentRef,
            reason
        );
    }

    /**
     * @notice Retrieves payment details
     * @param paymentId Payment ID
     * @return Payment struct containing all payment information
     */
    function getPayment(uint256 paymentId) external view returns (CrossChainPayment memory) {
        require(paymentId < payments.length, "OmniPayBridge: Invalid payment ID");
        return payments[paymentId];
    }

    /**
     * @notice Returns total number of payments
     * @return Total payment count
     */
    function paymentCount() external view returns (uint256) {
        return payments.length;
    }

    /**
     * @notice Retrieves all payment IDs for a specific payer
     * @param payer Payer address to query
     * @return Array of payment IDs
     */
    function getPayerPayments(address payer) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count matching payments
        for (uint256 i = 0; i < payments.length; i++) {
            if (payments[i].payer == payer) {
                count++;
            }
        }

        // Populate result array
        uint256[] memory payerPayments = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < payments.length; i++) {
            if (payments[i].payer == payer) {
                payerPayments[index] = i;
                index++;
            }
        }

        return payerPayments;
    }

    /**
     * @notice Retrieves payments within a range
     * @param startIndex Starting index (inclusive)
     * @param count Number of payments to retrieve
     * @return Array of payment structs
     */
    function getPayments(uint256 startIndex, uint256 count)
        external
        view
        returns (CrossChainPayment[] memory)
    {
        require(startIndex < payments.length, "OmniPayBridge: Start index out of bounds");
        
        uint256 endIndex = startIndex + count;
        if (endIndex > payments.length) {
            endIndex = payments.length;
        }
        
        uint256 resultCount = endIndex - startIndex;
        CrossChainPayment[] memory result = new CrossChainPayment[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = payments[startIndex + i];
        }
        
        return result;
    }

    /**
     * @notice Emergency withdrawal function for owner
     * @param token Token to withdraw (address(0) for native ETH)
     * @param amount Amount to withdraw
     * @dev Only callable by contract owner. Use with extreme caution
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            require(address(this).balance >= amount, "OmniPayBridge: Insufficient ETH balance");
            (bool success, ) = owner().call{value: amount}("");
            require(success, "OmniPayBridge: ETH withdrawal failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    /**
     * @notice Pauses all payment operations
     * @dev Only callable by contract owner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Resumes all payment operations
     * @dev Only callable by contract owner
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Internal function to add chain support
     * @param _chainId Chain ID to add
     */
    function _addSupportedChain(uint256 _chainId) private {
        supportedChains[_chainId] = true;
        emit ChainSupportUpdated(_chainId, true);
    }

    /**
     * @notice Internal function to send success notification
     * @param payer Payer address
     * @param payee Payee address
     * @param token Token address
     * @param amount Payment amount
     * @param paymentRef Payment reference
     */
    function _notifyPaymentSuccess(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) private {
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                payer,
                payee,
                token,
                amount,
                paymentRef
            ) {} catch {
                // Best-effort notification
            }
        }
    }

    /**
     * @notice Internal function to send failure notification
     * @param payer Payer address
     * @param payee Payee address
     * @param token Token address
     * @param amount Payment amount
     * @param paymentRef Payment reference
     * @param reason Failure reason
     */
    function _notifyPaymentFailure(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string memory paymentRef,
        string memory reason
    ) private {
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentFailure(
                payer,
                payee,
                token,
                amount,
                paymentRef,
                reason
            ) {} catch {
                // Best-effort notification
            }
        }
    }

    /**
     * @notice Internal function to send Push Protocol notifications
     * @param recipient Notification recipient
     * @param title Notification title
     * @param body Notification body
     */
    function _sendPushNotification(
        address recipient,
        string memory title,
        string memory body
    ) private {
        if (pushComm != address(0) && channel != address(0)) {
            try IPushCommInterface(pushComm).sendNotification(
                channel,
                recipient,
                abi.encodePacked(
                    "0",  // notification type
                    "+",  // delimiter
                    title,
                    "+",  // delimiter
                    body
                )
            ) {} catch {
                // Best-effort notification
            }
        }
    }

    /**
     * @notice Converts uint256 to string
     * @param _i Number to convert
     * @return String representation
     */
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
            uint8 temp = uint8(48 + (_i % 10));
            bstr[k] = bytes1(temp);
            _i /= 10;
        }
        
        return string(bstr);
    }

    /**
     * @notice Converts address to string (shortened format)
     * @param _addr Address to convert
     * @return String representation (0x...first4...last4)
     */
    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory data = abi.encodePacked(_addr);
        bytes memory str = new bytes(10);
        
        str[0] = "0";
        str[1] = "x";
        
        // First 4 chars after 0x
        for (uint256 i = 0; i < 4; i++) {
            str[2 + i] = alphabet[uint8(data[i] >> 4)];
        }
        
        str[6] = ".";
        str[7] = ".";
        str[8] = ".";
        str[9] = alphabet[uint8(data[19] & 0x0f)];
        
        return string(str);
    }

    /**
     * @notice Internal function to send success notification
     * @param payer Address that initiated the payment
     * @param payee Address that received the payment
     * @param token Token address (address(0) for ETH)
     * @param amount Payment amount
     * @param paymentRef Reference string for the payment
     * @dev Best-effort notification - failures are silently ignored
     */
    function _notifySuccess(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string memory paymentRef
    ) private {
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                payer,
                payee,
                token,
                amount,
                paymentRef
            ) {} catch {
                // Notification failure does not affect payment completion
            }
        }
    }

    /**
     * @notice Internal function to send failure notification
     * @param payer Address that initiated the payment
     * @param payee Address that should have received the payment
     * @param token Token address (address(0) for ETH)
     * @param amount Payment amount
     * @param paymentRef Reference string for the payment
     * @param reason Failure reason
     * @dev Best-effort notification - failures are silently ignored
     */
    function _notifyFailure(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string memory paymentRef,
        string memory reason
    ) private {
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentFailure(
                payer,
                payee,
                token,
                amount,
                paymentRef,
                reason
            ) {} catch {
                // Notification failure does not affect payment processing
            }
        }
    }

    /**
     * @notice Receives native ETH for liquidity
     */
    receive() external payable {}
}