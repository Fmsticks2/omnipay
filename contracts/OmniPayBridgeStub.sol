// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OmniPayBridgeStub is Ownable {
    event CrossChainPaymentInitiated(
        uint256 indexed localTxId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string targetChain,
        string paymentRef
    );

    event CrossChainPaymentCompleted(
        uint256 indexed localTxId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        string sourceChain,
        string paymentRef
    );

    /// @notice Placeholder to initiate cross-chain payment. Emits event only.
    function initiateCrossChainPayment(
        uint256 localTxId,
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata targetChain,
        string calldata paymentRef
    ) external onlyOwner {
        emit CrossChainPaymentInitiated(localTxId, payer, payee, token, amount, targetChain, paymentRef);
    }

    /// @notice Placeholder to complete cross-chain payment. Emits event only.
    function completeCrossChainPayment(
        uint256 localTxId,
        address payer,
        address payee,
        address token,
        uint256 amount,
        string calldata sourceChain,
        string calldata paymentRef
    ) external onlyOwner {
        emit CrossChainPaymentCompleted(localTxId, payer, payee, token, amount, sourceChain, paymentRef);
    }
}