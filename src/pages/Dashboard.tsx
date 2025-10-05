import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Search
} from 'lucide-react';
import { fadeInUp, staggerContainer, scaleOnHover, cn, fadeInLeft, fadeInRight } from '../lib/utils';
import Button from '../components/Button';
import Card from '../components/Card';

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  const stats = [
    {
      title: "Total Balance",
      value: balanceVisible ? "$124,567.89" : "••••••••",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Transactions",
      value: "15,234",
      change: "+23.1%",
      trend: "up",
      icon: Activity,
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Success Rate",
      value: "99.8%",
      change: "-0.1%",
      trend: "down",
      icon: CreditCard,
      color: "from-orange-500 to-red-500"
    }
  ]

  const recentTransactions = [
    {
      id: "TXN001",
      type: "Payment Received",
      amount: "+$2,450.00",
      currency: "ETH",
      status: "completed",
      time: "2 minutes ago",
      from: "0x742d...4e8a"
    },
    {
      id: "TXN002", 
      type: "Payment Sent",
      amount: "-$890.50",
      currency: "USDC",
      status: "pending",
      time: "5 minutes ago",
      from: "0x123a...9b2c"
    },
    {
      id: "TXN003",
      type: "Payment Received", 
      amount: "+$5,200.00",
      currency: "BTC",
      status: "completed",
      time: "12 minutes ago",
      from: "0x456d...7f1e"
    },
    {
      id: "TXN004",
      type: "Payment Sent",
      amount: "-$1,250.75",
      currency: "MATIC",
      status: "failed",
      time: "1 hour ago",
      from: "0x789g...3h4i"
    }
  ]

  const quickActions = [
    {
      title: "Send Payment",
      description: "Transfer funds instantly",
      icon: ArrowUpRight,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Request Payment",
      description: "Generate payment link",
      icon: ArrowDownRight,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "View Analytics",
      description: "Detailed insights",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Security Settings",
      description: "Manage your account",
      icon: Shield,
      color: "from-orange-500 to-red-500"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'failed': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <motion.div variants={fadeInLeft}>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your payments.</p>
          </motion.div>
          
          <motion.div variants={fadeInRight} className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <motion.button
              {...scaleOnHover}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Filter className="w-5 h-5" />
            </motion.button>
            <motion.button
              {...scaleOnHover}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
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
            <Card key={index} className="text-center">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-1"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-white mb-6">
              Quick Actions
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="h-20 flex-col gap-2"
                  icon={action.icon}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-2"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
                <motion.button
                  {...scaleOnHover}
                  className="bg-white/5 border border-white/10 rounded-xl p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="divide-y divide-white/10">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    variants={fadeInUp}
                    className="p-6 hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          transaction.type === "Payment Received" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-blue-500/20 text-blue-400"
                        )}>
                          {transaction.type === "Payment Received" ? (
                            <ArrowDownRight className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{transaction.type}</p>
                          <p className="text-sm text-gray-400">
                            From: {transaction.from} • {transaction.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        )}>
                          {transaction.amount}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(transaction.status)
                          )}>
                            {transaction.status}
                          </span>
                          <span className="text-gray-400 text-sm">{transaction.currency}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        {...scaleOnHover}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all ml-4"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
            <div className="flex items-center gap-2">
              <motion.button
                {...scaleOnHover}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                View Details
              </motion.button>
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-2">Integration with charting library needed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard