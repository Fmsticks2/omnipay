import { useEffect, useState } from "react"

// Minimal integration shim for @pushchain/ui-kit without relying on undocumented APIs.
// It dynamically loads the UI Kit and renders an available connect button.
// If the kit exposes a provider, it wraps the button with it.
export default function PushChainConnect() {
  const [mod, setMod] = useState<any>(null)

  useEffect(() => {
    let active = true
    import("@pushchain/ui-kit")
      .then((m) => {
        if (active) setMod(m)
      })
      .catch(() => {
        // Silently ignore if module fails to load
      })
    return () => {
      active = false
    }
  }, [])

  if (!mod) return null

  const Provider = mod.PushChainProvider || mod.UIKitProvider || null
  const Button = mod.ConnectButton || mod.UniversalConnectButton || null

  if (Provider && Button) {
    return (
      <Provider>
        <Button />
      </Provider>
    )
  }

  if (Button) {
    return <Button />
  }

  // If no known export found, render nothing to avoid UI confusion.
  return null
}