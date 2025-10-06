// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OmniPayBridgeStub
 * @notice Placeholder contract for cross-chain payment bridge functionality
 * @dev This stub emits events to track cross-chain payment intentions and completions
 *      without implementing actual cross-chain transfer logic. In production, this would
 *      integrate with bridge protocols like LayerZero, Axelar, or Wormhole.
 */
contract OmniPayBridgeStub is Ownable {
    /**
     * @notice Transaction status enumeration
     * @param Initiated Transaction has been initiated but not completed
     * @param Completed Transaction has been successfully completed
     * @param Failed Transaction has failed
     */
    enum TransactionStatus {
        Initiated,
        Completed,
        Failed
    }

    /**
     * @notice Cross-chain transaction record
     * @param localTxId Local transaction identifier
     * @param payer Address initiating the payment
     * @param payee Address receiving the payment
     * @param token Token address on the source chain
     * @param amount Payment amount
     * @param chain Target or source chain identifier
     * @param paymentRef External payment reference
     * @param timestamp Block timestamp when transaction was recorded
     * @param status Current transaction status
     */
    struct CrossChainTransaction {
        uint256 localTxId;
        address payer;
        address payee;
        address token;
        uint256 amount;
        string chain;
        string paymentRef;
        uint256 timestamp;
        TransactionStatus status;
    }

    /// @notice Emitted when a cross-chain payment is initiated from this chain
    event CrossChainPaymentInitiated(
        uint256 indexed localTxId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string targetChain,
        string paymentRef
    );

    /// @notice Emitted when a cross-chain payment is completed on this chain
    event CrossChainPaymentCompleted(
        uint256 indexed localTxId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string sourceChain,
        string paymentRef
    );

    /// @notice Emitted when a cross-chain payment fails
    event CrossChainPaymentFailed(
        uint256 indexed localTxId,
        address indexed payer,
        address indexed payee,
        string chain,
        string reason
    );

    /// @notice Emitted when an authorized operator is added
    event OperatorAdded(address indexed operator);

    /// @notice Emitted when an authorized operator is removed
    event OperatorRemoved(address indexed operator);

    /// @notice Counter for generating unique transaction IDs
    uint256 public nextTransactionId = 1;

    /// @notice Mapping from transaction ID to initiated transactions
    mapping(uint256 => CrossChainTransaction) public initiatedTransactions;

    /// @notice Mapping from transaction ID to completed transactions
    mapping(uint256 => CrossChainTransaction) public completedTransactions;

    /// @notice Mapping of authorized operators who can trigger bridge operations
    mapping(address => bool) public authorizedOperators;

    /// @notice Thrown when caller is not an authorized operator
    error UnauthorizedOperator();

    /// @notice Thrown when an invalid address is provided
    error InvalidAddress();

    /// @notice Thrown when an invalid amount is provided
    error InvalidAmount();

    /// @notice Thrown when an invalid chain identifier is provided
    error InvalidChain();

    /// @notice Thrown when a transaction ID already exists
    error TransactionAlreadyExists();

    /// @notice Thrown when a transaction is not found
    error TransactionNotFound();

    /**
     * @notice Contract constructor
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        // Owner is automatically an authorized operator
        authorizedOperators[initialOwner] = true;
        emit OperatorAdded(initialOwner);
    }

    /**
     * @notice Modifier to restrict access to authorized operators
     */
    modifier onlyOperator() {
        if (!authorizedOperators[msg.sender]) revert UnauthorizedOperator();
        _;
    }

    /**
     * @notice Add an authorized operator
     * @param operator Address to authorize
     */
    function addOperator(address operator) external onlyOwner {
        if (operator == address(0)) revert InvalidAddress();
        authorizedOperators[operator] = true;
        emit OperatorAdded(operator);
    }

    /**
     * @notice Remove an authorized operator
     * @param operator Address to deauthorize
     */
    function removeOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = false;
        emit OperatorRemoved(operator);
    }

    /**
     * @notice Initiate a cross-chain payment from this chain to another
     * @dev Records the transaction and emits an event for off-chain bridge monitoring
     * @param localTxId Unique identifier for this transaction
     * @param payer Address initiating the payment on this chain
     * @param payee Address that will receive payment on target chain
     * @param token Token contract address on this chain (address(0) for native token)
     * @param amount Amount to transfer
     * @param targetChain Identifier of the destination blockchain
     * @param paymentRef External reference string for payment tracking
     */
    function initiateCrossChainPayment(
        uint256 localTxId,
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata targetChain,
        string calldata paymentRef
    ) external onlyOperator {
        if (payer == address(0) || payee == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (bytes(targetChain).length == 0) revert InvalidChain();
        if (initiatedTransactions[localTxId].localTxId != 0) revert TransactionAlreadyExists();

        initiatedTransactions[localTxId] = CrossChainTransaction({
            localTxId: localTxId,
            payer: payer,
            payee: payee,
            token: token,
            amount: amount,
            chain: targetChain,
            paymentRef: paymentRef,
            timestamp: block.timestamp,
            status: TransactionStatus.Initiated
        });

        emit CrossChainPaymentInitiated(
            localTxId,
            payer,
            payee,
            token,
            amount,
            targetChain,
            paymentRef
        );
    }

    /**
     * @notice Complete a cross-chain payment received on this chain
     * @dev Records the completion and emits an event for tracking
     * @param localTxId Unique identifier for this transaction
     * @param payer Address that initiated payment on source chain
     * @param payee Address receiving payment on this chain
     * @param token Token contract address on this chain (address(0) for native token)
     * @param amount Amount transferred
     * @param sourceChain Identifier of the source blockchain
     * @param paymentRef External reference string for payment tracking
     */
    function completeCrossChainPayment(
        uint256 localTxId,
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata sourceChain,
        string calldata paymentRef
    ) external onlyOperator {
        if (payer == address(0) || payee == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (bytes(sourceChain).length == 0) revert InvalidChain();
        if (completedTransactions[localTxId].localTxId != 0) revert TransactionAlreadyExists();

        completedTransactions[localTxId] = CrossChainTransaction({
            localTxId: localTxId,
            payer: payer,
            payee: payee,
            token: token,
            amount: amount,
            chain: sourceChain,
            paymentRef: paymentRef,
            timestamp: block.timestamp,
            status: TransactionStatus.Completed
        });

        emit CrossChainPaymentCompleted(
            localTxId,
            payer,
            payee,
            token,
            amount,
            sourceChain,
            paymentRef
        );
    }

    /**
     * @notice Mark an initiated transaction as failed
     * @param localTxId Transaction identifier
     * @param reason Failure reason description
     */
    function markTransactionFailed(
        uint256 localTxId,
        string calldata reason
    ) external onlyOperator {
        CrossChainTransaction storage txn = initiatedTransactions[localTxId];
        if (txn.localTxId == 0) revert TransactionNotFound();

        txn.status = TransactionStatus.Failed;

        emit CrossChainPaymentFailed(
            localTxId,
            txn.payer,
            txn.payee,
            txn.chain,
            reason
        );
    }

    /**
     * @notice Generate a new unique transaction ID
     * @return txId The newly generated transaction ID
     */
    function generateTransactionId() external onlyOperator returns (uint256 txId) {
        txId = nextTransactionId++;
    }

    /**
     * @notice Get details of an initiated transaction
     * @param localTxId Transaction identifier
     * @return Transaction details
     */
    function getInitiatedTransaction(uint256 localTxId)
        external
        view
        returns (CrossChainTransaction memory)
    {
        if (initiatedTransactions[localTxId].localTxId == 0) revert TransactionNotFound();
        return initiatedTransactions[localTxId];
    }

    /**
     * @notice Get details of a completed transaction
     * @param localTxId Transaction identifier
     * @return Transaction details
     */
    function getCompletedTransaction(uint256 localTxId)
        external
        view
        returns (CrossChainTransaction memory)
    {
        if (completedTransactions[localTxId].localTxId == 0) revert TransactionNotFound();
        return completedTransactions[localTxId];
    }

    /**
     * @notice Check if an address is an authorized operator
     * @param operator Address to check
     * @return True if authorized, false otherwise
     */
    function isOperator(address operator) external view returns (bool) {
        return authorizedOperators[operator];
    }

    /**
     * @notice Get the status of an initiated transaction
     * @param localTxId Transaction identifier
     * @return status Current transaction status
     */
    function getTransactionStatus(uint256 localTxId)
        external
        view
        returns (TransactionStatus status)
    {
        if (initiatedTransactions[localTxId].localTxId == 0) revert TransactionNotFound();
        return initiatedTransactions[localTxId].status;
    }
}