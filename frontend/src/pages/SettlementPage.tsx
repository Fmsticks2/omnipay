import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon, { TokenIcon } from '../components/ui/Icon';
import { TOKEN_ICONS } from '../components/ui/iconConstants';
import { 
  useCreateSettlement, 
  useExecuteSettlement, 
  useCancelSettlement,
  usePayerSettlements,
  usePayeeSettlements,
  useSettlementDetails
} from '../hooks/useOmniPayContracts';
import { SUPPORTED_TOKENS } from '../config/contracts';
import { formatEther } from 'viem';

// Token configuration with proper addresses and metadata
const AVAILABLE_TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    icon: 'eth' as keyof typeof TOKEN_ICONS,
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

const SettlementPage = (): FunctionComponent => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [recipients, setRecipients] = useState([
    { address: '', amount: '', token: 'ETH' }
  ]);
  const [settlementData, setSettlementData] = useState({
    title: '',
    description: '',
    deadline: '',
    token: AVAILABLE_TOKENS[0].address as `0x${string}`, // Default to ETH
    tokenAddress: ''
  });
  const [showTokenSelector, setShowTokenSelector] = useState(false);

  // Smart contract hooks
  const { createSettlement, isPending: isCreating, isSuccess: isCreateSuccess, error: createError } = useCreateSettlement();
  const { executeSettlement, isPending: isExecuting, isSuccess: isExecuteSuccess, error: executeError } = useExecuteSettlement();
  const { cancelSettlement, isPending: isCanceling, isSuccess: isCancelSuccess, error: cancelError } = useCancelSettlement();
  
  // Get user's settlements
  const { settlementIds: payerSettlementIds, isLoading: isLoadingPayerSettlements } = usePayerSettlements(address);
  const { settlementIds: payeeSettlementIds, isLoading: isLoadingPayeeSettlements } = usePayeeSettlements(address);

  // Handle success/error states
  useEffect(() => {
    if (isCreateSuccess) {
      toast.success('Settlement created successfully!');
      // Reset form
      setSettlementData({
        title: '',
        description: '',
        deadline: '',
        token: AVAILABLE_TOKENS[0].address as `0x${string}`,
        tokenAddress: ''
      });
      setRecipients([{ address: '', amount: '', token: 'ETH' }]);
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (createError) {
      toast.error(`Settlement creation failed: ${createError.message}`);
    }
  }, [createError]);

  useEffect(() => {
    if (isExecuteSuccess) {
      toast.success('Settlement executed successfully!');
    }
  }, [isExecuteSuccess]);

  useEffect(() => {
    if (executeError) {
      toast.error(`Settlement execution failed: ${executeError.message}`);
    }
  }, [executeError]);

  useEffect(() => {
    if (isCancelSuccess) {
      toast.success('Settlement cancelled successfully!');
    }
  }, [isCancelSuccess]);

  useEffect(() => {
    if (cancelError) {
      toast.error(`Settlement cancellation failed: ${cancelError.message}`);
    }
  }, [cancelError]);

  const addRecipient = () => {
    setRecipients([...recipients, { address: '', amount: '', token: settlementData.token }]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, field: string, value: string) => {
    const updated = recipients.map((recipient, i) => 
      i === index ? { ...recipient, [field]: value } : recipient
    );
    setRecipients(updated);
  };

  const handleSettlementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettlementData({
      ...settlementData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateSettlement = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Validate form data
    if (!settlementData.title.trim()) {
      toast.error('Please enter a settlement title');
      return;
    }

    if (recipients.some(r => !r.address || !r.amount)) {
      toast.error('Please fill in all recipient details');
      return;
    }

    const selectedToken = AVAILABLE_TOKENS.find(token => token.address === settlementData.token);
    if (!selectedToken) {
      toast.error('Please select a valid token');
      return;
    }

    try {
      // For now, create individual settlements for each recipient
      // In a real implementation, you might want to create a batch settlement
      for (const recipient of recipients) {
        if (!recipient.address || !recipient.amount) continue;
        
        const tokenAddress = settlementData.token === '0x0000000000000000000000000000000000000000' 
          ? '0x0000000000000000000000000000000000000000' // ETH address
          : settlementData.token as `0x${string}`;

        await createSettlement(
          recipient.address as `0x${string}`,
          tokenAddress,
          (parseFloat(recipient.amount) * Math.pow(10, selectedToken.decimals)).toString(),
          `${settlementData.title} - ${settlementData.description || 'Settlement payment'}`
        );
      }
    } catch (err) {
      console.error('Settlement creation failed:', err);
      toast.error('Failed to create settlement. Please try again.');
    }
  };

  // Component to display individual settlement details
  const SettlementItem = ({ settlementId }: { settlementId: bigint }) => {
    const { settlement, isLoading } = useSettlementDetails(settlementId);

    if (isLoading) {
      return (
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      );
    }

    if (!settlement || !Array.isArray(settlement)) return null;

    const [payer, payee, token, amount, paymentRef, status, createdAt] = settlement as [
      string, string, string, bigint, string, number, bigint
    ];
    const isETH = token === '0x0000000000000000000000000000000000000000';
    const statusText = status === 0 ? 'Pending' : status === 1 ? 'Executed' : 'Cancelled';
    const statusColor = status === 0 ? 'text-yellow-400' : status === 1 ? 'text-green-400' : 'text-red-400';

    const handleExecute = async () => {
      try {
        await executeSettlement(settlementId, isETH, isETH ? formatEther(amount) : undefined);
      } catch (err) {
        console.error('Execute settlement failed:', err);
      }
    };

    const handleCancel = async () => {
      try {
        await cancelSettlement(settlementId);
      } catch (err) {
        console.error('Cancel settlement failed:', err);
      }
    };

    return (
      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-xl font-semibold text-white">{paymentRef}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                {statusText}
              </span>
            </div>
            <p className="text-gray-400 mb-2">
              Amount: {formatEther(amount)} {isETH ? 'ETH' : 'tokens'}
            </p>
            <p className="text-gray-400 text-sm">
              {address?.toLowerCase() === payer.toLowerCase() ? `To: ${payee}` : `From: ${payer}`}
            </p>
            <p className="text-gray-400 text-sm">
              Created: {new Date(Number(createdAt) * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            View Details
          </Button>
          {status === 0 && address?.toLowerCase() === payer.toLowerCase() && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleExecute}
              disabled={isExecuting}
            >
              {isExecuting ? 'Executing...' : 'Execute Payment'}
            </Button>
          )}
          {status === 0 && (address?.toLowerCase() === payer.toLowerCase() || address?.toLowerCase() === payee.toLowerCase()) && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isCanceling}
              className="text-red-400 border-red-400 hover:bg-red-400/10"
            >
              {isCanceling ? 'Cancelling...' : 'Cancel'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const totalAmount = recipients.reduce((sum, recipient) => {
    return sum + (parseFloat(recipient.amount) || 0);
  }, 0);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Batch Settlements
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Efficiently process multiple payments in a single transaction with our smart settlement system.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
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
                Create Settlement
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
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
                Manage Settlements
              </button>
            </div>
          </div>

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settlement Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2"
              >
                <Card>
                  <h2 className="text-2xl font-bold text-white mb-6">Create Batch Settlement</h2>
                  
                  {/* Settlement Details */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Settlement Title</label>
                    <input
                      type="text"
                      name="title"
                      value={settlementData.title}
                      onChange={handleSettlementChange}
                      placeholder="e.g., Q4 Contractor Payments"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={settlementData.description}
                      onChange={handleSettlementChange}
                      placeholder="Brief description of the settlement..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Payment Token</label>
                      <div className="relative">
                        <button
                          onClick={() => setShowTokenSelector(!showTokenSelector)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:border-green-500 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {(() => {
                              const selectedToken = AVAILABLE_TOKENS.find(token => token.address === settlementData.token);
                              return selectedToken ? (
                                <>
                                  <TokenIcon token={selectedToken.icon} size="sm" />
                                  <span>{selectedToken.symbol}</span>
                                </>
                              ) : (
                                <span>Select Token</span>
                              );
                            })()}
                          </div>
                          <Icon icon="mdi:chevron-down" className={`w-5 h-5 transition-transform ${showTokenSelector ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showTokenSelector && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-white/20 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                            {AVAILABLE_TOKENS.map((token) => (
                              <button
                                key={token.address}
                                onClick={() => {
                                   setSettlementData({...settlementData, token: token.address as `0x${string}`});
                                   setShowTokenSelector(false);
                                 }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                              >
                                <TokenIcon token={token.icon} size="sm" />
                                <div>
                                  <div className="text-white font-medium">{token.symbol}</div>
                                  <div className="text-gray-400 text-sm">{token.name}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        value={settlementData.deadline}
                        onChange={handleSettlementChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Recipients */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-300">Recipients</label>
                      <Button onClick={addRecipient} size="sm" variant="outline">
                        Add Recipient
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {recipients.map((recipient, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Recipient {index + 1}</span>
                            {recipients.length > 1 && (
                              <button
                                onClick={() => removeRecipient(index)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Recipient address (0x...)"
                              value={recipient.address}
                              onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors text-sm"
                            />
                            <input
                              type="number"
                              placeholder={`Amount (${settlementData.token})`}
                              value={recipient.amount}
                              onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                              step="0.000001"
                              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateSettlement}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                    disabled={isCreating || !isConnected}
                  >
                    {isCreating ? 'Creating Settlement...' : 'Create Settlement'}
                  </Button>
                </Card>
              </motion.div>

              {/* Settlement Summary */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Settlement Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipients:</span>
                      <span className="text-white font-medium">{recipients.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-white font-medium">
                        {totalAmount.toFixed(6)} {settlementData.token}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. Gas Fee:</span>
                      <span className="text-white font-medium">~$5.20</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Settlement Benefits</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Batch multiple payments
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Reduce gas costs
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Automated execution
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Transparent tracking
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
                        <h4 className="text-white font-medium">Add Recipients</h4>
                        <p className="text-gray-400 text-sm">List all payment recipients and amounts</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#060011' }}>
                        2
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Create Settlement</h4>
                        <p className="text-gray-400 text-sm">Deploy smart contract with payment details</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#060011' }}>
                        3
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Execute Payments</h4>
                        <p className="text-gray-400 text-sm">Process all payments in single transaction</p>
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
                <h2 className="text-2xl font-bold text-white mb-6">Your Settlements</h2>
                
                {!isConnected ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Connect your wallet to view settlements</p>
                  </div>
                ) : isLoadingPayerSettlements || isLoadingPayeeSettlements ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Loading settlements...</p>
                  </div>
                ) : (
                  (() => {
                    const allSettlementIds = [
                      ...(Array.isArray(payerSettlementIds) ? payerSettlementIds as bigint[] : []),
                      ...(Array.isArray(payeeSettlementIds) ? payeeSettlementIds as bigint[] : [])
                    ].filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

                    return allSettlementIds.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No settlements found</p>
                        <Button onClick={() => setActiveTab('create')} variant="outline">
                          Create Your First Settlement
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {allSettlementIds.map((settlementId) => (
                          <SettlementItem key={settlementId.toString()} settlementId={settlementId} />
                        ))}
                      </div>
                    );
                  })()
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SettlementPage;