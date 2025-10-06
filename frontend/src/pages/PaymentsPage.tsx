import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Layout from '../components/layout/Layout';
import Icon, { TokenIcon, ChainIcon } from '../components/ui/Icon';
import { UI_ICONS, TOKEN_ICONS, CHAIN_ICONS } from '../components/ui/iconConstants';
import { useSendPayment } from '../hooks/useOmniPayContracts';
import { SUPPORTED_TOKENS } from '../config/contracts';
import { getChainMetadata } from '../config/chains';

export default function PaymentsPage() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendPayment, isSuccess, error } = useSendPayment();

  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    token: 'native',
    reference: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    try {
      const tokenAddress = formData.token === 'native' 
        ? '0x0000000000000000000000000000000000000000' as `0x${string}`
        : SUPPORTED_TOKENS.USDC;

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <Icon icon={UI_ICONS.send} size={32} className="text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Send Payment</h1>
                <p className="text-gray-300">Send cross-chain payments instantly</p>
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
                  <select
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="native" style={{ backgroundColor: '#060011' }}>
                      Native Token
                    </option>
                    <option value="usdc" style={{ backgroundColor: '#060011' }}>
                      USDC
                    </option>
                    <option value="usdt" style={{ backgroundColor: '#060011' }}>
                      USDT
                    </option>
                    <option value="dai" style={{ backgroundColor: '#060011' }}>
                      DAI
                    </option>
                  </select>
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
                  disabled={!formData.recipient || !formData.amount}
                >
                  <Icon icon="mdi:send" size={20} />
                  Send Payment
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl flex items-start space-x-2">
                  <Icon icon={UI_ICONS.error} size={20} className="text-red-400 mt-0.5" />
                  <p className="text-red-300 text-sm">
                    Error: {error.message}
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
                    {formData.token !== 'native' && (
                      <TokenIcon 
                        token={formData.token as keyof typeof TOKEN_ICONS} 
                        size={20} 
                      />
                    )}
                    <span className="text-white font-semibold">
                      {formData.amount || '0'} {formData.token === 'native' ? balance?.symbol : formData.token.toUpperCase()}
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

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Icon icon="mdi:lightning-bolt" size={20} className="text-white" />
                  <span>Quick Actions</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2 py-2 px-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Icon icon="mdi:history" size={16} />
                    <span>History</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2 py-2 px-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Icon icon="mdi:qrcode" size={16} />
                    <span>QR Code</span>
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 0, 17, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <p className="text-gray-300 text-sm">
                  💡 Cross-chain payments are processed through OmniPay's bridge network for maximum security and efficiency.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}