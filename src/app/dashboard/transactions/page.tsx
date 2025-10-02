function truncateHash(hash: string) {
  return hash.length > 12 ? `${hash.slice(0, 6)}…${hash.slice(-4)}` : hash
}

const TXS = [
  { hash: "0x1f8c2dbe93a9b5d8f2b1c9a0b5a1c9d8e4f2c3a1b2c3d4e5f6a7b8c9d0e1f2a3", amount: "250.00", token: "USDC", chain: "Base", status: "Confirmed", date: "2025-09-28" },
  { hash: "0x9a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f", amount: "1.20", token: "ETH", chain: "Ethereum", status: "Pending", date: "2025-09-29" },
  { hash: "0x4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c", amount: "1,100.00", token: "USDC", chain: "Polygon", status: "Failed", date: "2025-09-30" },
]

export default function TransactionsPage() {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold">Transactions</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">Recent on-chain transactions.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-neutral-500">
              <th className="py-3 px-4 border-b">Tx Hash</th>
              <th className="py-3 px-4 border-b">Amount</th>
              <th className="py-3 px-4 border-b">Token</th>
              <th className="py-3 px-4 border-b">Chain</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {TXS.map((t) => (
              <tr key={t.hash} className="text-sm">
                <td className="py-3 px-4 border-b font-mono">{truncateHash(t.hash)}</td>
                <td className="py-3 px-4 border-b">{t.amount}</td>
                <td className="py-3 px-4 border-b">{t.token}</td>
                <td className="py-3 px-4 border-b">{t.chain}</td>
                <td className={`py-3 px-4 border-b ${t.status === "Confirmed" ? "text-green-600" : t.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{t.status}</td>
                <td className="py-3 px-4 border-b">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}