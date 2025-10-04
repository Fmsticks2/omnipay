// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";

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

contract OmniPaySettlement is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Settlement {
        address payer;
        address payee;
        address token;
        uint256 amount;
        uint256 timestamp;
        string paymentRef;
        bool executed;
    }

    event SettlementCreated(
        uint256 indexed settlementId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string paymentRef
    );

    event SettlementExecuted(
        uint256 indexed settlementId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string paymentRef
    );

    event SettlementCancelled(
        uint256 indexed settlementId,
        address indexed payer,
        string paymentRef
    );

    Settlement[] public settlements;
    address public notifier;

    constructor(address _notifier) {
        notifier = _notifier;
    }

    function setNotifier(address _notifier) external onlyOwner {
        notifier = _notifier;
    }

    /// @notice Create a settlement that can be executed later with approve/permit + pull
    /// @param payee Recipient of the payment
    /// @param token ERC-20 token contract address (address(0) for ETH)
    /// @param amount Amount to settle
    /// @param paymentRef Arbitrary reference string for the payment
    function createSettlement(
        address payee,
        address token,
        uint256 amount,
        string calldata paymentRef
    ) external returns (uint256 settlementId) {
        require(payee != address(0), "Invalid payee");
        require(amount > 0, "Amount = 0");

        settlements.push(
            Settlement({
                payer: msg.sender,
                payee: payee,
                token: token,
                amount: amount,
                timestamp: block.timestamp,
                paymentRef: paymentRef,
                executed: false
            })
        );

        settlementId = settlements.length - 1;
        emit SettlementCreated(settlementId, msg.sender, payee, token, amount, paymentRef);
    }

    /// @notice Execute settlement with pre-approved tokens (standard approve flow)
    /// @param settlementId ID of the settlement to execute
    function executeSettlement(uint256 settlementId) external nonReentrant {
        require(settlementId < settlements.length, "Invalid settlement ID");
        Settlement storage settlement = settlements[settlementId];
        require(!settlement.executed, "Settlement already executed");
        require(settlement.token != address(0), "Use executeETHSettlement for ETH");

        settlement.executed = true;

        IERC20 token = IERC20(settlement.token);
        token.safeTransferFrom(settlement.payer, settlement.payee, settlement.amount);

        emit SettlementExecuted(
            settlementId,
            settlement.payer,
            settlement.payee,
            settlement.token,
            settlement.amount,
            settlement.paymentRef
        );

        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                settlement.payer,
                settlement.payee,
                settlement.token,
                settlement.amount,
                settlement.paymentRef
            ) {} catch {
                // Best-effort notification; ignore failures
            }
        }
    }

    /// @notice Execute settlement with permit signature (gasless approval)
    /// @param settlementId ID of the settlement to execute
    /// @param deadline Permit deadline
    /// @param v Permit signature v
    /// @param r Permit signature r
    /// @param s Permit signature s
    function executeSettlementWithPermit(
        uint256 settlementId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(settlementId < settlements.length, "Invalid settlement ID");
        Settlement storage settlement = settlements[settlementId];
        require(!settlement.executed, "Settlement already executed");
        require(settlement.token != address(0), "Use executeETHSettlement for ETH");

        settlement.executed = true;

        IERC20Permit token = IERC20Permit(settlement.token);
        
        // Execute permit to approve this contract
        token.permit(
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

        emit SettlementExecuted(
            settlementId,
            settlement.payer,
            settlement.payee,
            settlement.token,
            settlement.amount,
            settlement.paymentRef
        );

        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                settlement.payer,
                settlement.payee,
                settlement.token,
                settlement.amount,
                settlement.paymentRef
            ) {} catch {
                // Best-effort notification; ignore failures
            }
        }
    }

    /// @notice Execute ETH settlement (payer must send exact amount)
    /// @param settlementId ID of the settlement to execute
    function executeETHSettlement(uint256 settlementId) external payable nonReentrant {
        require(settlementId < settlements.length, "Invalid settlement ID");
        Settlement storage settlement = settlements[settlementId];
        require(!settlement.executed, "Settlement already executed");
        require(settlement.token == address(0), "Use executeSettlement for ERC20");
        require(msg.sender == settlement.payer, "Only payer can execute ETH settlement");
        require(msg.value == settlement.amount, "Incorrect ETH amount");

        settlement.executed = true;

        (bool ok, ) = settlement.payee.call{value: settlement.amount}("");
        require(ok, "ETH transfer failed");

        emit SettlementExecuted(
            settlementId,
            settlement.payer,
            settlement.payee,
            settlement.token,
            settlement.amount,
            settlement.paymentRef
        );

        if (notifier != address(0)) {
            try IOmniPayNotifier(notifier).notifyPaymentSuccess(
                settlement.payer,
                settlement.payee,
                settlement.token,
                settlement.amount,
                settlement.paymentRef
            ) {} catch {
                // Best-effort notification; ignore failures
            }
        }
    }

    /// @notice Cancel a settlement (only by payer, only if not executed)
    /// @param settlementId ID of the settlement to cancel
    function cancelSettlement(uint256 settlementId) external {
        require(settlementId < settlements.length, "Invalid settlement ID");
        Settlement storage settlement = settlements[settlementId];
        require(msg.sender == settlement.payer, "Only payer can cancel");
        require(!settlement.executed, "Cannot cancel executed settlement");

        settlement.executed = true; // Mark as executed to prevent future execution

        emit SettlementCancelled(settlementId, settlement.payer, settlement.paymentRef);
    }

    /// @notice Get settlement details
    /// @param settlementId ID of the settlement
    function getSettlement(uint256 settlementId) external view returns (Settlement memory) {
        require(settlementId < settlements.length, "Invalid settlement ID");
        return settlements[settlementId];
    }

    /// @notice Returns the total number of settlements
    function settlementCount() external view returns (uint256) {
        return settlements.length;
    }

    /// @notice Get all settlements for a specific payer
    /// @param payer Address of the payer
    function getPayerSettlements(address payer) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](settlements.length);
        uint256 count = 0;

        for (uint256 i = 0; i < settlements.length; i++) {
            if (settlements[i].payer == payer) {
                result[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory payerSettlements = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            payerSettlements[i] = result[i];
        }

        return payerSettlements;
    }

    /// @notice Get all settlements for a specific payee
    /// @param payee Address of the payee
    function getPayeeSettlements(address payee) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](settlements.length);
        uint256 count = 0;

        for (uint256 i = 0; i < settlements.length; i++) {
            if (settlements[i].payee == payee) {
                result[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory payeeSettlements = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            payeeSettlements[i] = result[i];
        }

        return payeeSettlements;
    }
}