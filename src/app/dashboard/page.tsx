"use client"

import Link from "next/link"
import { useChainId } from "wagmi"
import { getContractAddresses } from "../../lib/contracts"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const chainId = useChainId()
  const [contracts, setContracts] = useState<any>(null)
  
  useEffect(() => {
    setContracts(getContractAddresses(chainId))
  }, [chainId])
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">Overview of your OmniPay activity.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-4">
          <div className="text-sm text-neutral-500">Total Volume</div>
          <div className="mt-1 text-2xl font-semibold">$12,340.22</div>
        </div>
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-4">
          <div className="text-sm text-neutral-500">Orders</div>
          <div className="mt-1 text-2xl font-semibold">184</div>
        </div>
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-4">
          <div className="text-sm text-neutral-500">Transactions</div>
          <div className="mt-1 text-2xl font-semibold">209</div>
        </div>
      </div>

      {/* Contract Addresses Section */}
      {contracts && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Deployed Contracts</h2>
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-4 overflow-hidden">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">OmniPay Core</span>
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 p-1 rounded font-mono overflow-x-auto">{contracts.CORE}</code>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">OmniPay Notifier</span>
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 p-1 rounded font-mono overflow-x-auto">{contracts.NOTIFIER}</code>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">OmniPay Subscription</span>
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 p-1 rounded font-mono overflow-x-auto">{contracts.SUBSCRIPTION}</code>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">OmniPay Bridge Stub</span>
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 p-1 rounded font-mono overflow-x-auto">{contracts.BRIDGE_STUB}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/orders" className="rounded-full border border-transparent bg-foreground text-background px-4 py-2 text-sm">View Orders</Link>
        <Link href="/dashboard/transactions" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">View Transactions</Link>
        <Link href="/dashboard/settings" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Settings</Link>
      </div>
    </div>
  )
}