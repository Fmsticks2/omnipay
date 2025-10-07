import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Layout from '../components/layout/Layout';
import Icon, { TokenIcon, ChainIcon } from '../components/ui/Icon';
import { UI_ICONS, TOKEN_ICONS, CHAIN_ICONS } from '../components/ui/iconConstants';
import { useSendPayment, usePaymentHistory, formatPaymentAmount } from '../hooks/useOmniPayContracts';
import { SUPPORTED_TOKENS } from '../config/contracts';
import { getChainMetadata } from '../config/chains';

// Token configuration with proper addresses and metadata
const AVAILABLE_TOKENS = [
  {
    symbol: 'PUSH',
    name: 'Push Token',
    address: 'native',
    icon: 'push' as keyof typeof TOKEN_ICONS,
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: SUPPORTED_TOKENS.USDC,
    icon: 'usdc' as keyof typeof TOKEN_ICONS,
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: SUPPORTED_TOKENS.USDT,
    icon: 'usdt' as keyof typeof TOKEN_ICONS,
    decimals: 6,
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: SUPPORTED_TOKENS.DAI,
    icon: 'dai' as keyof typeof TOKEN_ICONS,
    decimals: 18,
  },
] as const;

export default function PaymentsPage() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendPayment, isSuccess, error, isPending, isConfirming } = useSendPayment();
  const { paymentHistory, isLoading: isLoadingHistory, refetch: refetchPaymentHistory } = usePaymentHistory(address);

  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    token: 'native',
    reference: '',
  });

  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');

  // Refetch payment history when payment is successful
  useEffect(() => {
    if (isSuccess) {
      // Reset form
      setFormData({
        recipient: '',
        amount: '',
        token: 'native',
        reference: '',
      });
      
      // Refetch payment history to show the new transaction
      refetchPaymentHistory();
      
      // Switch to history tab to show the updated list
      setActiveTab('history');
    }
  }, [isSuccess, refetchPaymentHistory]);

  const selectedToken = AVAILABLE_TOKENS.find(token => 
    token.address === formData.token || (formData.token === 'native' && token.address === 'native')
  ) || AVAILABLE_TOKENS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    try {
      const tokenAddress = formData.token === 'native' 
        ? '0x0000000000000000000000000000000000000000' as `0x${string}`
        : formData.token as `0x${string}`;

      await sendPayment(
        formData.recipient as `0x${string}`,
        formData.amount,
        tokenAddress,
        formData.reference
      );
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleTokenSelect = (tokenAddress: string) => {
    setFormData({ ...formData, token: tokenAddress });
    setShowTokenSelector(false);
  };

  const chainMetadata = chain ? getChainMetadata(chain.id) : null;

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-md mx-auto">
            <div className="mb-6">
              <Icon icon={UI_ICONS.wallet} size={64} className="mx-auto mb-4 text-white" />
              <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
              <p className="text-gray-300 mb-6">Connect your wallet to start making cross-chain payments</p>
            </div>
            <ConnectButton />
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <Icon icon={UI_ICONS.send} size={32} className="text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
                <p className="text-gray-300">Send payments and view transaction history</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                {chainMetadata && (
                  <ChainIcon 
                    chain={chainMetadata.name.toLowerCase() as keyof typeof CHAIN_ICONS} 
                    size={20} 
                  />
                )}
                <p className="text-sm text-gray-400">Connected to {chainMetadata?.name}</p>
              </div>
              <p className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>{balance?.formatted} {balance?.symbol}</span>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('send')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  activeTab === 'send'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Send Payment
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Transaction History
              </button>
            </div>
          </div>

          {activeTab === 'send' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Icon icon={UI_ICONS.payments} size={24} className="text-white" />
                <h2 className="text-xl font-semibold text-white">Payment Details</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Icon icon={UI_ICONS.account} size={16} />
                    <span>Recipient Address</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Icon icon="mdi:currency-usd" size={16} />
                    <span>Amount</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Icon icon="mdi:coin" size={16} />
                    <span>Token</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTokenSelector(!showTokenSelector)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <TokenIcon token={selectedToken.icon} size={20} />
                        <div className="text-left">
                          <div className="font-semibold">{selectedToken.symbol}</div>
                          <div className="text-sm text-gray-400">{selectedToken.name}</div>
                        </div>
                      </div>
                      <Icon icon="mdi:chevron-down" size={20} />
                    </button>
                    
                    {showTokenSelector && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-white/20 rounded-xl z-10 max-h-60 overflow-y-auto">
                        {AVAILABLE_TOKENS.map((token) => (
                          <button
                            key={token.address}
                            type="button"
                            onClick={() => handleTokenSelect(token.address)}
                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3 first:rounded-t-xl last:rounded-b-xl"
                          >
                            <TokenIcon token={token.icon} size={20} />
                            <div>
                              <div className="font-semibold text-white">{token.symbol}</div>
                              <div className="text-sm text-gray-400">{token.name}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Icon icon="mdi:note-text" size={16} />
                    <span>Reference (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Payment reference or memo"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!formData.recipient || !formData.amount || isPending || isConfirming}
                >
                  <Icon icon="mdi:send" size={20} />
                  {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Send Payment'}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl flex items-start space-x-2">
                  <Icon icon={UI_ICONS.error} size={20} className="text-red-400 mt-0.5" />
                  <p className="text-red-300 text-sm">
                    Error: {error?.message || 'An unknown error occurred'}
                  </p>
                </div>
              )}

              {isSuccess && (
                <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-xl flex items-start space-x-2">
                  <Icon icon={UI_ICONS.success} size={20} className="text-green-400 mt-0.5" />
                  <p className="text-green-300 text-sm">
                    Payment sent successfully! 🎉
                  </p>
                </div>
              )}
            </Card>

            {/* Payment Summary */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Icon icon="mdi:receipt" size={24} className="text-white" />
                <h2 className="text-xl font-semibold text-white">Payment Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <Icon icon={UI_ICONS.account} size={16} />
                    <span>From</span>
                  </span>
                  <span className="text-white font-mono text-sm">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <Icon icon={UI_ICONS.send} size={16} />
                    <span>To</span>
                  </span>
                  <span className="text-white font-mono text-sm">
                    {formData.recipient ? `${formData.recipient.slice(0, 6)}...${formData.recipient.slice(-4)}` : 'Not specified'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <Icon icon="mdi:currency-usd" size={16} />
                    <span>Amount</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <TokenIcon token={selectedToken.icon} size={20} />
                    <span className="text-white font-semibold">
                      {formData.amount || '0'} {selectedToken.symbol}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <Icon icon="mdi:web" size={16} />
                    <span>Network</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    {chainMetadata && (
                      <ChainIcon 
                        chain={chainMetadata.name.toLowerCase() as keyof typeof CHAIN_ICONS} 
                        size={20} 
                      />
                    )}
                    <span className="text-white">
                      {chainMetadata?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <Icon icon="mdi:gas-station" size={16} />
                    <span>Estimated Fee</span>
                  </span>
                  <span className="text-white">~0.001 {balance?.symbol}</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 0, 17, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <p className="text-gray-300 text-sm">
                  💡 Cross-chain payments are processed through OmniPay's bridge network for maximum security and efficiency.
                </p>
              </div>
            </Card>
          </div>
          )}

          {activeTab === 'history' && (
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Icon icon={UI_ICONS.history} size={24} className="text-white" />
                <h2 className="text-xl font-semibold text-white">Transaction History</h2>
              </div>
              
              {isLoadingHistory ? (
                <div className="text-center py-12">
                  <Icon icon={UI_ICONS.pending} size={48} className="mx-auto mb-4 text-gray-400 animate-spin" />
                  <p className="text-gray-400">Loading transaction history...</p>
                </div>
              ) : paymentHistory && Array.isArray(paymentHistory) && paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.map((payment: any, index: number) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Icon icon={UI_ICONS.send} size={20} className="text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {formatPaymentAmount(BigInt(payment.amount))} {payment.token || 'PUSH'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              To: {payment.payee ? `${payment.payee.slice(0, 6)}...${payment.payee.slice(-4)}` : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 text-sm font-semibold">Completed</p>
                          <p className="text-gray-400 text-xs">
                            {payment.timestamp ? new Date(Number(payment.timestamp) * 1000).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon icon={UI_ICONS.history} size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 mb-4">No payment history found</p>
                  <p className="text-gray-500 text-sm">Your completed transactions will appear here</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}