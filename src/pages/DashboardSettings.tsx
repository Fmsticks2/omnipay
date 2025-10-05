import { Link } from "react-router-dom"
import { useAccount, useChainId } from "wagmi"
import { motion } from "framer-motion"

export default function DashboardSettings() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

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
          <span className="font-medium">Settings</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur rounded-3xl border border-black/[.08] dark:border-white/[.145] p-8"
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">Configure your merchant settings</p>

          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Please connect your wallet to access settings
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Connect Wallet
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Account Info */}
              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/50 dark:bg-black/20">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Wallet Address</label>
                    <div className="mt-1 font-mono text-sm bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                      {address}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Chain ID</label>
                    <div className="mt-1 text-sm bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                      {chainId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/50 dark:bg-black/20">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Receive email updates for transactions</div>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Get real-time push notifications</div>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>

              {/* API Settings */}
              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/50 dark:bg-black/20">
                <h2 className="text-xl font-semibold mb-4">API Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">API Key</label>
                    <div className="mt-1 flex gap-2">
                      <input 
                        type="password" 
                        value="sk_test_..." 
                        readOnly 
                        className="flex-1 bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-sm"
                      />
                      <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}