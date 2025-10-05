import { Link } from "react-router-dom"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"

export default function Subscriptions() {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 px-8 py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <img src="/omnipay.svg" alt="OmniPay logo" className="h-8 w-8" />
          <span className="text-xl font-bold">OmniPay</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur rounded-3xl border border-black/[.08] dark:border-white/[.145] p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Subscriptions</h1>
          
          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Please connect your wallet to view your subscriptions
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Go Back Home
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-xl font-semibold mb-2">No Subscriptions Yet</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  You haven't created any subscriptions yet. Start by setting up your first recurring payment.
                </p>
                <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  Create Subscription
                </button>
              </div>

              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Connected: {address}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}