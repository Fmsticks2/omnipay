import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { OMNIPAY_CONTRACTS, CONTRACT_ABIS } from '../config/contracts';
import { TOKEN_ICONS, CHAIN_ICONS } from '../components/ui/iconConstants';

// Enhanced token and chain configurations
const SUPPORTED_TOKENS = {
  mainnet: [
    { symbol: 'ETH', name: 'Ethereum', icon: TOKEN_ICONS.ETH, decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', icon: TOKEN_ICONS.USDC, decimals: 6 },
    { symbol: 'USDT', name: 'Tether', icon: TOKEN_ICONS.USDT, decimals: 6 },
    { symbol: 'DAI', name: 'Dai Stablecoin', icon: TOKEN_ICONS.DAI, decimals: 18 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: TOKEN_ICONS.WBTC, decimals: 8 },
    { symbol: 'MATIC', name: 'Polygon', icon: TOKEN_ICONS.MATIC, decimals: 18 },
    { symbol: 'BNB', name: 'BNB', icon: TOKEN_ICONS.BNB, decimals: 18 },
    { symbol: 'AVAX', name: 'Avalanche', icon: TOKEN_ICONS.AVAX, decimals: 18 },
    { symbol: 'FTM', name: 'Fantom', icon: TOKEN_ICONS.FTM, decimals: 18 },
    { symbol: 'ARB', name: 'Arbitrum', icon: TOKEN_ICONS.ARB, decimals: 18 },
    { symbol: 'OP', name: 'Optimism', icon: TOKEN_ICONS.OP, decimals: 18 },
  ],
  testnet: [
    { symbol: 'ETH', name: 'Sepolia ETH', icon: TOKEN_ICONS.ETH, decimals: 18 },
    { symbol: 'PUSH', name: 'Push Protocol Donut', icon: TOKEN_ICONS.PUSH, decimals: 18 },
    { symbol: 'USDC', name: 'Test USDC', icon: TOKEN_ICONS.USDC, decimals: 6 },
    { symbol: 'USDT', name: 'Test USDT', icon: TOKEN_ICONS.USDT, decimals: 6 },
    { symbol: 'DAI', name: 'Test DAI', icon: TOKEN_ICONS.DAI, decimals: 18 },
  ]
};

const SUPPORTED_CHAINS = {
  mainnet: [
    { id: 'ethereum', name: 'Ethereum', icon: CHAIN_ICONS.ethereum, chainId: 1 },
    { id: 'polygon', name: 'Polygon', icon: CHAIN_ICONS.polygon, chainId: 137 },
    { id: 'arbitrum', name: 'Arbitrum', icon: CHAIN_ICONS.arbitrum, chainId: 42161 },
    { id: 'optimism', name: 'Optimism', icon: CHAIN_ICONS.optimism, chainId: 10 },
    { id: 'base', name: 'Base', icon: CHAIN_ICONS.base, chainId: 8453 },
    { id: 'avalanche', name: 'Avalanche', icon: CHAIN_ICONS.avalanche, chainId: 43114 },
    { id: 'bsc', name: 'BNB Chain', icon: CHAIN_ICONS.bsc, chainId: 56 },
    { id: 'fantom', name: 'Fantom', icon: CHAIN_ICONS.fantom, chainId: 250 },
  ],
  testnet: [
    { id: 'sepolia', name: 'Sepolia Testnet', icon: CHAIN_ICONS.sepolia, chainId: 11155111 },
    { id: 'push', name: 'Push Protocol Testnet', icon: CHAIN_ICONS.push, chainId: 1442 },
    { id: 'polygon-mumbai', name: 'Polygon Mumbai', icon: CHAIN_ICONS.polygon, chainId: 80001 },
    { id: 'arbitrum-goerli', name: 'Arbitrum Goerli', icon: CHAIN_ICONS.arbitrum, chainId: 421613 },
    { id: 'optimism-goerli', name: 'Optimism Goerli', icon: CHAIN_ICONS.optimism, chainId: 420 },
    { id: 'base-goerli', name: 'Base Goerli', icon: CHAIN_ICONS.base, chainId: 84531 },
  ]
};

const BridgePage = (): FunctionComponent => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    targetChain: 'sepolia',
    token: 'PUSH',
    message: '',
    networkType: 'testnet' as 'mainnet' | 'testnet'
  });

  const [bridgeStep, setBridgeStep] = useState<'form' | 'confirm' | 'processing' | 'complete'>('form');
  const [showAllTokens, setShowAllTokens] = useState(false);
  const [showAllChains, setShowAllChains] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNetworkTypeChange = (networkType: 'mainnet' | 'testnet') => {
    setFormData({
      ...formData,
      networkType,
      // Reset selections when switching network types
      token: networkType === 'testnet' ? 'PUSH' : 'ETH',
      targetChain: networkType === 'testnet' ? 'sepolia' : 'polygon'
    });
  };

  // Get current tokens and chains based on network type
  const currentTokens = SUPPORTED_TOKENS[formData.networkType];
  const currentChains = SUPPORTED_CHAINS[formData.networkType];
  
  // Display tokens (show first 4 or all based on state)
  const displayTokens = showAllTokens ? currentTokens : currentTokens.slice(0, 4);
  const displayChains = showAllChains ? currentChains : currentChains.slice(0, 6);

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

  // Mock transaction data with Push Protocol examples
  const mockTransactions = [
    {
      id: '0x1234...5678',
      from: 'Push Protocol Testnet',
      to: 'Sepolia Testnet',
      amount: '100 PUSH',
      status: 'completed',
      timestamp: '2024-10-06 14:30'
    },
    {
      id: '0xabcd...efgh',
      from: 'Sepolia Testnet',
      to: 'Push Protocol Testnet',
      amount: '0.5 ETH',
      status: 'pending',
      timestamp: '2024-10-06 13:15'
    },
    {
      id: '0x9876...5432',
      from: 'Ethereum',
      to: 'Polygon',
      amount: '1000 USDC',
      status: 'completed',
      timestamp: '2024-10-06 12:45'
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
            <Card>
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
          <Card>
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
                <Card>
                  <h2 className="text-2xl font-bold text-white mb-6">Bridge Assets</h2>
                  
                  {/* Network Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Network Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleNetworkTypeChange('testnet')}
                        className={`flex-1 p-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          formData.networkType === 'testnet'
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                        style={
                          formData.networkType === 'testnet'
                            ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                            : { border: '1px solid rgba(255, 255, 255, 0.1)' }
                        }
                      >
                        <Icon icon="mdi:test-tube" size={18} />
                        <span>Testnet</span>
                      </button>
                      <button
                        onClick={() => handleNetworkTypeChange('mainnet')}
                        className={`flex-1 p-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          formData.networkType === 'mainnet'
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                        style={
                          formData.networkType === 'mainnet'
                            ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                            : { border: '1px solid rgba(255, 255, 255, 0.1)' }
                        }
                      >
                        <Icon icon="mdi:earth" size={18} />
                        <span>Mainnet</span>
                      </button>
                    </div>
                  </div>

                  {/* Token Selection */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">Select Token</label>
                      {currentTokens.length > 4 && (
                        <button
                          onClick={() => setShowAllTokens(!showAllTokens)}
                          className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                          {showAllTokens ? 'Show Less' : `Show All (${currentTokens.length})`}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {displayTokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => setFormData({...formData, token: token.symbol})}
                          className={`p-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            formData.token === token.symbol
                              ? 'text-white'
                              : 'text-gray-400'
                          } transition-colors`}
                          style={
                            formData.token === token.symbol
                              ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                              : { border: '1px solid rgba(255, 255, 255, 0.1)' }
                          }
                        >
                          <Icon icon={token.icon} size={20} />
                          <div className="text-left">
                            <div className="text-sm font-medium">{token.symbol}</div>
                            <div className="text-xs opacity-60">{token.name}</div>
                          </div>
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Target Chain */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">Target Chain</label>
                      {currentChains.length > 6 && (
                        <button
                          onClick={() => setShowAllChains(!showAllChains)}
                          className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                          {showAllChains ? 'Show Less' : `Show All (${currentChains.length})`}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {displayChains.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => setFormData({...formData, targetChain: chain.id})}
                          className={`p-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            formData.targetChain === chain.id
                              ? 'text-white'
                              : 'text-gray-400'
                          } transition-colors`}
                          style={
                            formData.targetChain === chain.id
                              ? { backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.4)' }
                              : { border: '1px solid rgba(255, 255, 255, 0.1)' }
                          }
                        >
                          <Icon icon={chain.icon} size={20} />
                          <div className="text-left">
                            <div className="text-sm font-medium">{chain.name}</div>
                            <div className="text-xs opacity-60">Chain ID: {chain.chainId}</div>
                          </div>
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors resize-none"
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
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#060011' }}></span>
                      Secure cross-chain transfers
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#060011' }}></span>
                      Push Protocol Donut bridging support
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#060011' }}></span>
                      Testnet and mainnet compatibility
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#060011' }}></span>
                      Low fees and fast processing
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#060011' }}></span>
                      Real-time transaction tracking
                    </li>
                  </ul>
                </Card>

                {/* Supported Networks */}
                <Card>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Supported Networks ({formData.networkType === 'testnet' ? 'Testnet' : 'Mainnet'})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {currentChains.map((chain) => (
                      <div key={chain.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Icon icon={chain.icon} size={20} />
                        <div>
                          <div className="text-white font-medium text-sm">{chain.name}</div>
                          <div className="text-gray-400 text-xs">ID: {chain.chainId}</div>
                        </div>
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