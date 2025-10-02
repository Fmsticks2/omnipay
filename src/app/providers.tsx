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
  icons: ["/omnipay.svg"],
}

// Define EVM networks and conditionally add Push Chain Testnet via env
const baseNetworks = [mainnet, arbitrum, base, polygon]

const pushRpc = process.env.NEXT_PUBLIC_PUSHCHAIN_RPC_URL
const pushChainId = process.env.NEXT_PUBLIC_PUSHCHAIN_CHAIN_ID
const pushExplorer = process.env.NEXT_PUBLIC_PUSHCHAIN_EXPLORER_URL
const pushName = process.env.NEXT_PUBLIC_PUSHCHAIN_NAME || "Push Testnet Donut"
const pushSymbol = process.env.NEXT_PUBLIC_PUSHCHAIN_SYMBOL || "PUSH"

let networks: any[] = baseNetworks

if (pushRpc && pushChainId) {
  const pushChainTestnet: any = {
    id: Number(pushChainId),
    name: pushName,
    nativeCurrency: { name: pushSymbol, symbol: pushSymbol, decimals: 18 },
    rpcUrls: { default: { http: [pushRpc] } },
    ...(pushExplorer
      ? { blockExplorers: { default: { name: "Explorer", url: pushExplorer } } }
      : {}),
  }
  networks = [...baseNetworks, pushChainTestnet]
}

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