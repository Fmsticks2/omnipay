import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-hot-toast';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon, { ChainIcon, TokenIcon } from '../components/ui/Icon';
import { UI_ICONS, CHAIN_ICONS, TOKEN_ICONS } from '../components/ui/iconConstants';
import { 
  useCreateSubscription, 
  useUserSubscriptions, 
  useCancelSubscription, 
  useExecuteSubscription,
  formatPaymentAmount,
  formatSubscriptionInterval,
  getNextPaymentDate
} from '../hooks/useOmniPayContracts';
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

const SubscriptionsPage = (): FunctionComponent => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  
  // Smart contract hooks
  const { 
    createSubscription, 
    isPending: isCreating, 
    isSuccess: createSuccess, 
    error: createErrorDetails 
  } = useCreateSubscription();
  
  const { 
    subscriptions: userSubscriptions, 
    isLoading: subscriptionsLoading 
  } = useUserSubscriptions(address);
  
  const { 
    cancelSubscription, 
    isPending: isCanceling, 
    isSuccess: cancelSuccess, 
    error: cancelError 
  } = useCancelSubscription();
  
  const { 
    executeSubscription, 
    isPending: isExecuting, 
    isSuccess: executeSuccess, 
    error: executeError 
  } = useExecuteSubscription();
  
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [formData, setFormData] = useState({
    merchant: '',
    token: 'native',
    amount: '',
    interval: '30', // days
    description: ''
  });

  const selectedToken = AVAILABLE_TOKENS.find(token => 
    token.address === formData.token || (formData.token === 'native' && token.address === 'native')
  ) || AVAILABLE_TOKENS[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTokenSelect = (tokenAddress: string) => {
    setFormData({ ...formData, token: tokenAddress });
    setShowTokenSelector(false);
  };

  // Effect hooks for handling success/error states
  useEffect(() => {
    if (createSuccess) {
      toast.success('Subscription created successfully!');
      setFormData({
        merchant: '',
        token: 'native',
        amount: '',
        interval: '30',
        description: ''
      });
      // Note: refetch would be called here if available from the hook
    }
  }, [createSuccess]);

  useEffect(() => {
    if (createErrorDetails) {
      toast.error(`Failed to create subscription: ${createErrorDetails.message}`);
    }
  }, [createErrorDetails]);

  useEffect(() => {
    if (cancelSuccess) {
      toast.success('Subscription cancelled successfully!');
      // Note: refetch would be called here if available from the hook
    }
  }, [cancelSuccess]);

  useEffect(() => {
    if (cancelError) {
      toast.error('Failed to cancel subscription');
    }
  }, [cancelError]);

  useEffect(() => {
    if (executeSuccess) {
      toast.success('Subscription executed successfully!');
      // Note: refetch would be called here if available from the hook
    }
  }, [executeSuccess]);

  useEffect(() => {
    if (executeError) {
      toast.error('Failed to execute subscription payment');
    }
  }, [executeError]);

  const handleCreateSubscription = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Validation
    if (!formData.merchant.trim()) {
      toast.error('Please enter a merchant address');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      const selectedToken = AVAILABLE_TOKENS.find(token => 
        token.address === formData.token || (formData.token === 'native' && token.address === 'native')
      );
      if (!selectedToken) {
        toast.error('Invalid token selected');
        return;
      }

      const tokenAddress = formData.token === 'native' 
        ? '0x0000000000000000000000000000000000000000' as `0x${string}`
        : formData.token as `0x${string}`;

      // Convert interval from days to seconds
      const intervalInSeconds = parseInt(formData.interval) * 24 * 60 * 60;

      await createSubscription(
        formData.merchant as `0x${string}`,
        tokenAddress,
        formData.amount,
        intervalInSeconds
      );
    } catch (err) {
      console.error('Subscription creation failed:', err);
      toast.error('Failed to create subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId: bigint) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await cancelSubscription(subscriptionId);
    } catch (err) {
      console.error('Subscription cancellation failed:', err);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleExecuteSubscription = async (subscriptionId: bigint) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await executeSubscription(subscriptionId);
    } catch (err) {
      console.error('Subscription execution failed:', err);
      toast.error('Failed to execute subscription payment');
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
                  
                  {/* Token Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                      <Icon icon="mdi:coin" size={16} />
                      <span>Payment Token</span>
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
                      <span>Amount per Payment ({selectedToken.symbol})</span>
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
                      <option value="1" style={{ backgroundColor: '#060011' }}>Daily</option>
                      <option value="7" style={{ backgroundColor: '#060011' }}>Weekly</option>
                      <option value="30" style={{ backgroundColor: '#060011' }}>Monthly</option>
                      <option value="90" style={{ backgroundColor: '#060011' }}>Quarterly</option>
                      <option value="365" style={{ backgroundColor: '#060011' }}>Yearly</option>
                    </select>
                  </div>

                  <Button 
                    onClick={handleCreateSubscription}
                    disabled={!isConnected || isCreating || !formData.merchant || !formData.amount || !formData.description}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Subscription...
                      </div>
                    ) : (
                      'Create Subscription'
                    )}
                  </Button>
                  
                  {createErrorDetails && (
                    <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl">
                      <p className="text-red-300 text-sm">
                        Error: {createErrorDetails?.message || 'An unknown error occurred'}
                      </p>
                    </div>
                  )}

                  {createSuccess && (
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
                      <div className="flex items-center space-x-2">
                        <TokenIcon token={selectedToken.icon} size={20} />
                        <span className="text-white font-semibold">
                          {formData.amount || '0'} {selectedToken.symbol}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-400">Frequency</span>
                      <span className="text-white">
                        Every {formData.interval} days
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-400">Network</span>
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
                
                {subscriptionsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your subscriptions...</p>
                  </div>
                ) : userSubscriptions && Array.isArray(userSubscriptions) && userSubscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {userSubscriptions.map((subscription: any, index: number) => {
                      const tokenInfo = AVAILABLE_TOKENS.find(t => 
                        t.address === subscription.token || 
                        (subscription.token === '0x0000000000000000000000000000000000000000' && t.address === 'native')
                      ) || AVAILABLE_TOKENS[0];
                      
                      const nextPayment = getNextPaymentDate(subscription.lastPayment, subscription.interval);
                      
                      return (
                        <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center space-x-2">
                                  <TokenIcon token={tokenInfo.icon} size={24} />
                                  <h3 className="text-lg font-semibold text-white">
                                    {formatPaymentAmount(subscription.amount)} {tokenInfo.symbol}
                                  </h3>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  subscription.isActive 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {subscription.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mb-1">
                                To: {subscription.merchant ? `${subscription.merchant.slice(0, 6)}...${subscription.merchant.slice(-4)}` : 'Unknown'}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {formatSubscriptionInterval(subscription.interval)} • Next: {nextPayment.toLocaleDateString()}
                              </p>
                              {subscription.description && (
                                <p className="text-gray-300 text-sm mt-1">{subscription.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleExecuteSubscription(subscription.id)}
                                disabled={isExecuting || !subscription.isActive}
                              >
                                Execute Now
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-400 hover:bg-red-500/20"
                                onClick={() => handleCancelSubscription(subscription.id)}
                                disabled={isCanceling || !subscription.isActive}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon icon={UI_ICONS.subscriptions} size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-4">No subscriptions found</p>
                    <p className="text-gray-500 text-sm mb-6">Create your first subscription to get started</p>
                    <Button onClick={() => setActiveTab('create')} variant="outline">
                      Create Your First Subscription
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;