import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Send, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  Users,
  Activity,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Bell,
  Shield,
  Search,
  Eye,
  EyeOff,
  Wallet,
  Globe,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Settings,
  Star,
  Layers,
  Target,
  Award,
  TrendingDown
} from 'lucide-react';
import { fadeInUp, staggerContainer, scaleOnHover, cn, fadeInLeft, fadeInRight } from '../lib/utils';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would update real-time data in a real application
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Total Portfolio Value",
      value: balanceVisible ? "$2,847,392.45" : "••••••••••",
      change: "+24.8%",
      changeValue: "+$567,234",
      trend: "up",
      icon: Wallet,
      color: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
      title: "Monthly Revenue",
      value: "$847,293.12",
      change: "+18.2%",
      changeValue: "+$127,834",
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      title: "Active Transactions",
      value: "15,847",
      change: "+32.1%",
      changeValue: "+3,847",
      trend: "up",
      icon: Activity,
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/10 to-violet-500/10"
    },
    {
      title: "Success Rate",
      value: "99.94%",
      change: "+0.12%",
      changeValue: "↑ 0.12%",
      trend: "up",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN-2024-001847",
      type: "Payment Received",
      amount: "+$24,567.89",
      currency: "ETH",
      status: "completed",
      time: "2 minutes ago",
      from: "0x742d35Cc6634C0532925a3b8D4e8a",
      network: "Ethereum",
      fee: "$12.45",
      hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"
    },
    {
      id: "TXN-2024-001846", 
      type: "Payment Sent",
      amount: "-$8,934.50",
      currency: "USDC",
      status: "pending",
      time: "5 minutes ago",
      from: "0x123a45b67c89d0ef12345678901234567890abcd",
      network: "Polygon",
      fee: "$2.15",
      hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef123a"
    },
    {
      id: "TXN-2024-001845",
      type: "Payment Received", 
      amount: "+$52,847.00",
      currency: "BTC",
      status: "completed",
      time: "12 minutes ago",
      from: "0x456d78e90f12a34b56c78d90e12f34a56b78c90d",
      network: "Bitcoin",
      fee: "$45.67",
      hash: "0x3c4d5e6f7890abcdef1234567890abcdef123a4b"
    },
    {
      id: "TXN-2024-001844",
      type: "Payment Sent",
      amount: "-$12,567.75",
      currency: "MATIC",
      status: "failed",
      time: "1 hour ago",
      from: "0x789g01h23i45j67k89l01m23n45o67p89q01r23s",
      network: "Polygon",
      fee: "$0.85",
      hash: "0x4d5e6f7890abcdef1234567890abcdef123a4b5c"
    },
    {
      id: "TXN-2024-001843",
      type: "Payment Received",
      amount: "+$7,234.12",
      currency: "SOL",
      status: "completed",
      time: "2 hours ago",
      from: "0xabc123def456ghi789jkl012mno345pqr678stu901",
      network: "Solana",
      fee: "$0.12",
      hash: "0x5e6f7890abcdef1234567890abcdef123a4b5c6d"
    }
  ];

  const quickActions = [
    {
      title: "Send Payment",
      description: "Transfer crypto instantly",
      icon: Send,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      hoverColor: "hover:bg-blue-500/20"
    },
    {
      title: "Request Payment",
      description: "Generate payment link",
      icon: ArrowDownRight,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      hoverColor: "hover:bg-green-500/20"
    },
    {
      title: "Analytics",
      description: "View detailed insights",
      icon: BarChart3,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      hoverColor: "hover:bg-purple-500/20"
    },
    {
      title: "Security",
      description: "Manage account security",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      hoverColor: "hover:bg-orange-500/20"
    }
  ];

  const portfolioBreakdown = [
    { name: "Ethereum", symbol: "ETH", value: "$1,247,892", percentage: 43.8, color: "bg-blue-500" },
    { name: "Bitcoin", symbol: "BTC", value: "$856,234", percentage: 30.1, color: "bg-orange-500" },
    { name: "Polygon", symbol: "MATIC", value: "$423,567", percentage: 14.9, color: "bg-purple-500" },
    { name: "Solana", symbol: "SOL", value: "$234,891", percentage: 8.2, color: "bg-green-500" },
    { name: "Others", symbol: "...", value: "$84,808", percentage: 3.0, color: "bg-gray-500" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'text-blue-400 bg-blue-400/10';
      case 'bitcoin': return 'text-orange-400 bg-orange-400/10';
      case 'polygon': return 'text-purple-400 bg-purple-400/10';
      case 'solana': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <motion.div variants={fadeInLeft} className="mb-6 lg:mb-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white">Dashboard</h1>
                  <p className="text-slate-400 text-lg">Real-time portfolio & transaction insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Last updated: just now</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInRight} className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions, addresses..."
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all w-80"
                />
              </div>
              
              <Button variant="secondary" size="lg" icon={Filter}>
                Filter
              </Button>
              
              <Button variant="secondary" size="lg" icon={Bell}>
                <span className="sr-only">Notifications</span>
              </Button>
              
              <Button variant="gradient" size="lg" icon={Plus} glow>
                New Transaction
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} custom={index * 0.1}>
                <Card variant="premium" padding="lg" hover glow className="group">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        stat.trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-3xl md:text-4xl font-black text-white group-hover:text-purple-200 transition-colors">
                        {stat.value}
                      </h3>
                      {stat.title === "Total Portfolio Value" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={balanceVisible ? EyeOff : Eye}
                          onClick={() => setBalanceVisible(!balanceVisible)}
                          className="opacity-60 hover:opacity-100"
                        />
                      )}
                    </div>
                    <p className="text-slate-400 font-medium">{stat.title}</p>
                    <p className="text-sm text-slate-500">{stat.changeValue} from last month</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 mb-8">
            {/* Quick Actions */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-4"
            >
              <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-purple-400" />
                Quick Actions
              </motion.h2>
              
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div key={index} variants={fadeInUp} custom={index * 0.1}>
                    <Card 
                      variant="glass" 
                      padding="lg" 
                      hover 
                      interactive
                      className={`group cursor-pointer ${action.bgColor} ${action.hoverColor} transition-all duration-300`}
                    >
                      <div className="text-center space-y-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-purple-200 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Portfolio Breakdown */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-8"
            >
              <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <PieChart className="w-6 h-6 text-purple-400" />
                Portfolio Breakdown
              </motion.h2>
              
              <Card variant="premium" padding="lg">
                <div className="space-y-4">
                  {portfolioBreakdown.map((asset, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      custom={index * 0.1}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{asset.name}</span>
                            <span className="text-sm text-slate-400">{asset.symbol}</span>
                          </div>
                          <div className="text-sm text-slate-500">{asset.percentage}% of portfolio</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-white group-hover:text-purple-200 transition-colors">
                          {asset.value}
                        </div>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                          <motion.div
                            className={`h-full ${asset.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${asset.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Activity className="w-6 h-6 text-purple-400" />
                Recent Transactions
              </h2>
              
              <div className="flex items-center gap-4">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                
                <Button variant="secondary" icon={Download}>
                  Export
                </Button>
                
                <Button variant="secondary" icon={RefreshCw}>
                  Refresh
                </Button>
              </div>
            </motion.div>

            <Card variant="premium" padding="none">
              <div className="divide-y divide-white/10">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    variants={fadeInUp}
                    custom={index * 0.05}
                    className="p-6 hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                          transaction.type === "Payment Received" 
                            ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        )}>
                          {transaction.type === "Payment Received" ? (
                            <ArrowDownRight className="w-6 h-6 text-white" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6 text-white" />
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-white">{transaction.type}</p>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                              getStatusColor(transaction.status)
                            )}>
                              {getStatusIcon(transaction.status)}
                              {transaction.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>ID: {transaction.id}</span>
                            <span>•</span>
                            <span>{transaction.time}</span>
                            <span>•</span>
                            <span className={cn(
                              "px-2 py-1 rounded-md text-xs font-medium",
                              getNetworkColor(transaction.network)
                            )}>
                              {transaction.network}
                            </span>
                          </div>
                          
                          <div className="text-xs text-slate-500">
                            From: {transaction.from}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            "text-xl font-bold",
                            transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          )}>
                            {transaction.amount}
                          </p>
                          <span className="text-slate-400 text-sm font-medium">{transaction.currency}</span>
                        </div>
                        
                        <div className="text-sm text-slate-500">
                          Fee: {transaction.fee}
                        </div>
                        
                        <div className="text-xs text-slate-600 font-mono">
                          {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-8)}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={MoreHorizontal}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-4"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-6 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400">Showing 5 of 1,247 transactions</p>
                  <Button variant="secondary">
                    View All Transactions
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Performance Chart */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <Card variant="premium" padding="lg">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  Performance Analytics
                </h2>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                    {['1D', '7D', '1M', '3M', '1Y'].map((period) => (
                      <button
                        key={period}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          period === '7D' 
                            ? "bg-purple-500 text-white shadow-lg" 
                            : "text-slate-400 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  
                  <Button variant="gradient" icon={BarChart3}>
                    Advanced Analytics
                  </Button>
                </div>
              </div>
              
              <div className="h-80 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Advanced Chart Integration</h3>
                    <p className="text-slate-400 max-w-md">
                      Real-time portfolio performance visualization with interactive charts and detailed analytics
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                      <span>Profit: +$127,834</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-3 h-3 bg-blue-400 rounded-full" />
                      <span>Volume: $2.8M</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-3 h-3 bg-purple-400 rounded-full" />
                      <span>Growth: +24.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;