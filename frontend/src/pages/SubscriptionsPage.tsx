import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon, { ChainIcon } from '../components/ui/Icon';
import { UI_ICONS, CHAIN_ICONS } from '../components/ui/iconConstants';
import { useCreateSubscription } from '../hooks/useOmniPayContracts';
import { getChainMetadata } from '../config/chains';

const SubscriptionsPage = (): FunctionComponent => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { createSubscription, isPending, isConfirming, isSuccess, error } = useCreateSubscription();
  
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [formData, setFormData] = useState({
    merchant: '',
    token: '',
    amount: '',
    interval: '30', // days
    paymentType: 'ETH' as 'ETH' | 'ERC20',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateSubscription = async () => {
    if (!isConnected || !address) return;

    try {
      const tokenAddress = formData.paymentType === 'ETH' 
        ? '0x0000000000000000000000000000000000000000' as `0x${string}`
        : formData.token as `0x${string}`;

      const intervalInSeconds = parseInt(formData.interval) * 24 * 60 * 60; // Convert days to seconds

      await createSubscription(
        formData.merchant as `0x${string}`,
        tokenAddress,
        formData.amount,
        intervalInSeconds
      );
    } catch (err) {
      console.error('Subscription creation failed:', err);
    }
  };

  const chainMetadata = chain ? getChainMetadata(chain.id) : null;

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <Card className="p-8 text-center max-w-md mx-auto">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-300 mb-6">Please connect your wallet to manage your subscriptions.</p>
                <ConnectButton />
              </div>
            </Card>
        </div>
      </Layout>
    );
  };

  const mockSubscriptions = [
    {
      id: 1,
      merchant: '0x1234...5678',
      amount: '10 USDC',
      interval: '30 days',
      nextPayment: '2024-11-05',
      status: 'active'
    },
    {
      id: 2,
      merchant: '0xabcd...efgh',
      amount: '0.01 ETH',
      interval: '7 days',
      nextPayment: '2024-10-13',
      status: 'active'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Icon icon={UI_ICONS.subscriptions} size={48} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Smart Subscriptions
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Automate recurring payments with intelligent subscription management and flexible intervals.
            </p>
            {isConnected && (
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  {chainMetadata && (
                    <ChainIcon 
                      chain={chainMetadata.name.toLowerCase() as keyof typeof CHAIN_ICONS} 
                      size={20} 
                    />
                  )}
                  <p className="text-sm text-gray-400">Connected to {chainMetadata?.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon={UI_ICONS.wallet} size={16} className="text-white" />
                  <p className="text-lg font-semibold text-white">
                    {balance?.formatted} {balance?.symbol}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'create'
                    ? 'text-white'
                    : 'text-gray-400'
                } transition-colors`}
                style={
                  activeTab === 'create'
                    ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                    : {}
                }
              >
                <Icon icon={UI_ICONS.add} size={16} />
                <span>Create Subscription</span>
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'manage'
                    ? 'text-white'
                    : 'text-gray-400'
                } transition-colors`}
                style={
                  activeTab === 'manage'
                    ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                    : {}
                }
              >
                <Icon icon={UI_ICONS.settings} size={16} />
                <span>Manage Subscriptions</span>
              </button>
            </div>
          </div>

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Subscription Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-6">
                    <Icon icon={UI_ICONS.add} size={24} className="text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Subscription</h2>
                  </div>
                  
                  {/* Payment Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                      <Icon icon="mdi:coin" size={16} />
                      <span>Payment Type</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFormData({...formData, paymentType: 'ETH'})}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                          formData.paymentType === 'ETH'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <Icon icon="cryptocurrency:eth" size={20} />
                        <span>ETH</span>
                      </button>
                      <button
                        onClick={() => setFormData({...formData, paymentType: 'ERC20'})}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                          formData.paymentType === 'ERC20'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <Icon icon="mdi:coin" size={20} />
                        <span>ERC20</span>
                      </button>
                    </div>
                  </div>

                  {/* Token Address (ERC20 only) */}
                  {formData.paymentType === 'ERC20' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                        <Icon icon="mdi:link" size={16} />
                        <span>Token Address</span>
                      </label>
                      <input
                        type="text"
                        name="token"
                        value={formData.token}
                        onChange={handleInputChange}
                        placeholder="0x..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                      <Icon icon="mdi:note-text" size={16} />
                      <span>Description (Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Netflix subscription, SaaS service, etc."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Merchant Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                      <Icon icon={UI_ICONS.account} size={16} />
                      <span>Merchant Address</span>
                    </label>
                    <input
                      type="text"
                      name="merchant"
                      value={formData.merchant}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                      <Icon icon="mdi:currency-usd" size={16} />
                      <span>Amount per Payment ({formData.paymentType})</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.000001"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Interval */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Payment Interval</label>
                    <select
                      name="interval"
                      value={formData.interval}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors"
                    >
                      <option value="1">Daily</option>
                      <option value="7">Weekly</option>
                      <option value="30">Monthly</option>
                      <option value="90">Quarterly</option>
                      <option value="365">Yearly</option>
                    </select>
                  </div>

                  <Button 
                    onClick={handleCreateSubscription}
                    disabled={isPending || isConfirming}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                  >
                    {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Create Subscription'}
                  </Button>
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl">
                      <p className="text-red-300 text-sm">
                        Error: {error.message}
                      </p>
                    </div>
                  )}

                  {isSuccess && (
                    <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-xl">
                      <p className="text-green-300 text-sm">
                        Subscription created successfully! 🎉
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Subscription Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Subscription Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-400">Merchant</span>
                      <span className="text-white font-mono text-sm">
                        {formData.merchant ? `${formData.merchant.slice(0, 6)}...${formData.merchant.slice(-4)}` : 'Not specified'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-400">Amount</span>
                      <span className="text-white font-semibold">
                        {formData.amount || '0'} {formData.paymentType === 'ETH' ? balance?.symbol : 'Token'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-400">Frequency</span>
                      <span className="text-white">
                        Every {formData.interval} days
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white">
                        {chainMetadata?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 0, 17, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <p className="text-gray-300 text-sm">
                      💡 Subscriptions are managed by smart contracts and can be cancelled at any time.
                    </p>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Subscription Benefits</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Automated recurring payments
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Flexible payment intervals
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Cancel anytime
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Smart contract security
                    </li>
                  </ul>
                </Card>

                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#060011' }}>
                        1
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Set Parameters</h4>
                        <p className="text-gray-400 text-sm">Define merchant, amount, and interval</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#060011' }}>
                        2
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Approve Tokens</h4>
                        <p className="text-gray-400 text-sm">Grant spending allowance (ERC20 only)</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#060011' }}>
                        3
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Auto Execute</h4>
                        <p className="text-gray-400 text-sm">Payments process automatically</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {activeTab === 'manage' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Your Subscriptions</h2>
                
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Connect to view your active subscriptions</p>
                  <Button onClick={() => setActiveTab('create')} variant="outline">
                    Create Your First Subscription
                  </Button>
                </div>
                
                {/* Example subscriptions for demo */}
                <div className="space-y-4">
                  {mockSubscriptions.map((sub) => (
                    <div key={sub.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-white">{sub.amount}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              sub.status === 'active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {sub.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-1">To: {sub.merchant}</p>
                          <p className="text-gray-400 text-sm">Every {sub.interval} • Next: {sub.nextPayment}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Execute Now
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;