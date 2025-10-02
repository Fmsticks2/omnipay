import Link from "next/link"

export default function DashboardPage() {
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

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/orders" className="rounded-full border border-transparent bg-foreground text-background px-4 py-2 text-sm">View Orders</Link>
        <Link href="/dashboard/transactions" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">View Transactions</Link>
        <Link href="/dashboard/settings" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Settings</Link>
      </div>
    </div>
  )
}