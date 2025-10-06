// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

/**
 * @title IOmniPayNotifier
 * @notice Interface for external notification systems to receive payment status updates
 */
interface IOmniPayNotifier {
    /**
     * @notice Notify external system of successful payment
     * @param payer Address that initiated the payment
     * @param payee Address that received the payment
     * @param token Token address (address(0) for native ETH)
     * @param amount Payment amount
     * @param paymentRef External reference identifier for the payment
     */
    function notifyPaymentSuccess(
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) external;

    /**
     * @notice Notify external system of failed payment
     * @param payer Address that initiated the payment
     * @param payee Address that should have received the payment
     * @param token Token address (address(0) for native ETH)
     * @param amount Payment amount
     * @param paymentRef External reference identifier for the payment
     * @param reason Failure reason description
     */
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
 * @title OmniPaySettlement
 * @notice A flexible payment settlement contract supporting ERC20 tokens and native ETH
 * @dev Supports both standard approve/transferFrom flow and gasless EIP-2612 permit signatures
 * @custom:security-contact security@omnipay.example
 */
contract OmniPaySettlement is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @notice Settlement status enumeration
    enum SettlementStatus {
        Pending,
        Executed,
        Cancelled
    }

    /**
     * @notice Settlement structure containing all payment details
     * @param payer Address initiating the payment
     * @param payee Address receiving the payment
     * @param token Token contract address (address(0) for native ETH)
     * @param amount Payment amount in token's smallest unit
     * @param timestamp Block timestamp when settlement was created
     * @param paymentRef External reference string for tracking
     * @param status Current status of the settlement
     * @param executor Address that executed the settlement (address(0) if not executed)
     */
    struct Settlement {
        address payer;
        address payee;
        address token;
        uint256 amount;
        uint256 timestamp;
        string paymentRef;
        SettlementStatus status;
        address executor;
    }

    /// @notice Emitted when a new settlement is created
    event SettlementCreated(
        uint256 indexed settlementId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string paymentRef
    );

    /// @notice Emitted when a settlement is successfully executed
    event SettlementExecuted(
        uint256 indexed settlementId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        address executor,
        string paymentRef
    );

    /// @notice Emitted when a settlement is cancelled by the payer
    event SettlementCancelled(
        uint256 indexed settlementId,
        address indexed payer,
        string paymentRef
    );

    /// @notice Emitted when a settlement fails
    event SettlementFailed(
        uint256 indexed settlementId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string paymentRef,
        string reason
    );

    /// @notice Emitted when the notifier address is updated
    event NotifierUpdated(address indexed oldNotifier, address indexed newNotifier);

    /// @notice Array storing all settlements
    Settlement[] public settlements;

    /// @notice Address of the external notifier contract
    address public notifier;

    /// @notice Maximum length for payment reference strings
    uint256 public constant MAX_PAYMENT_REF_LENGTH = 256;

    /// @notice Settlement expiration period (30 days)
    uint256 public constant SETTLEMENT_EXPIRY = 30 days;

    /// @notice Mapping to track if a permit signature has been used (prevents replay)
    mapping(bytes32 => bool) public usedPermits;

    /// @notice Thrown when an invalid address is provided
    error InvalidAddress();

    /// @notice Thrown when an invalid amount is provided
    error InvalidAmount();

    /// @notice Thrown when an invalid settlement ID is provided
    error InvalidSettlementId();

    /// @notice Thrown when attempting to execute an already executed settlement
    error SettlementAlreadyExecuted();

    /// @notice Thrown when using the wrong execution method for the token type
    error InvalidExecutionMethod();

    /// @notice Thrown when unauthorized access is attempted
    error UnauthorizedAccess();

    /// @notice Thrown when incorrect ETH amount is sent
    error IncorrectEthAmount();

    /// @notice Thrown when ETH transfer fails
    error EthTransferFailed();

    /// @notice Thrown when attempting to cancel an already executed settlement
    error CannotCancelExecutedSettlement();

    /// @notice Thrown when payment reference exceeds maximum length
    error PaymentRefTooLong();

    /// @notice Thrown when settlement has expired
    error SettlementExpired();

    /// @notice Thrown when permit signature has already been used
    error PermitAlreadyUsed();

    /// @notice Thrown when token contract validation fails
    error InvalidTokenContract();

