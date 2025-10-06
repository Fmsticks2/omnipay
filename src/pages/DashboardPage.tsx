import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  Activity,
  Users,
  CreditCard,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import { useAccount, useBalance } from 'wagmi'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { formatAddress, formatCurrency } from '../lib/utils'
import { containerVariants, itemVariants, fadeVariants } from '../lib/animations'

interface Transaction {
  id: string
  type: 'sent' | 'received'
  amount: string
  currency: string
  to: string
  from: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: Date
  hash: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: '1.5',
    currency: 'ETH',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    from: '0x8ba1f109551bD432803012645Hac136c22C177ec',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    hash: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: '2',
    type: 'sent',
    amount: '250',
    currency: 'USDC',
    to: '0x8ba1f109551bD432803012645Hac136c22C177ec',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    hash: '0xabcdef1234567890abcdef1234567890abcdef12'
  },
  {
    id: '3',
    type: 'received',
    amount: '0.025',
    currency: 'BTC',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    from: '0x9cd24f5299505a3b8D4C9db96590c6C87742d35C',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hash: '0x567890abcdef1234567890abcdef1234567890ab'
  }
]

const stats = [
  {
    title: 'Total Balance',
    value: '$12,847.32',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Monthly Volume',
    value: '$45,231.89',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
  {
    title: 'Active Subscriptions',
    value: '24',
    change: '+3',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Transactions',
    value: '1,247',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: Activity,
  },
]

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.from.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || tx.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Wallet className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to access your dashboard and manage your payments.
          </p>
        </motion.div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's an overview of your account activity.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Payment
            </Button>
          </div>
        </motion.div>

        {/* Wallet Info */}
        <motion.div variants={itemVariants}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Connected Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-mono text-lg">{formatAddress(address!)}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <p className="text-sm text-muted-foreground">ETH Balance</p>
                  <p className="text-2xl font-bold">
                    {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownLeft className="w-3 h-3 mr-1" />
                    )}
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest payment activity across all networks
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
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
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'sent' 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {transaction.type === 'sent' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === 'sent' ? 'Sent' : 'Received'} {transaction.amount} {transaction.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'sent' ? 'To' : 'From'}: {formatAddress(transaction.type === 'sent' ? transaction.to : transaction.from)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}