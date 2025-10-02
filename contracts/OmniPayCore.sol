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

contract OmniPayCore is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Transaction {
        address payer;
        address payee;
        address token; // address(0) for ETH
        uint256 amount;
        uint256 timestamp;
        string paymentRef;
    }

    event PaymentInitiated(
        address indexed payer,
        address indexed payee,
        address indexed token,
        uint256 amount,
        string paymentRef
    );

    event PaymentCompleted(
        uint256 indexed txId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string paymentRef
    );

    Transaction[] public transactions;
    address public notifier;

    constructor(address _notifier) {
        notifier = _notifier;
    }

    function setNotifier(address _notifier) external onlyOwner {
        notifier = _notifier;
    }

    /// @notice Pay in ETH to a payee with a payment reference
    /// @param payee Recipient of the payment
    /// @param paymentRef Arbitrary reference string for the payment
    function payETH(address payable payee, string calldata paymentRef)
        external
        payable
        nonReentrant
    {
        require(payee != address(0), "Invalid payee");
        require(msg.value > 0, "No ETH sent");

        emit PaymentInitiated(msg.sender, payee, address(0), msg.value, paymentRef);

        (bool ok, ) = payee.call{value: msg.value}("");
        require(ok, "ETH transfer failed");

        transactions.push(
            Transaction({
                payer: msg.sender,
                payee: payee,
                token: address(0),
                amount: msg.value,
                timestamp: block.timestamp,
                paymentRef: paymentRef
            })
        );
        uint256 txId = transactions.length - 1;
        emit PaymentCompleted(txId, msg.sender, payee, address(0), msg.value, paymentRef);

        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                msg.sender,
                payee,
                address(0),
                msg.value,
                paymentRef
            ) {} catch {
                // Best-effort notification; ignore failures
            }
        }
    }

    /// @notice Pay in ERC20 to a payee with a payment reference
    /// @param token ERC-20 token contract address
    /// @param payee Recipient of the payment
    /// @param amount Token amount to transfer
    /// @param paymentRef Arbitrary reference string for the payment
    function payERC20(
        IERC20 token,
        address payee,
        uint256 amount,
        string calldata paymentRef
    ) external nonReentrant {
        require(address(token) != address(0), "Invalid token");
        require(payee != address(0), "Invalid payee");
        require(amount > 0, "Amount = 0");

        emit PaymentInitiated(msg.sender, payee, address(token), amount, paymentRef);

        token.safeTransferFrom(msg.sender, payee, amount);

        transactions.push(
            Transaction({
                payer: msg.sender,
                payee: payee,
                token: address(token),
                amount: amount,
                timestamp: block.timestamp,
                paymentRef: paymentRef
            })
        );
        uint256 txId = transactions.length - 1;
        emit PaymentCompleted(txId, msg.sender, payee, address(token), amount, paymentRef);

        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                msg.sender,
                payee,
                address(token),
                amount,
                paymentRef
            ) {} catch {
                // ignore notifier failures
            }
        }
    }

    /// @notice Returns the total number of recorded transactions
    function transactionCount() external view returns (uint256) {
        return transactions.length;
    }
}