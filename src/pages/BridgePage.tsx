import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRightLeft, 
  ArrowDown, 
  Settings, 
  Info, 
  Zap, 
  Shield,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { formatCurrency } from '../lib/utils'
import { containerVariants, itemVariants, fadeVariants } from '../lib/animations'

interface Network {
  id: string
  name: string
  symbol: string
  icon: string
  color: string
  gasToken: string
  bridgeFee: number
  estimatedTime: number // in minutes
  tvl: number // Total Value Locked
}

interface BridgeRoute {
  from: Network
  to: Network
  fee: number
  estimatedTime: number
  available: boolean
}

const networks: Network[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    color: 'bg-blue-500',
    gasToken: 'ETH',
    bridgeFee: 0.002,
    estimatedTime: 15,
    tvl: 2400000000
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '⬟',
    color: 'bg-purple-500',
    gasToken: 'MATIC',
    bridgeFee: 0.1,
    estimatedTime: 8,
    tvl: 850000000
  },
  {
    id: 'bsc',
    name: 'BSC',
    symbol: 'BNB',
    icon: '🔶',
    color: 'bg-yellow-500',
    gasToken: 'BNB',
    bridgeFee: 0.001,
    estimatedTime: 5,
    tvl: 1200000000
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    icon: '🔷',
    color: 'bg-blue-600',
    gasToken: 'ETH',
    bridgeFee: 0.0005,
    estimatedTime: 12,
    tvl: 950000000
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'OP',
    icon: '🔴',
    color: 'bg-red-500',
    gasToken: 'ETH',
    bridgeFee: 0.0008,
    estimatedTime: 10,
    tvl: 720000000
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '🔺',
    color: 'bg-red-600',
    gasToken: 'AVAX',
    bridgeFee: 0.002,
    estimatedTime: 6,
    tvl: 680000000
  }
]

const supportedTokens = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💵' },
  { symbol: 'USDT', name: 'Tether', icon: '💰' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🟡' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿' },
  { symbol: 'MATIC', name: 'Polygon', icon: '⬟' }
]

export default function BridgePage() {
  const [fromNetwork, setFromNetwork] = useState<Network>(networks[0])
  const [toNetwork, setToNetwork] = useState<Network>(networks[1])
  const [selectedToken, setSelectedToken] = useState(supportedTokens[0])
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSwapNetworks = () => {
    const temp = fromNetwork
    setFromNetwork(toNetwork)
    setToNetwork(temp)
  }

  const calculateFees = () => {
    const bridgeFee = fromNetwork.bridgeFee
    const gasFee = 0.001 // Estimated gas fee
    return {
      bridgeFee,
      gasFee,
      total: bridgeFee + gasFee
    }
  }

  const fees = calculateFees()
  const estimatedReceived = amount ? parseFloat(amount) - fees.total : 0

  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      // toast.error('Please enter a valid amount')
      console.error('Please enter a valid amount')
      return
    }
    
    if (fromNetwork.id === toNetwork.id) {
      // toast.error('Please select different networks')
      console.error('Please select different networks')
      return
    }

    // Mock bridge transaction
    // toast.success('Bridge transaction initiated!')
    console.log('Bridge transaction initiated!')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Cross-Chain Bridge</h1>
          <p className="text-muted-foreground">
            Transfer assets seamlessly across different blockchain networks
          </p>
        </motion.div>

        {/* Bridge Interface */}
        <motion.div variants={itemVariants}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  Bridge Assets
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="p-4 border border-border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      className="bg-transparent text-lg font-medium focus:outline-none"
                      value={fromNetwork.id}
                      onChange={(e) => setFromNetwork(networks.find(n => n.id === e.target.value)!)}
                    >
                      {networks.map(network => (
                        <option key={network.id} value={network.id}>
                          {network.icon} {network.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="font-medium">2.4567 {selectedToken.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      className="bg-transparent font-medium focus:outline-none"
                      value={selectedToken.symbol}
                      onChange={(e) => setSelectedToken(supportedTokens.find(t => t.symbol === e.target.value)!)}
                    >
                      {supportedTokens.map(token => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.icon} {token.symbol}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-right text-2xl font-bold focus:outline-none"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapNetworks}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="p-4 border border-border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      className="bg-transparent text-lg font-medium focus:outline-none"
                      value={toNetwork.id}
                      onChange={(e) => setToNetwork(networks.find(n => n.id === e.target.value)!)}
                    >
                      {networks.map(network => (
                        <option key={network.id} value={network.id}>
                          {network.icon} {network.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="font-medium">0.8934 {selectedToken.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedToken.icon} {selectedToken.symbol}</span>
                    <span className="text-2xl font-bold">
                      {estimatedReceived > 0 ? estimatedReceived.toFixed(6) : '0.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-4 border border-border rounded-lg bg-muted/30"
                >
                  <h4 className="font-medium">Advanced Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Slippage Tolerance</label>
                      <div className="flex space-x-2">
                        {['0.1', '0.5', '1.0'].map(value => (
                          <Button
                            key={value}
                            variant={slippage === value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSlippage(value)}
                          >
                            {value}%
                          </Button>
                        ))}
                        <input
                          type="number"
                          placeholder="Custom"
                          className="px-2 py-1 border border-border rounded text-sm bg-background w-20"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Transaction Deadline</label>
                      <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
                        <option value="20">20 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Transaction Summary */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Estimated Time
                  </span>
                  <span>{Math.max(fromNetwork.estimatedTime, toNetwork.estimatedTime)} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Bridge Fee</span>
                  <span>{formatCurrency(fees.bridgeFee)} {selectedToken.symbol}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Gas Fee</span>
                  <span>~{formatCurrency(fees.gasFee)} {fromNetwork.gasToken}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>You will receive</span>
                    <span>{estimatedReceived > 0 ? estimatedReceived.toFixed(6) : '0.0'} {selectedToken.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Bridge Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBridge}
                disabled={!amount || parseFloat(amount) <= 0 || fromNetwork.id === toNetwork.id}
              >
                <Zap className="w-4 h-4 mr-2" />
                Bridge Assets
              </Button>

              {/* Warning */}
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium mb-1">Important Notice</p>
                  <p>
                    Cross-chain transfers are irreversible. Please double-check the destination network
                    and address before confirming the transaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Network Stats */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Network Statistics
              </CardTitle>
              <CardDescription>
                Real-time data for supported networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {networks.map((network, index) => (
                  <motion.div
                    key={network.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${network.color} flex items-center justify-center text-white text-sm`}>
                        {network.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{network.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ~{network.estimatedTime}m • {formatCurrency(network.bridgeFee)} {network.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${(network.tvl / 1000000000).toFixed(1)}B
                      </p>
                      <p className="text-xs text-muted-foreground">TVL</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Info */}
        <motion.div variants={itemVariants}>
          <Card className="glass border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-green-900 dark:text-green-100">
                    Secure & Audited Bridge Protocol
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Our bridge protocol has been audited by leading security firms and uses multi-signature
                    validation to ensure the highest level of security for your cross-chain transfers.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-green-600 dark:text-green-400">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Multi-sig secured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Audited by CertiK</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>$2.4B+ bridged safely</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}