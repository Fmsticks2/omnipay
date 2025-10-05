import { Link } from "react-router-dom"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"

export default function DashboardTransactions() {
  const { address, isConnected } = useAccount()

  const mockTransactions = [
    { id: "0x1234...5678", amount: "$125.50", type: "Payment", date: "2024-01-15 14:30" },
    { id: "0x2345...6789", amount: "$89.99", type: "Refund", date: "2024-01-14 09:15" },
    { id: "0x3456...7890", amount: "$234.75", type: "Payment", date: "2024-01-13 16:45" },
    { id: "0x4567...8901", amount: "$67.25", type: "Payment", date: "2024-01-12 11:20" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/omnipay.svg" alt="OmniPay logo" className="h-8 w-8" />
            <span className="text-xl font-bold">OmniPay</span>
          </Link>
          <span className="text-neutral-400">/</span>
          <Link to="/dashboard" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">
            Dashboard
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="font-medium">Transactions</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur rounded-3xl border border-black/[.08] dark:border-white/[.145] p-8"
        >
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">Track all your payment transactions</p>

          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Please connect your wallet to view transactions
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Connect Wallet
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/50 dark:bg-black/20"
                >
                  <div>
                    <div className="font-mono text-sm">{tx.id}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{tx.amount}</div>
                    <div className={`text-sm ${
                      tx.type === 'Payment' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {tx.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}