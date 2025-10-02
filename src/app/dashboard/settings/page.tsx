export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Configure your merchant account and settlement preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Merchant Name</span>
          <input type="text" placeholder="Acme Inc" className="border rounded-lg p-2 bg-background" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Settlement Spender Address</span>
          <input type="text" placeholder="0x..." className="border rounded-lg p-2 bg-background" />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium">Notification Email</span>
          <input type="email" placeholder="merchant@example.com" className="border rounded-lg p-2 bg-background" />
        </label>
      </div>

      <div className="flex gap-4">
        <button className="rounded-full border border-transparent bg-foreground text-background px-4 py-2 opacity-60 cursor-not-allowed">Save</button>
        <button className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2">Cancel</button>
      </div>
    </div>
  )
}