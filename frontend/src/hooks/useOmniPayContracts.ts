import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { OMNIPAY_CONTRACTS, CONTRACT_ABIS } from '../config/contracts';

// Hook for sending payments
export const useSendPayment = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendPayment = async (
    to: `0x${string}`,
    amount: string,
    token: `0x${string}`,
    reference: string
  ) => {
    try {
      // Check if it's a native token payment (ETH)
      if (token === '0x0000000000000000000000000000000000000000') {
        // Use payETH function for native token payments
        await writeContract({
          address: OMNIPAY_CONTRACTS.CORE,
          abi: CONTRACT_ABIS.CORE,
          functionName: 'payETH',
          args: [to, reference],
          value: parseEther(amount),
        });
      } else {
        // Use payERC20 function for ERC20 token payments
        await writeContract({
          address: OMNIPAY_CONTRACTS.CORE,
          abi: CONTRACT_ABIS.CORE,
          functionName: 'payERC20',
          args: [token, to, parseEther(amount), reference],
        });
      }
    } catch (err) {
      console.error('Payment failed:', err);
      throw err;
    }
  };

  return {
    sendPayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for creating subscriptions
export const useCreateSubscription = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createSubscription = async (
    merchant: `0x${string}`,
    token: `0x${string}`,
    amount: string,
    interval: number
  ) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.SUBSCRIPTION,
        abi: CONTRACT_ABIS.SUBSCRIPTION,
        functionName: 'createSubscription',
        args: [merchant, token, parseEther(amount), BigInt(interval)],
      });
    } catch (err) {
      console.error('Subscription creation failed:', err);
      throw err;
    }
  };

  return {
    createSubscription,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for reading payment history
export const usePaymentHistory = (userAddress?: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.CORE,
    abi: CONTRACT_ABIS.CORE,
    functionName: 'getPaymentHistory',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    paymentHistory: data,
    isLoading,
    error,
  };
};

// Hook for reading user subscriptions
export const useUserSubscriptions = (userAddress?: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.SUBSCRIPTION,
    abi: CONTRACT_ABIS.SUBSCRIPTION,
    functionName: 'getUserSubscriptions',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    subscriptions: data,
    isLoading,
    error,
  };
};

// Hook for canceling a subscription
export const useCancelSubscription = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelSubscription = async (subscriptionId: bigint) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.SUBSCRIPTION,
        abi: CONTRACT_ABIS.SUBSCRIPTION,
        functionName: 'cancelSubscription',
        args: [subscriptionId],
      });
    } catch (err) {
      console.error('Subscription cancellation failed:', err);
      throw err;
    }
  };

  return {
    cancelSubscription,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for executing a subscription payment
export const useExecuteSubscription = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeSubscription = async (subscriptionId: bigint) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.SUBSCRIPTION,
        abi: CONTRACT_ABIS.SUBSCRIPTION,
        functionName: 'executeSubscription',
        args: [subscriptionId],
      });
    } catch (err) {
      console.error('Subscription execution failed:', err);
      throw err;
    }
  };

  return {
    executeSubscription,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for initiating cross-chain payments via main Bridge
export const useInitiateCrossChainPayment = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const initiateCrossChainPayment = async (
    payer: `0x${string}`,
    payee: `0x${string}`,
    token: `0x${string}`,
    amount: string,
    targetChainId: number,
    paymentRef: string,
    value?: string
  ) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.BRIDGE,
        abi: CONTRACT_ABIS.BRIDGE,
        functionName: 'initiateCrossChainPayment',
        args: [payer, payee, token, parseEther(amount), BigInt(targetChainId), paymentRef],
        value: value ? parseEther(value) : undefined,
      });
    } catch (err) {
      console.error('Cross-chain payment initiation failed:', err);
      throw err;
    }
  };

  return {
    initiateCrossChainPayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for completing cross-chain payments via main Bridge
export const useCompleteCrossChainPayment = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const completeCrossChainPayment = async (
    paymentId: bigint,
    payer: `0x${string}`,
    payee: `0x${string}`,
    token: `0x${string}`,
    amount: string,
    sourceChainId: number,
    paymentRef: string
  ) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.BRIDGE,
        abi: CONTRACT_ABIS.BRIDGE,
        functionName: 'completeCrossChainPayment',
        args: [paymentId, payer, payee, token, parseEther(amount), BigInt(sourceChainId), paymentRef],
      });
    } catch (err) {
      console.error('Cross-chain payment completion failed:', err);
      throw err;
    }
  };

  return {
    completeCrossChainPayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for reading cross-chain payment details
export const usePaymentDetails = (paymentId?: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.BRIDGE,
    abi: CONTRACT_ABIS.BRIDGE,
    functionName: 'getPayment',
    args: paymentId ? [paymentId] : undefined,
    query: {
      enabled: !!paymentId,
    },
  });

  return {
    payment: data,
    isLoading,
    error,
  };
};

