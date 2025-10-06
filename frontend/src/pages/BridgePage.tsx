import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { OMNIPAY_CONTRACTS, CONTRACT_ABIS } from '../config/contracts';

const BridgePage = (): FunctionComponent => {
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    targetChain: 'polygon',
    token: 'ETH',
    message: ''
  });

  const [bridgeStep, setBridgeStep] = useState<'form' | 'confirm' | 'processing' | 'complete'>('form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBridge = async () => {
    if (!isConnected || !address) return;
    
    setBridgeStep('confirm');
  };

  const confirmBridge = async () => {
    if (!isConnected || !address) return;

    try {
      setBridgeStep('processing');
      
      await writeContract({
        address: OMNIPAY_CONTRACTS.BRIDGE,
        abi: CONTRACT_ABIS.BRIDGE,
        functionName: 'bridgePayment',
        args: [
          formData.recipient as `0x${string}`,
          parseEther(formData.amount),
          '0x0000000000000000000000000000000000000000' as `0x${string}`, // ETH
          formData.message,
          BigInt(1), // target chain ID - should be dynamic
        ],
        value: parseEther(formData.amount),
      });
    } catch (err) {
      console.error('Bridge failed:', err);
      setBridgeStep('form');
    }
  };

  // Watch for transaction success
  if (isSuccess && bridgeStep === 'processing') {
    setBridgeStep('complete');
  }

  const supportedChains = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
    { id: 'polygon', name: 'Polygon', icon: '⬟' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
    { id: 'optimism', name: 'Optimism', icon: '🔴' },
    { id: 'base', name: 'Base', icon: '🔵' },
    { id: 'avalanche', name: 'Avalanche', icon: '🔺' }
  ];

  const supportedTokens = [
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵' },
    { symbol: 'USDT', name: 'Tether', icon: '💰' },
    { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🟡' }
  ];

  const mockTransactions = [
    {
      id: '0x1234...5678',
      from: 'Ethereum',
      to: 'Polygon',
      amount: '0.5 ETH',
      status: 'completed',
      timestamp: '2024-10-06 14:30'
    },
    {
      id: '0xabcd...efgh',
      from: 'Polygon',
      to: 'Arbitrum',
      amount: '100 USDC',
      status: 'pending',
      timestamp: '2024-10-06 13:15'
    }
  ];

  if (bridgeStep === 'confirm') {
    return (
      <Layout>
        <div className="min-h-screen py-20 px-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card gradient>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Confirm Bridge Transaction</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-medium">{formData.amount} {formData.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-white font-medium">Ethereum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white font-medium capitalize">{formData.targetChain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recipient:</span>
                  <span className="text-white font-medium">{formData.recipient.slice(0, 6)}...{formData.recipient.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Fee:</span>
                  <span className="text-white font-medium">~$2.50</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setBridgeStep('form')} 
                  variant="outline" 
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={confirmBridge} 
                  variant="secondary" 
                  className="flex-1"
                >
                  Confirm Bridge
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (bridgeStep === 'processing') {
    return (
      <Layout>
        <div className="min-h-screen py-20 px-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <Card>
              <div className="py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
                />
                <h2 className="text-2xl font-bold text-white mb-4">Processing Bridge</h2>
                <p className="text-gray-400">Your cross-chain transaction is being processed...</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (bridgeStep === 'complete') {
    return (
      <Layout>
        <div className="min-h-screen py-20 px-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <Card>
              <div className="py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Bridge Complete!</h2>
                <p className="text-gray-400 mb-6">Your tokens have been successfully bridged to {formData.targetChain}.</p>
                <Button onClick={() => setBridgeStep('form')} variant="secondary">
                  Bridge Again
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!isConnected ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card gradient>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-6">Please connect your wallet to use the bridge functionality.</p>
              <ConnectButton />
            </div>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Cross-Chain Bridge
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Seamlessly transfer your assets across different blockchain networks with our secure bridge.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bridge Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card gradient>
                  <h2 className="text-2xl font-bold text-white mb-6">Bridge Assets</h2>
                  
                  {/* Token Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Select Token</label>
                    <div className="grid grid-cols-2 gap-2">
                      {supportedTokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => setFormData({...formData, token: token.symbol})}
                          className={`p-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            formData.token === token.symbol
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          <span>{token.icon}</span>
                          <span>{token.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.000001"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Target Chain */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Target Chain</label>
                    <div className="grid grid-cols-2 gap-2">
                      {supportedChains.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => setFormData({...formData, targetChain: chain.id})}
                          className={`p-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            formData.targetChain === chain.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          <span>{chain.icon}</span>
                          <span className="text-sm">{chain.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                    <input
                      type="text"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Optional Message */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message (Optional)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Add a note to your transaction..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleBridge}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                  >
                    Bridge Assets
                  </Button>
                </Card>
              </motion.div>

              {/* Bridge Info & Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Bridge Features */}
                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Bridge Features</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Secure cross-chain transfers
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Low fees and fast processing
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Support for major networks
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Real-time transaction tracking
                    </li>
                  </ul>
                </Card>

                {/* Supported Networks */}
                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Supported Networks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {supportedChains.map((chain) => (
                      <div key={chain.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <span className="text-xl">{chain.icon}</span>
                        <span className="text-white font-medium">{chain.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">Recent Bridge Transactions</h3>
                  <div className="space-y-3">
                    {mockTransactions.map((tx) => (
                      <div key={tx.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{tx.amount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{tx.from} → {tx.to}</p>
                        <p className="text-gray-500 text-xs mt-1">{tx.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BridgePage;