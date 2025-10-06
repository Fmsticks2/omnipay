// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IPUSHCommInterface
 * @notice Minimal interface for Push Protocol (formerly EPNS) communication
 * @dev This interface should be adjusted based on the actual Push Protocol version being used
 */
interface IPUSHCommInterface {
    /**
     * @notice Send a notification through Push Protocol
     * @param channel Channel address sending the notification
     * @param recipient Address of the notification recipient
     * @param identity Encoded notification payload
     */
    function sendNotification(
        address channel,
        address recipient,
        bytes calldata identity
    ) external;
}

/**
 * @title OmniPayNotifier
 * @notice Centralized notification system for OmniPay ecosystem events
 * @dev Integrates with Push Protocol for decentralized notifications and emits events for off-chain indexing
 */
contract OmniPayNotifier is Ownable, AccessControl {
    /// @notice Role identifier for authorized notifier contracts
    bytes32 public constant NOTIFIER_ROLE = keccak256("NOTIFIER_ROLE");

    /// @notice Notification type enumeration for categorization
    enum NotificationType {
        PaymentSuccess,
        PaymentFailure,
        SubscriptionExecuted,
        SubscriptionCancelled,
        SubscriptionRenewalDue,
        Custom
    }

    /// @notice Push Protocol communication interface
    IPUSHCommInterface public pushComm;

    /// @notice Push Protocol channel address for this notifier
    address public channel;

    /// @notice Whether Push notifications are enabled
    bool public pushEnabled;

    /// @notice Emitted when Push Protocol configuration is updated
    event NotifierConfigured(
        address indexed pushComm,
        address indexed channel,
        bool pushEnabled
    );

    /// @notice Emitted before a subscription renewal is due
    event BeforeRenewal(
        uint256 indexed subId,
        address indexed subscriber,
        address indexed merchant,
        uint256 amount,
        uint256 nextPaymentDue
    );

    /// @notice Emitted when a payment succeeds
    event PaymentSuccess(
        address indexed payer,
        address indexed payee,
        address indexed token,
        uint256 amount,
        string paymentRef
    );

    /// @notice Emitted when a payment fails
    event PaymentFailure(
        address indexed payer,
        address indexed payee,
        address indexed token,
        uint256 amount,
        string paymentRef,
        string reason
    );

    /// @notice Emitted when a subscription payment is executed
    event SubscriptionExecuted(
        uint256 indexed subId,
        address indexed subscriber,
        address indexed merchant,
        address token,
        uint256 amount,
        uint256 nextPaymentDue
    );

    /// @notice Emitted when a subscription is cancelled
    event SubscriptionCancelled(
        uint256 indexed subId,
        address indexed subscriber,
        address indexed merchant
    );

    /// @notice Emitted when a Push notification is attempted
    event PushAttempt(
        address indexed recipient,
        NotificationType notificationType,
        bool success,
        bytes identity
    );

    /// @notice Emitted when a custom notification is sent
    event CustomNotification(
        address indexed recipient,
        string title,
        string body,
        bytes metadata
    );

    /// @notice Thrown when an invalid address is provided
    error InvalidAddress();

    /// @notice Thrown when Push Protocol is not properly configured
    error PushNotConfigured();

    /// @notice Thrown when caller lacks required authorization
    error UnauthorizedCaller();

    /**
     * @notice Contract constructor
     * @param initialOwner Address that will own the contract
     * @param _pushComm Address of Push Protocol communication contract
     * @param _channel Address of the Push Protocol channel
     */
    constructor(
        address initialOwner,
        address _pushComm,
        address _channel
    ) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(NOTIFIER_ROLE, initialOwner);

        if (_pushComm != address(0)) {
            pushComm = IPUSHCommInterface(_pushComm);
            pushEnabled = true;
        }
        channel = _channel;

        emit NotifierConfigured(_pushComm, _channel, pushEnabled);
    }

    /**
     * @notice Update Push Protocol communication contract address
     * @param _pushComm New Push Protocol contract address
     */
    function setPushComm(address _pushComm) external onlyOwner {
        pushComm = IPUSHCommInterface(_pushComm);
        pushEnabled = _pushComm != address(0);
        emit NotifierConfigured(_pushComm, channel, pushEnabled);
    }

    /**
     * @notice Update Push Protocol channel address
     * @param _channel New channel address
     */
    function setChannel(address _channel) external onlyOwner {
        channel = _channel;
        emit NotifierConfigured(address(pushComm), _channel, pushEnabled);
    }

    /**
     * @notice Enable or disable Push notifications
     * @param enabled True to enable, false to disable
     */
    function setPushEnabled(bool enabled) external onlyOwner {
        pushEnabled = enabled;
        emit NotifierConfigured(address(pushComm), channel, enabled);
    }

    /**
     * @notice Grant notifier role to an address
     * @param notifier Address to grant role to
     */
    function grantNotifierRole(address notifier) external onlyOwner {
        if (notifier == address(0)) revert InvalidAddress();
        _grantRole(NOTIFIER_ROLE, notifier);
    }

    /**
     * @notice Revoke notifier role from an address
     * @param notifier Address to revoke role from
     */
    function revokeNotifierRole(address notifier) external onlyOwner {
        _revokeRole(NOTIFIER_ROLE, notifier);
    }

    /**
     * @notice Notify subscriber before renewal is due
     * @param subId Subscription identifier
     * @param subscriber Subscriber address
     * @param merchant Merchant address
     * @param amount Payment amount
     * @param nextPaymentDue Timestamp when payment is due
     */
    function notifyBeforeRenewal(
        uint256 subId,
        address subscriber,
        address merchant,
        uint256 amount,
        uint256 nextPaymentDue
    ) external onlyRole(NOTIFIER_ROLE) {
        emit BeforeRenewal(subId, subscriber, merchant, amount, nextPaymentDue);

        _sendPushNotification(
            subscriber,
            NotificationType.SubscriptionRenewalDue,
            _buildIdentity(
                "Subscription Renewal Due",
                "Your subscription payment is due soon. Please ensure sufficient balance."
            )
        );

        _sendPushNotification(
            merchant,
            NotificationType.SubscriptionRenewalDue,
            _buildIdentity(
                "Upcoming Subscription Payment",
                "A subscriber has an upcoming payment due."
            )
        );
    }

    /**
     * @notice Notify parties after payment success
     * @param payer Address that initiated payment
     * @param payee Address that received payment
     * @param token Token address (address(0) for ETH)
     * @param amount Payment amount
     * @param paymentRef External payment reference
     */
    function notifyPaymentSuccess(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) external onlyRole(NOTIFIER_ROLE) {
        emit PaymentSuccess(payer, payee, token, amount, paymentRef);

        _sendPushNotification(
            payer,
            NotificationType.PaymentSuccess,
            _buildIdentity(
                "Payment Successful",
                string(abi.encodePacked("Your payment of ", _formatAmount(amount), " was completed successfully."))
            )
        );

        _sendPushNotification(
            payee,
            NotificationType.PaymentSuccess,
            _buildIdentity(
                "Payment Received",
                string(abi.encodePacked("You received a payment of ", _formatAmount(amount), "."))
            )
        );
    }

    /**
     * @notice Notify parties after payment failure
     * @param payer Address that initiated payment
     * @param payee Address that should have received payment
     * @param token Token address (address(0) for ETH)
     * @param amount Payment amount
     * @param paymentRef External payment reference
     * @param reason Failure reason
     */
    function notifyPaymentFailure(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef,
        string calldata reason
    ) external onlyRole(NOTIFIER_ROLE) {
        emit PaymentFailure(payer, payee, token, amount, paymentRef, reason);

        string memory payerBody = string(
            abi.encodePacked("Your payment of ", _formatAmount(amount), " failed. Reason: ", reason)
        );
        _sendPushNotification(
            payer,
            NotificationType.PaymentFailure,
            _buildIdentity("Payment Failed", payerBody)
        );

        string memory payeeBody = string(
            abi.encodePacked("Expected payment of ", _formatAmount(amount), " failed. Reason: ", reason)
        );
        _sendPushNotification(
            payee,
            NotificationType.PaymentFailure,
            _buildIdentity("Payment Failed", payeeBody)
        );
    }

    /**
     * @notice Notify after subscription payment execution
     * @param subId Subscription identifier
     * @param subscriber Subscriber address
     * @param merchant Merchant address
     * @param token Token address (address(0) for ETH)
     * @param amount Payment amount
     * @param nextPaymentDue Timestamp when next payment is due
     */
    function notifySubscriptionExecuted(
        uint256 subId,
        address subscriber,
        address merchant,
        address token,
        uint256 amount,
        uint256 nextPaymentDue
    ) external onlyRole(NOTIFIER_ROLE) {
        emit SubscriptionExecuted(subId, subscriber, merchant, token, amount, nextPaymentDue);

        _sendPushNotification(
            subscriber,
            NotificationType.SubscriptionExecuted,
            _buildIdentity(
                "Subscription Payment Processed",
                string(abi.encodePacked("Your subscription of ", _formatAmount(amount), " was charged successfully."))
            )
        );

        _sendPushNotification(
            merchant,
            NotificationType.SubscriptionExecuted,
            _buildIdentity(
                "Subscription Payment Received",
                string(abi.encodePacked("Received subscription payment of ", _formatAmount(amount), "."))
            )
        );
    }

    /**
     * @notice Notify after subscription cancellation
     * @param subId Subscription identifier
     * @param subscriber Subscriber address
     * @param merchant Merchant address
     */
    function notifySubscriptionCancelled(
        uint256 subId,
        address subscriber,
        address merchant
    ) external onlyRole(NOTIFIER_ROLE) {
        emit SubscriptionCancelled(subId, subscriber, merchant);

        _sendPushNotification(
            subscriber,
            NotificationType.SubscriptionCancelled,
            _buildIdentity(
                "Subscription Cancelled",
                "Your subscription has been cancelled successfully."
            )
        );

        _sendPushNotification(
            merchant,
            NotificationType.SubscriptionCancelled,
            _buildIdentity(
                "Subscription Cancelled",
                "A subscriber has cancelled their subscription."
            )
        );
    }

    /**
     * @notice Send a custom notification to a recipient
     * @param recipient Address to receive notification
     * @param title Notification title
     * @param body Notification body
     * @param metadata Additional metadata (optional)
     */
    function sendCustomNotification(
        address recipient,
        string calldata title,
        string calldata body,
        bytes calldata metadata
    ) external onlyRole(NOTIFIER_ROLE) {
        if (recipient == address(0)) revert InvalidAddress();

        emit CustomNotification(recipient, title, body, metadata);

        _sendPushNotification(
            recipient,
            NotificationType.Custom,
            _buildIdentity(title, body)
        );
    }

    /**
     * @notice Send bulk notifications to multiple recipients
     * @param recipients Array of recipient addresses
     * @param title Notification title
     * @param body Notification body
     */
    function sendBulkNotification(
        address[] calldata recipients,
        string calldata title,
        string calldata body
    ) external onlyRole(NOTIFIER_ROLE) {
        bytes memory identity = _buildIdentity(title, body);

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] != address(0)) {
                _sendPushNotification(recipients[i], NotificationType.Custom, identity);
            }
        }
    }

    /**
     * @dev Internal function to send Push notification
     * @param recipient Notification recipient
     * @param notificationType Type of notification
     * @param identity Encoded notification payload
     */
    function _sendPushNotification(
        address recipient,
        NotificationType notificationType,
        bytes memory identity
    ) internal {
        if (!pushEnabled || address(pushComm) == address(0) || channel == address(0)) {
            emit PushAttempt(recipient, notificationType, false, identity);
            return;
        }

        try pushComm.sendNotification(channel, recipient, identity) {
            emit PushAttempt(recipient, notificationType, true, identity);
        } catch {
            emit PushAttempt(recipient, notificationType, false, identity);
        }
    }

    /**
     * @dev Build notification identity payload according to Push Protocol format
     * @param title Notification title
     * @param body Notification body
     * @return Encoded identity bytes
     */
    function _buildIdentity(string memory title, string memory body)
        internal
        pure
        returns (bytes memory)
    {
        // Push Protocol notification format: "0+title+body"
        // The format may need adjustment based on Push Protocol version
        string memory payload = string(
            abi.encodePacked(
                "0", // Notification type (0 for basic notification)
                "+",
                title,
                "+",
                body
            )
        );
        return bytes(payload);
    }

    /**
     * @dev Format amount for display in notifications
     * @param amount Amount to format
     * @return Formatted string representation
     */
    function _formatAmount(uint256 amount) internal pure returns (string memory) {
        // Simple amount formatting - can be enhanced for better readability
        return _uintToString(amount);
    }

    /**
     * @dev Convert uint256 to string
     * @param value Value to convert
     * @return String representation
     */
    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }

        return string(buffer);
    }
}