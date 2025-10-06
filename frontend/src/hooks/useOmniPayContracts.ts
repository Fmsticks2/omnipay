import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { OMNIPAY_CONTRACTS, OMNIPAY_CORE_ABI, OMNIPAY_SUBSCRIPTION_ABI } from '../config/contracts';

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
      await writeContract({
        address: OMNIPAY_CONTRACTS.CORE,
        abi: OMNIPAY_CORE_ABI,
        functionName: 'sendPayment',
        args: [to, parseEther(amount), token, reference],
        value: parseEther(amount), // For native token payments
      });
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
        abi: OMNIPAY_SUBSCRIPTION_ABI,
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

// Hook for reading contract data (example: get payment history)
export const usePaymentHistory = (userAddress?: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: OMNIPAY_CONTRACTS.CORE,
    abi: OMNIPAY_CORE_ABI,
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

// Utility functions for formatting
export const formatPaymentAmount = (amount: bigint) => {
  return formatEther(amount);
};

export const parsePaymentAmount = (amount: string) => {
  return parseEther(amount);
};