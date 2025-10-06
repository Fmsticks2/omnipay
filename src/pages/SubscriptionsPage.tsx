import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus, 
  Settings,
  Pause,
  Play,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  MoreHorizontal,
  CreditCard,
  Star,
  Crown,
  Zap
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { formatCurrency, formatAddress } from '../lib/utils'
import { containerVariants, itemVariants, fadeVariants } from '../lib/animations'

interface Subscription {
  id: string
  name: string
  description: string
  amount: number
  currency: string
  interval: 'monthly' | 'yearly' | 'weekly'
  status: 'active' | 'paused' | 'cancelled'
  nextPayment: Date
  subscribers: number
  totalRevenue: number
  createdAt: Date
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
  enterprise?: boolean
}

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Premium API Access',
    description: 'Advanced API features with higher rate limits',
    amount: 99,
    currency: 'USD',
    interval: 'monthly',
    status: 'active',
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    subscribers: 1247,
    totalRevenue: 123453,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
  },
  {
    id: '2',
    name: 'Enterprise Dashboard',
    description: 'Full-featured dashboard with analytics and reporting',
    amount: 299,
    currency: 'USD',
    interval: 'monthly',
    status: 'active',
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
    subscribers: 456,
    totalRevenue: 136344,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
  },
  {
    id: '3',
    name: 'Basic Plan',
    description: 'Essential features for small teams',
    amount: 29,
    currency: 'USD',
    interval: 'monthly',
    status: 'paused',
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    subscribers: 2891,
    totalRevenue: 84239,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120)
  }
]

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 1,000 transactions/month',
      'Basic analytics',
      'Email support',
      'Standard API access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    currency: 'USD',
    interval: 'monthly',
    popular: true,
    features: [
      'Up to 10,000 transactions/month',
      'Advanced analytics & reporting',
      'Priority support',
      'Enhanced API access',
      'Custom webhooks',
      'Multi-user access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'USD',
    interval: 'monthly',
    enterprise: true,
    features: [
      'Unlimited transactions',
      'Custom analytics dashboard',
      'Dedicated support manager',
      'Full API access',
      'Custom integrations',
      'Advanced security features',
      'SLA guarantee',
      'White-label options'
    ]
  }
]

const stats = [
  {
    title: 'Active Subscriptions',
    value: '3',
    change: '+1',
    changeType: 'positive' as const,
    icon: Calendar,
  },
  {
    title: 'Monthly Revenue',
    value: '$12,847',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Total Subscribers',
    value: '4,594',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Churn Rate',
    value: '2.1%',
    change: '-0.5%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
]

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'create'>('overview')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-muted-foreground mt-2">
              Manage your recurring payment plans and subscriber base
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Subscription
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'plans', label: 'Plans' },
              { id: 'create', label: 'Create New' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'overview' && (
          <>
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
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Active Subscriptions */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>
                    Manage your current subscription offerings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSubscriptions.map((subscription, index) => (
                      <motion.div
                        key={subscription.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{subscription.name}</h3>
                              {getStatusIcon(subscription.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{subscription.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>{subscription.subscribers} subscribers</span>
                              <span>•</span>
                              <span>{formatCurrency(subscription.totalRevenue)} total revenue</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                              {subscription.status}
                            </span>
                          </div>
                          <p className="font-medium">
                            {formatCurrency(subscription.amount)}/{subscription.interval}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Next: {subscription.nextPayment.toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              {subscription.status === 'active' ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'plans' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Available subscription tiers and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-6 rounded-lg border ${
                        plan.popular
                          ? 'border-primary bg-primary/5'
                          : plan.enterprise
                          ? 'border-purple-500 bg-purple-500/5'
                          : 'border-border'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </span>
                        </div>
                      )}
                      {plan.enterprise && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Enterprise
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-3xl font-bold">
                          {formatCurrency(plan.price)}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.interval}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'default' : plan.enterprise ? 'gradient' : 'outline'}
                      >
                        {plan.enterprise ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Create New Subscription</CardTitle>
                <CardDescription>
                  Set up a new recurring payment plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Premium Plan"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <input
                      type="text"
                      placeholder="Brief description of the plan"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      placeholder="99.00"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Billing Interval</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <textarea
                    placeholder="List the features included in this plan (one per line)"
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button size="lg">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Subscription
                  </Button>
                  <Button variant="outline" size="lg">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}