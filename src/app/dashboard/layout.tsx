import Link from "next/link"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
      {/* Glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-24 right-12 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 py-10">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-10 items-start justify-center">
          {/* Sidebar */}
          <aside className="rounded-3xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-black/40 backdrop-blur p-6 lg:p-7 ring-1 ring-white/10 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
            <div className="text-xl font-bold tracking-tight">OmniPay</div>
            <nav className="mt-4 flex flex-col gap-3 text-sm">
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/dashboard">Overview</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/dashboard/orders">Orders</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/dashboard/transactions">Transactions</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/dashboard/settings">Settings</Link>
            </nav>
            <div className="mt-6 text-xs text-neutral-500">Enterprise-grade universal payment gateway on Push Chain</div>
          </aside>

          {/* Content */}
          <main className="rounded-3xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-black/40 backdrop-blur p-6 lg:p-10 ring-1 ring-white/10 shadow-[0_0_40px_rgba(34,197,94,0.20)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}