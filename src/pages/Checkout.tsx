import { Link } from "react-router-dom"
import { useAccount, useChainId } from "wagmi"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Checkout() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

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
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          
          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Please connect your wallet to continue with checkout
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
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  disabled={!recipient || !amount}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Process Payment
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