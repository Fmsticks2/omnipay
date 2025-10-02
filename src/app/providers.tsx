"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, arbitrum, base, polygon } from "@reown/appkit/networks"

// Setup QueryClient
const queryClient = new QueryClient()

// Read project ID from env
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

// Optional metadata for AppKit
const metadata = {
  name: "OmniPay",
  description: "Universal cross-chain payments gateway",
  url: typeof window !== "undefined" ? window.location.origin : "https://localhost",
  icons: ["/next.svg"],
}

// Define EVM networks for MVP
const networks = [mainnet, arbitrum, base, polygon]

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: networks as any,
  projectId,
  ssr: true,
})

// Initialize AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: networks as any,
  projectId,
  metadata,
  features: { analytics: true },
  // Accent color for modal/button styling
  themeVariables: {
    "--w3m-accent": "#000000",
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}