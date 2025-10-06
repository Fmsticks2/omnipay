import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  Download,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Zap,
  QrCode,
  Wallet,
  CreditCard,
  Plus
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { formatAddress, formatCurrency } from '../lib/utils'
import { containerVariants, itemVariants, fadeVariants } from '../lib/animations'

interface PaymentMethod {
  id: string
  name: string
  network: string
  address: string
  balance: string
  currency: string
  icon: string
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Ethereum Mainnet',
    network: 'Ethereum',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    balance: '2.4567',
    currency: 'ETH',
    icon: '⟠'
  },
  {
    id: '2',
    name: 'Polygon Network',
    network: 'Polygon',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    balance: '1,250.00',
    currency: 'MATIC',
    icon: '⬟'
  },
  {
    id: '3',
    name: 'Binance Smart Chain',
    network: 'BSC',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    balance: '0.8934',
    currency: 'BNB',
    icon: '🔶'
  }
]

export default function PaymentsPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    currency: 'ETH',
    message: ''
  })

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      // toast.success('Address copied to clipboard!')
    } catch (err) {
      // toast.error('Failed to copy address')
    }
  }

  const handleSendPayment = () => {
    // toast.error('Please fill in all required fields')
    return

    // toast.success('Payment initiated successfully!')
  }

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
            Please connect your wallet to access payment features.
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-2">
            Send and receive payments across multiple blockchain networks
          </p>
        </motion.div>

        {/* Payment Methods */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Your connected wallets and available balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPaymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMethod?.id === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMethod(method)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.network}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span className="font-medium">{method.balance} {method.currency}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                          {formatAddress(method.address)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleCopyAddress(method.address)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Send/Receive Tabs */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Send Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Send Payment
                </CardTitle>
                <CardDescription>
                  Transfer funds to any wallet address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={sendForm.amount}
                      onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={sendForm.currency}
                      onChange={(e) => setSendForm({ ...sendForm, currency: e.target.value })}
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="MATIC">MATIC</option>
                      <option value="BNB">BNB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                  <textarea
                    placeholder="Add a note for this transaction..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    value={sendForm.message}
                    onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Network Fee</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span>Total</span>
                    <span className="font-medium">
                      {sendForm.amount || '0'} {sendForm.currency} + Fee
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSendPayment}
                  disabled={!sendForm.recipient || !sendForm.amount}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Send Payment
                </Button>
              </CardContent>
            </Card>

            {/* Receive Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Receive Payment
                </CardTitle>
                <CardDescription>
                  Share your wallet address to receive funds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    QR Code for your wallet address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Wallet Address</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={address || ''}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAddress(address!)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Supported Networks
                  </h4>
                  <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ethereum Mainnet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Polygon Network</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Binance Smart Chain</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="lg">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate Payment Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used payment operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Plus className="w-6 h-6" />
                  <span>Add Payment Method</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <ArrowUpRight className="w-6 h-6" />
                  <span>Bulk Transfer</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Clock className="w-6 h-6" />
                  <span>Schedule Payment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}