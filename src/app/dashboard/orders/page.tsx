"use client"

import { useMemo, useState } from "react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

type Order = {
  id: string
  customer: string
  amount: string
  token: string
  chain: string
  status: "Paid" | "Pending" | "Refunded"
  date: string
}

const ORDERS: Order[] = [
  { id: "ORD-1024", customer: "Acme Inc.", amount: "250.00", token: "USDC", chain: "Base", status: "Paid", date: "2025-09-28" },
  { id: "ORD-1025", customer: "Globex", amount: "1.20", token: "ETH", chain: "Ethereum", status: "Pending", date: "2025-09-29" },
  { id: "ORD-1026", customer: "Soylent", amount: "1,100.00", token: "USDC", chain: "Polygon", status: "Refunded", date: "2025-09-30" },
]

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"All" | "Paid" | "Pending" | "Refunded">("All")
  const [sortKey, setSortKey] = useState<"date" | "amount" | "customer">("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    const parseAmount = (s: string) => parseFloat(s.replace(/,/g, ""))
    const data = ORDERS.filter((o) => {
      const matchesQ = q ? o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) : true
      const matchesStatus = status === "All" ? true : o.status === status
      return matchesQ && matchesStatus
    })

    const sorted = data.slice().sort((a, b) => {
      let va: number | string
      let vb: number | string
      if (sortKey === "date") {
        va = new Date(a.date).getTime()
        vb = new Date(b.date).getTime()
      } else if (sortKey === "amount") {
        va = parseAmount(a.amount)
        vb = parseAmount(b.amount)
      } else {
        va = a.customer.toLowerCase()
        vb = b.customer.toLowerCase()
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })

    return sorted
  }, [search, status, sortKey, sortDir])

  const statusBadgeClass = (s: Order["status"]) =>
    s === "Paid"
      ? "bg-green-100 text-green-700 border-green-200"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200"

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold">Orders</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">Recent orders processed via OmniPay.</p>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Search</span>
            <input
              type="text"
              placeholder="Search by ID or customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg p-2 bg-background"
            />
          </label>
        </div>

        <div>
          <span className="text-sm font-medium">Status</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {["All", "Paid", "Pending", "Refunded"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s as typeof status)}
                className={classNames(
                  "px-3 py-2 rounded-full border text-sm",
                  status === s ? "bg-foreground text-background border-foreground" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-medium">Sort</span>
          <div className="mt-2 flex items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
              className="border rounded-lg p-2 bg-background"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="customer">Customer</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              className="px-3 py-2 rounded-full border text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {sortDir === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-neutral-500">
              <th className="py-3 px-4 border-b">Order ID</th>
              <th className="py-3 px-4 border-b">Customer</th>
              <th className="py-3 px-4 border-b">Amount</th>
              <th className="py-3 px-4 border-b">Token</th>
              <th className="py-3 px-4 border-b">Chain</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="text-sm">
                <td className="py-3 px-4 border-b font-mono">{o.id}</td>
                <td className="py-3 px-4 border-b">{o.customer}</td>
                <td className="py-3 px-4 border-b">{o.amount}</td>
                <td className="py-3 px-4 border-b">{o.token}</td>
                <td className="py-3 px-4 border-b">{o.chain}</td>
                <td className="py-3 px-4 border-b">
                  <span className={classNames("inline-flex items-center px-2 py-1 rounded-full border text-xs", statusBadgeClass(o.status))}>{o.status}</span>
                </td>
                <td className="py-3 px-4 border-b">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}