// Hook for reading payer's payment history
export const usePayerPayments = (payer?: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.BRIDGE,
    abi: CONTRACT_ABIS.BRIDGE,
    functionName: 'getPayerPayments',
    args: payer ? [payer] : undefined,
    query: {
      enabled: !!payer,
    },
  });

  return {
    paymentIds: data,
    isLoading,
    error,
  };
};

// Utility functions for formatting
export const formatPaymentAmount = (amount: bigint) => {
  return formatEther(amount);
};

export const parsePaymentAmount = (amount: string) => {
  return parseEther(amount);
};

// Utility function to format subscription interval
export const formatSubscriptionInterval = (intervalInSeconds: bigint) => {
  const seconds = Number(intervalInSeconds);
  const days = Math.floor(seconds / (24 * 60 * 60));
  
  if (days === 1) return 'Daily';
  if (days === 7) return 'Weekly';
  if (days === 30) return 'Monthly';
  if (days === 90) return 'Quarterly';
  if (days === 365) return 'Yearly';
  
  return `Every ${days} days`;
};

// Hook for creating settlements
export const useCreateSettlement = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createSettlement = async (
    payee: `0x${string}`,
    token: `0x${string}`,
    amount: string,
    paymentRef: string
  ) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.SETTLEMENT,
        abi: CONTRACT_ABIS.SETTLEMENT,
        functionName: 'createSettlement',
        args: [payee, token, parseEther(amount), paymentRef],
      });
    } catch (err) {
      console.error('Settlement creation failed:', err);
      throw err;
    }
  };

  return {
    createSettlement,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for executing settlements
export const useExecuteSettlement = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeSettlement = async (settlementId: bigint, isETH: boolean = false, ethAmount?: string) => {
    try {
      if (isETH && ethAmount) {
        // Use executeETHSettlement for ETH payments
        await writeContract({
          address: OMNIPAY_CONTRACTS.SETTLEMENT,
          abi: CONTRACT_ABIS.SETTLEMENT,
          functionName: 'executeETHSettlement',
          args: [settlementId],
          value: parseEther(ethAmount),
        });
      } else {
        // Use executeSettlement for ERC20 payments
        await writeContract({
          address: OMNIPAY_CONTRACTS.SETTLEMENT,
          abi: CONTRACT_ABIS.SETTLEMENT,
          functionName: 'executeSettlement',
          args: [settlementId],
        });
      }
    } catch (err) {
      console.error('Settlement execution failed:', err);
      throw err;
    }
  };

  return {
    executeSettlement,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for canceling settlements
export const useCancelSettlement = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelSettlement = async (settlementId: bigint) => {
    try {
      await writeContract({
        address: OMNIPAY_CONTRACTS.SETTLEMENT,
        abi: CONTRACT_ABIS.SETTLEMENT,
        functionName: 'cancelSettlement',
        args: [settlementId],
      });
    } catch (err) {
      console.error('Settlement cancellation failed:', err);
      throw err;
    }
  };

  return {
    cancelSettlement,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// Hook for reading user's settlements as payer
export const usePayerSettlements = (payerAddress?: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.SETTLEMENT,
    abi: CONTRACT_ABIS.SETTLEMENT,
    functionName: 'getPayerSettlements',
    args: payerAddress ? [payerAddress] : undefined,
    query: {
      enabled: !!payerAddress,
    },
  });

  return {
    settlementIds: data,
    isLoading,
    error,
  };
};

// Hook for reading user's settlements as payee
export const usePayeeSettlements = (payeeAddress?: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.SETTLEMENT,
    abi: CONTRACT_ABIS.SETTLEMENT,
    functionName: 'getPayeeSettlements',
    args: payeeAddress ? [payeeAddress] : undefined,
    query: {
      enabled: !!payeeAddress,
    },
  });

  return {
    settlementIds: data,
    isLoading,
    error,
  };
};

// Hook for reading settlement details
export const useSettlementDetails = (settlementId?: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.SETTLEMENT,
    abi: CONTRACT_ABIS.SETTLEMENT,
    functionName: 'getSettlement',
    args: settlementId ? [settlementId] : undefined,
    query: {
      enabled: !!settlementId,
    },
  });

  return {
    settlement: data,
    isLoading,
    error,
  };
};

// Utility function to get next payment date
export const getNextPaymentDate = (lastPayment: bigint, interval: bigint) => {
  const lastPaymentMs = Number(lastPayment) * 1000;
  const intervalMs = Number(interval) * 1000;
  return new Date(lastPaymentMs + intervalMs);
};