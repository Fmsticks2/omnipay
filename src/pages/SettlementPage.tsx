import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRightLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Filter,
  Search,
  Download,
  RefreshCw,
  ExternalLink,
  Zap,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { formatCurrency, formatAddress } from '../lib/utils'
import { containerVariants, itemVariants, fadeVariants } from '../lib/animations'

interface Settlement {
  id: string
  fromChain: string
  toChain: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  initiatedAt: Date
  completedAt?: Date
  txHash: string
  bridgeFee: number
  estimatedTime: number // in minutes
  actualTime?: number // in minutes
}

const mockSettlements: Settlement[] = [
  {
    id: '1',
    fromChain: 'Ethereum',
    toChain: 'Polygon',
    amount: 1500,
    currency: 'USDC',
    status: 'completed',
    initiatedAt: new Date(Date.now() - 1000 * 60 * 45),
    completedAt: new Date(Date.now() - 1000 * 60 * 30),
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    bridgeFee: 2.5,
    estimatedTime: 15,
    actualTime: 12
  },
  {
    id: '2',
    fromChain: 'BSC',
    toChain: 'Ethereum',
    amount: 0.5,
    currency: 'ETH',
    status: 'processing',
    initiatedAt: new Date(Date.now() - 1000 * 60 * 20),
    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    bridgeFee: 0.002,
    estimatedTime: 25
  },
  {
    id: '3',
    fromChain: 'Polygon',
    toChain: 'Arbitrum',
    amount: 2500,
    currency: 'USDT',
    status: 'pending',
    initiatedAt: new Date(Date.now() - 1000 * 60 * 5),
    txHash: '0x567890abcdef1234567890abcdef1234567890ab',
    bridgeFee: 1.8,
    estimatedTime: 10
  },
  {
    id: '4',
    fromChain: 'Ethereum',
    toChain: 'Optimism',
    amount: 750,
    currency: 'DAI',
    status: 'failed',
    initiatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    txHash: '0x890abcdef1234567890abcdef1234567890abcde',
    bridgeFee: 3.2,
    estimatedTime: 20
  }
]

const stats = [
  {
    title: 'Total Volume (24h)',
    value: '$2.4M',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Active Settlements',
    value: '47',
    change: '+8',
    changeType: 'positive' as const,
    icon: ArrowRightLeft,
  },
  {
    title: 'Success Rate',
    value: '99.2%',
    change: '+0.3%',
    changeType: 'positive' as const,
    icon: CheckCircle,
  },
  {
    title: 'Avg Settlement Time',
    value: '14.2 min',
    change: '-2.1 min',
    changeType: 'positive' as const,
    icon: Clock,
  },
]

const supportedChains = [
  { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500', icon: '⟠' },
  { name: 'Polygon', symbol: 'MATIC', color: 'bg-purple-500', icon: '⬟' },
  { name: 'BSC', symbol: 'BNB', color: 'bg-yellow-500', icon: '🔶' },
  { name: 'Arbitrum', symbol: 'ARB', color: 'bg-blue-600', icon: '🔷' },
  { name: 'Optimism', symbol: 'OP', color: 'bg-red-500', icon: '🔴' },
  { name: 'Avalanche', symbol: 'AVAX', color: 'bg-red-600', icon: '🔺' }
]

export default function SettlementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all')
  const [selectedChain, setSelectedChain] = useState<string>('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'processing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredSettlements = mockSettlements.filter(settlement => {
    const matchesSearch = settlement.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.fromChain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.toChain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || settlement.status === filterStatus
    const matchesChain = selectedChain === 'all' || 
                        settlement.fromChain.toLowerCase() === selectedChain.toLowerCase() ||
                        settlement.toChain.toLowerCase() === selectedChain.toLowerCase()
    return matchesSearch && matchesStatus && matchesChain
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settlement</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage cross-chain transaction settlements
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Zap className="w-4 h-4 mr-2" />
              New Settlement
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-300" hover>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs flex items-center ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change} from last 24h
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Supported Chains */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Supported Networks
              </CardTitle>
              <CardDescription>
                Cross-chain settlement is available across these networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {supportedChains.map((chain, index) => (
                  <motion.div
                    key={chain.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-full ${chain.color} flex items-center justify-center text-white text-xl mb-2`}>
                      {chain.icon}
                    </div>
                    <span className="font-medium text-sm">{chain.name}</span>
                    <span className="text-xs text-muted-foreground">{chain.symbol}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settlements Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Recent Settlements</CardTitle>
                  <CardDescription>
                    Track the status of your cross-chain transactions
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search settlements..."
                      className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                  >
                    <option value="all">All Chains</option>
                    {supportedChains.map(chain => (
                      <option key={chain.name} value={chain.name}>{chain.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSettlements.map((settlement, index) => (
                  <motion.div
                    key={settlement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ArrowRightLeft className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{settlement.fromChain}</span>
                          <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{settlement.toChain}</span>
                          {getStatusIcon(settlement.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(settlement.amount)} {settlement.currency}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span>Fee: {formatCurrency(settlement.bridgeFee)}</span>
                          <span>•</span>
                          <span>
                            {settlement.status === 'completed' && settlement.actualTime
                              ? `Completed in ${settlement.actualTime}m`
                              : `Est. ${settlement.estimatedTime}m`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                          {settlement.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {settlement.initiatedAt.toLocaleString()}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {formatAddress(settlement.txHash)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {filteredSettlements.length === 0 && (
                <div className="text-center py-8">
                  <ArrowRightLeft className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No settlements found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Settlement Info */}
        <motion.div variants={itemVariants}>
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Secure Cross-Chain Settlements</h3>
                  <p className="text-sm text-muted-foreground">
                    All settlements are secured by multi-signature protocols and real-time monitoring.
                    Average settlement time is under 15 minutes with 99.9% success rate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}