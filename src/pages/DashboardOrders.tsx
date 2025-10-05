import { Link } from "react-router-dom"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"

export default function DashboardOrders() {
  const { address, isConnected } = useAccount()

  const mockOrders = [
    { id: "ORD-001", amount: "$125.50", status: "Completed", date: "2024-01-15" },
    { id: "ORD-002", amount: "$89.99", status: "Pending", date: "2024-01-14" },
    { id: "ORD-003", amount: "$234.75", status: "Completed", date: "2024-01-13" },
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
          <span className="font-medium">Orders</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur rounded-3xl border border-black/[.08] dark:border-white/[.145] p-8"
        >
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">Manage your payment orders</p>

          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Please connect your wallet to view orders
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
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/50 dark:bg-black/20"
                >
                  <div>
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">{order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{order.amount}</div>
                    <div className={`text-sm ${
                      order.status === 'Completed' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {order.status}
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