// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Minimal PUSH Comm interface used for notifications.
/// The exact signature may vary; adjust if needed during integration.
interface IPUSHCommInterface {
    function sendNotification(address channel, address recipient, bytes calldata identity) external;
}

contract OmniPayNotifier is Ownable {
    IPUSHCommInterface public pushComm;
    address public channel;

    event NotifierConfigured(address indexed pushComm, address indexed channel);

    event BeforeRenewal(
        uint256 indexed subId,
        address indexed subscriber,
        address indexed merchant,
        uint256 amount,
        uint256 nextPaymentDue
    );
    event PaymentSuccess(
        address indexed payer,
        address indexed payee,
        address indexed token,
        uint256 amount,
        string paymentRef
    );
    event PaymentFailure(
        address indexed payer,
        address indexed payee,
        address indexed token,
        uint256 amount,
        string paymentRef,
        string reason
    );
    event SubscriptionExecuted(
        uint256 indexed subId,
        address indexed subscriber,
        address indexed merchant,
        address token,
        uint256 amount,
        uint256 nextPaymentDue
    );
    event SubscriptionCancelled(uint256 indexed subId, address indexed subscriber, address indexed merchant);
    event PushAttempt(address indexed recipient, bool success, bytes identity);

    constructor(address _pushComm, address _channel) {
        if (_pushComm != address(0)) {
            pushComm = IPUSHCommInterface(_pushComm);
        }
        channel = _channel;
        emit NotifierConfigured(_pushComm, _channel);
    }

    function setPushComm(address _pushComm) external onlyOwner {
        pushComm = IPUSHCommInterface(_pushComm);
        emit NotifierConfigured(address(pushComm), channel);
    }

    function setChannel(address _channel) external onlyOwner {
        channel = _channel;
        emit NotifierConfigured(address(pushComm), channel);
    }

    /// @notice Notify subscriber before renewal is due
    function notifyBeforeRenewal(
        uint256 subId,
        address subscriber,
        address merchant,
        uint256 amount,
        uint256 nextPaymentDue
    ) external {
        emit BeforeRenewal(subId, subscriber, merchant, amount, nextPaymentDue);
        _push(subscriber, _identity("Renewal upcoming", "Your subscription is due soon."));
    }

    /// @notice Notify parties after payment success
    function notifyPaymentSuccess(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) external {
        emit PaymentSuccess(payer, payee, token, amount, paymentRef);
        _push(payer, _identity("Payment Success", "Your payment completed successfully."));
        _push(payee, _identity("Payment Received", "You received a payment."));
    }

    /// @notice Notify parties after payment failure
    function notifyPaymentFailure(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef,
        string calldata reason
    ) external {
        emit PaymentFailure(payer, payee, token, amount, paymentRef, reason);
        _push(payer, _identity("Payment Failed", reason));
        _push(payee, _identity("Payment Failed", reason));
    }

    /// @notice Notify after subscription executed
    function notifySubscriptionExecuted(
        uint256 subId,
        address subscriber,
        address merchant,
        address token,
        uint256 amount,
        uint256 nextPaymentDue
    ) external {
        emit SubscriptionExecuted(subId, subscriber, merchant, token, amount, nextPaymentDue);
        _push(subscriber, _identity("Subscription Paid", "Your subscription was charged."));
        _push(merchant, _identity("Payment Received", "A subscription payment was received."));
    }

    /// @notice Notify after subscription cancelled
    function notifySubscriptionCancelled(uint256 subId, address subscriber, address merchant) external {
        emit SubscriptionCancelled(subId, subscriber, merchant);
        _push(subscriber, _identity("Subscription Cancelled", "You cancelled your subscription."));
        _push(merchant, _identity("Subscription Cancelled", "A subscriber cancelled their subscription."));
    }

    function _push(address recipient, bytes memory identity) internal {
        if (address(pushComm) == address(0) || channel == address(0)) {
            emit PushAttempt(recipient, false, identity);
            return;
        }
        try pushComm.sendNotification(channel, recipient, identity) {
            emit PushAttempt(recipient, true, identity);
        } catch {
            emit PushAttempt(recipient, false, identity);
        }
    }

    function _identity(string memory title, string memory body) internal pure returns (bytes memory) {
        // Simple identity payload (title||body) — adjust to PUSH spec as needed
        string memory payload = string(abi.encodePacked("title::", title, "||body::", body));
        return bytes(payload);
    }
}