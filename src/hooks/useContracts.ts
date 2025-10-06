import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { 
  CONTRACT_ADDRESSES, 
  type SendPaymentParams, 
  type CreateSubscriptionParams,
  ContractError,
  InvalidAddressError 
} from '../types/contracts';

// OmniPay Core Contract ABI (simplified for demo)
const OMNIPAY_CORE_ABI = [
  {
    "inputs": [
      {"name": "payee", "type": "address"},
      {"name": "token", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "paymentRef", "type": "string"}
    ],
    "name": "sendPayment",
    "outputs": [{"name": "txId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transactionCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useOmniPayCore() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: transactionCount } = useReadContract({
    address: CONTRACT_ADDRESSES.OMNIPAY_CORE as `0x${string}`,
    abi: OMNIPAY_CORE_ABI,
    functionName: 'transactionCount',
  });

  const sendPayment = async (params: SendPaymentParams) => {
    if (!isConnected || !address) {
      throw new ContractError('Wallet not connected');
    }

    if (!isAddress(params.payee)) {
      throw new InvalidAddressError(params.payee);
    }

    try {
      const value = params.token === '0x0000000000000000000000000000000000000000' 
        ? params.amount 
        : 0n;

      await writeContract({
        address: CONTRACT_ADDRESSES.OMNIPAY_CORE as `0x${string}`,
        abi: OMNIPAY_CORE_ABI,
        functionName: 'sendPayment',
        args: [params.payee as `0x${string}`, params.token as `0x${string}`, params.amount, params.paymentRef],
        value: value,
      });

      // toast.success('Payment initiated successfully!');
    } catch (err: any) {
      const errorMessage = err?.message || 'Payment failed';
      // toast.error(errorMessage);
      throw new ContractError(errorMessage, err?.code, err);
    }
  };

  return {
    sendPayment,
    transactionCount: transactionCount ? Number(transactionCount) : 0,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

export function useContractUtils() {
  const formatAmount = (amount: bigint, decimals: number = 18): string => {
    return formatEther(amount);
  };

  const parseAmount = (amount: string): bigint => {
    return parseEther(amount);
  };

  const validateAddress = (address: string): boolean => {
    return isAddress(address);
  };

  return {
    formatAmount,
    parseAmount,
    validateAddress,
  };
}