    /**
     * @notice Contract constructor
     * @param initialOwner Address that will own the contract
     * @param _notifier Address of the notification contract
     */
    constructor(address initialOwner, address _notifier) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert InvalidAddress();
        notifier = _notifier;
    }

    /**
     * @notice Update the notifier contract address
     * @param _notifier New notifier contract address (address(0) to disable)
     * @dev Only callable by contract owner
     */
    function setNotifier(address _notifier) external onlyOwner {
        address oldNotifier = notifier;
        notifier = _notifier;
        emit NotifierUpdated(oldNotifier, _notifier);
    }

    /**
     * @notice Create a new settlement that can be executed later
     * @param payee Recipient address
     * @param token ERC20 token address (use address(0) for native ETH)
     * @param amount Amount to be settled
     * @param paymentRef External reference string for payment tracking
     * @return settlementId The ID of the newly created settlement
     * @dev Settlement creation does not transfer funds - use execute functions for that
     */
    function createSettlement(
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) external whenNotPaused returns (uint256 settlementId) {
        if (payee == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (bytes(paymentRef).length > MAX_PAYMENT_REF_LENGTH) revert PaymentRefTooLong();

        // Validate token contract if not ETH
        if (token != address(0) && token.code.length == 0) {
            revert InvalidTokenContract();
        }

        settlementId = settlements.length;

        settlements.push(
            Settlement({
                payer: msg.sender,
                payee: payee,
                token: token,
                amount: amount,
                timestamp: block.timestamp,
                paymentRef: paymentRef,
                status: SettlementStatus.Pending,
                executor: address(0)
            })
        );

        emit SettlementCreated(settlementId, msg.sender, payee, token, amount, paymentRef);
    }

    /**
     * @notice Execute an ERC20 settlement with pre-approved tokens
     * @dev Payer must have approved this contract to spend tokens before calling
     * @dev Can be called by anyone if payer has approved the contract
     * @param settlementId ID of the settlement to execute
     */
    function executeSettlement(uint256 settlementId) external nonReentrant whenNotPaused {
        Settlement storage settlement = _validateAndGetSettlement(settlementId);
        if (settlement.token == address(0)) revert InvalidExecutionMethod();

        _executeSettlement(settlement, settlementId, msg.sender);

        IERC20(settlement.token).safeTransferFrom(
            settlement.payer,
            settlement.payee,
            settlement.amount
        );
    }

    /**
     * @notice Execute an ERC20 settlement using EIP-2612 permit signature
     * @dev Enables gasless approval - payer doesn't need to send approval transaction first
     * @dev Can be called by anyone with valid permit signature
     * @param settlementId ID of the settlement to execute
     * @param deadline Permit expiration timestamp
     * @param v ECDSA signature parameter
     * @param r ECDSA signature parameter
     * @param s ECDSA signature parameter
     */
    function executeSettlementWithPermit(
        uint256 settlementId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant whenNotPaused {
        Settlement storage settlement = _validateAndGetSettlement(settlementId);
        if (settlement.token == address(0)) revert InvalidExecutionMethod();

        // Check permit hasn't been used (prevent replay attacks)
        bytes32 permitHash = keccak256(
            abi.encodePacked(settlementId, deadline, v, r, s)
        );
        if (usedPermits[permitHash]) revert PermitAlreadyUsed();
        usedPermits[permitHash] = true;

        _executeSettlement(settlement, settlementId, msg.sender);

        // Execute permit to grant approval
        IERC20Permit(settlement.token).permit(
            settlement.payer,
            address(this),
            settlement.amount,
            deadline,
            v,
            r,
            s
        );

        // Transfer tokens from payer to payee
        IERC20(settlement.token).safeTransferFrom(
            settlement.payer,
            settlement.payee,
            settlement.amount
        );
    }

    /**
     * @notice Execute a native ETH settlement
     * @dev Only the payer can execute and must send exact amount
     * @param settlementId ID of the settlement to execute
     */
    function executeETHSettlement(uint256 settlementId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Settlement storage settlement = _validateAndGetSettlement(settlementId);
        if (settlement.token != address(0)) revert InvalidExecutionMethod();
        if (msg.sender != settlement.payer) revert UnauthorizedAccess();
        if (msg.value != settlement.amount) revert IncorrectEthAmount();

        _executeSettlement(settlement, settlementId, msg.sender);

        (bool success, ) = settlement.payee.call{value: settlement.amount}("");
        if (!success) revert EthTransferFailed();
    }

    /**
     * @notice Execute a settlement by anyone on behalf of payer (with pre-approval)
     * @dev Useful for third-party relayers or automated systems
     * @param settlementId ID of the settlement to execute
     */
    function executeSettlementOnBehalf(uint256 settlementId) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Settlement storage settlement = _validateAndGetSettlement(settlementId);
        if (settlement.token == address(0)) revert InvalidExecutionMethod();

        _executeSettlement(settlement, settlementId, msg.sender);

        IERC20(settlement.token).safeTransferFrom(
            settlement.payer,
            settlement.payee,
            settlement.amount
        );
    }

    /**
     * @notice Cancel a pending settlement
     * @dev Only the payer can cancel, and only before execution
     * @param settlementId ID of the settlement to cancel
     */
    function cancelSettlement(uint256 settlementId) external {
        if (settlementId >= settlements.length) revert InvalidSettlementId();

        Settlement storage settlement = settlements[settlementId];
        if (msg.sender != settlement.payer && msg.sender != owner()) {
            revert UnauthorizedAccess();
        }
        if (settlement.status != SettlementStatus.Pending) {
            revert CannotCancelExecutedSettlement();
        }

        settlement.status = SettlementStatus.Cancelled;

        emit SettlementCancelled(settlementId, settlement.payer, settlement.paymentRef);

        // Notify cancellation
        _notifyPaymentFailure(settlement, "Settlement cancelled by payer");
    }

    /**
     * @notice Batch cancel multiple settlements
     * @dev Only callable by payer of all settlements
     * @param settlementIds Array of settlement IDs to cancel
     */
    function batchCancelSettlements(uint256[] calldata settlementIds) external {
        for (uint256 i = 0; i < settlementIds.length; i++) {
            uint256 settlementId = settlementIds[i];
            if (settlementId >= settlements.length) continue;

            Settlement storage settlement = settlements[settlementId];
            if (settlement.payer != msg.sender) continue;
            if (settlement.status != SettlementStatus.Pending) continue;

            settlement.status = SettlementStatus.Cancelled;
            emit SettlementCancelled(settlementId, settlement.payer, settlement.paymentRef);
            _notifyPaymentFailure(settlement, "Settlement cancelled by payer");
        }
    }

    /**
     * @notice Retrieve settlement details
     * @param settlementId ID of the settlement
     * @return Settlement struct containing all settlement data
     */
    function getSettlement(uint256 settlementId) external view returns (Settlement memory) {
        if (settlementId >= settlements.length) revert InvalidSettlementId();
        return settlements[settlementId];
    }

    /**
     * @notice Get total number of settlements created
     * @return Total settlement count
     */
    function settlementCount() external view returns (uint256) {
        return settlements.length;
    }

    /**
     * @notice Get all settlement IDs for a specific payer
     * @param payer Address of the payer
     * @return Array of settlement IDs
     */
    function getPayerSettlements(address payer) external view returns (uint256[] memory) {
        return _getSettlementsByAddress(payer, true);
    }

    /**
     * @notice Get all settlement IDs for a specific payee
     * @param payee Address of the payee
     * @return Array of settlement IDs
     */
    function getPayeeSettlements(address payee) external view returns (uint256[] memory) {
        return _getSettlementsByAddress(payee, false);
    }

    /**
     * @notice Get settlements with specific status
     * @param status Status to filter by
     * @param startIndex Starting index for pagination
     * @param count Number of settlements to return
     * @return Array of settlements matching the status
     */
    function getSettlementsByStatus(
        SettlementStatus status,
        uint256 startIndex,
        uint256 count
    ) external view returns (Settlement[] memory) {
        uint256 totalCount = settlements.length;
        uint256[] memory matchingIds = new uint256[](totalCount);
        uint256 matchCount = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (settlements[i].status == status) {
                matchingIds[matchCount] = i;
                matchCount++;
            }
        }

        // Calculate return array size
        uint256 returnStart = startIndex > matchCount ? matchCount : startIndex;
        uint256 returnEnd = returnStart + count > matchCount ? matchCount : returnStart + count;
        uint256 returnSize = returnEnd - returnStart;

        Settlement[] memory result = new Settlement[](returnSize);
        for (uint256 i = 0; i < returnSize; i++) {
            result[i] = settlements[matchingIds[returnStart + i]];
        }

        return result;
    }

    /**
     * @notice Check if a settlement has expired
     * @param settlementId ID of the settlement
     * @return True if settlement has expired
     */
    function isSettlementExpired(uint256 settlementId) external view returns (bool) {
        if (settlementId >= settlements.length) revert InvalidSettlementId();
        Settlement storage settlement = settlements[settlementId];
        return block.timestamp > settlement.timestamp + SETTLEMENT_EXPIRY;
    }

    /**
     * @notice Pauses all settlement operations
     * @dev Only callable by contract owner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Resumes all settlement operations
     * @dev Only callable by contract owner
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdrawal function for owner
     * @param token Token to withdraw (address(0) for native ETH)
     * @param amount Amount to withdraw
     * @dev Only callable by contract owner. Use with extreme caution
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = owner().call{value: amount}("");
            if (!success) revert EthTransferFailed();
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    /**
     * @dev Internal function to validate settlement and return storage reference
     * @param settlementId ID of the settlement to validate
     * @return settlement Storage reference to the settlement
     */
    function _validateAndGetSettlement(uint256 settlementId)
        internal
        view
        returns (Settlement storage settlement)
    {
        if (settlementId >= settlements.length) revert InvalidSettlementId();
        settlement = settlements[settlementId];
        if (settlement.status != SettlementStatus.Pending) {
            revert SettlementAlreadyExecuted();
        }
        if (block.timestamp > settlement.timestamp + SETTLEMENT_EXPIRY) {
            revert SettlementExpired();
        }
    }

    /**
     * @dev Internal function to mark settlement as executed
     * @param settlement The settlement to execute
     * @param settlementId The settlement ID
     * @param executor Address executing the settlement
     */
    function _executeSettlement(
        Settlement storage settlement,
        uint256 settlementId,
        address executor
    ) internal {
        settlement.status = SettlementStatus.Executed;
        settlement.executor = executor;

        emit SettlementExecuted(
            settlementId,
            settlement.payer,
            settlement.payee,
            settlement.token,
            settlement.amount,
            executor,
            settlement.paymentRef
        );
    }

    /**
     * @dev Internal function to notify external system of successful payment
     * @param settlement The executed settlement
     * @param settlementId The settlement ID (unused but kept for extensibility)
     */
    function _notifyPaymentSuccess(
        Settlement storage settlement,
        uint256 settlementId
    ) internal {
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                settlement.payer,
                settlement.payee,
                settlement.token,
                settlement.amount,
                settlement.paymentRef
            ) {} catch {
                // Best-effort notification; failures are silently ignored
            }
        }
    }

    /**
     * @dev Internal function to notify external system of failed payment
     * @param settlement The failed settlement
     * @param reason Failure reason
     */
    function _notifyPaymentFailure(
        Settlement storage settlement,
        string memory reason
    ) internal {
        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentFailure(
                settlement.payer,
                settlement.payee,
                settlement.token,
                settlement.amount,
                settlement.paymentRef,
                reason
            ) {} catch {
                // Best-effort notification
            }
        }
    }

    /**
     * @dev Internal helper to get settlements filtered by address
     * @param addr Address to filter by
     * @param isPayer True to filter by payer, false to filter by payee
     * @return Array of settlement IDs
     */
    function _getSettlementsByAddress(address addr, bool isPayer)
        internal
        view
        returns (uint256[] memory)
    {
        uint256 totalCount = settlements.length;
        uint256[] memory tempResult = new uint256[](totalCount);
        uint256 count = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            address compareTo = isPayer ? settlements[i].payer : settlements[i].payee;
            if (compareTo == addr) {
                tempResult[count] = i;
                count++;
            }
        }

        // Create properly sized result array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempResult[i];
        }

        return result;
    }

    /**
     * @notice Prevents accidental ETH transfers to the contract
     * @dev Only accepts ETH through executeETHSettlement function
     */
    receive() external payable {
        revert("Use executeETHSettlement function");
    }
}