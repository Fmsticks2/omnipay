import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

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
    token: 'ETH' as 'ETH' | 'ERC20',
    tokenAddress: ''
  });

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
    if (!isConnected || !address) return;
    
    try {
      // TODO: Implement real settlement creation with wagmi/viem
      console.log('Creating settlement:', { settlementData, recipients });
      
      // This should call the actual smart contract
      // await writeContract({
      //   address: OMNIPAY_CONTRACTS.SETTLEMENT,
      //   abi: CONTRACT_ABIS.SETTLEMENT,
      //   functionName: 'createSettlement',
      //   args: [...]
      // });
    } catch (err) {
      console.error('Settlement creation failed:', err);
    }
  };

  const mockSettlements = [
    {
      id: 1,
      title: 'Q4 Contractor Payments',
      totalAmount: '5.5 ETH',
      recipients: 8,
      deadline: '2024-11-15',
      status: 'active',
      completed: 3,
      pending: 5
    },
    {
      id: 2,
      title: 'Marketing Campaign Payouts',
      totalAmount: '2,500 USDC',
      recipients: 12,
      deadline: '2024-10-30',
      status: 'completed',
      completed: 12,
      pending: 0
    }
  ];

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
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSettlementData({...settlementData, token: 'ETH'})}
                          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                            settlementData.token === 'ETH'
                              ? 'text-white'
                              : 'text-gray-400'
                          } transition-colors`}
                          style={
                            settlementData.token === 'ETH'
                              ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                              : {}
                          }
                        >
                          ETH
                        </button>
                        <button
                          onClick={() => setSettlementData({...settlementData, token: 'ERC20'})}
                          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                            settlementData.token === 'ERC20'
                              ? 'text-white'
                              : 'text-gray-400'
                          } transition-colors`}
                          style={
                            settlementData.token === 'ERC20'
                              ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                              : {}
                          }
                        >
                          ERC20
                        </button>
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

                  {settlementData.token === 'ERC20' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token Address</label>
                      <input
                        type="text"
                        name="tokenAddress"
                        value={settlementData.tokenAddress}
                        onChange={handleSettlementChange}
                        placeholder="0x..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                  )}

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
                  >
                    Create Settlement
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
                
                {mockSettlements.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">No settlements created</p>
                    <Button onClick={() => setActiveTab('create')} variant="outline">
                      Create Your First Settlement
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockSettlements.map((settlement) => (
                      <div key={settlement.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-xl font-semibold text-white">{settlement.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                settlement.status === 'active'
                                  ? 'text-white'
                                  : 'text-gray-400'
                              } transition-colors`}
                              style={
                                settlement.status === 'active'
                                  ? { backgroundColor: 'rgba(6, 0, 17, 0.2)', color: 'white' }
                                  : {}
                              }>
                                {settlement.status}
                              </span>
                            </div>
                            <p className="text-gray-400 mb-2">
                              Total: {settlement.totalAmount} • {settlement.recipients} recipients
                            </p>
                            <p className="text-gray-400 text-sm">Deadline: {settlement.deadline}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>{settlement.completed}/{settlement.recipients} completed</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all" 
                              style={{ 
                                backgroundColor: '#060011',
                                width: `${(settlement.completed / settlement.recipients) * 100}%` 
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {settlement.status === 'active' && (
                            <Button size="sm" variant="secondary">
                              Execute Payments
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
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

export default SettlementPage;