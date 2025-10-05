import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, arbitrum, base, polygon, type AppKitNetwork } from "@reown/appkit/networks"
import { ReactNode } from "react"
import { ThemeProvider } from "../contexts/ThemeContext"

// Setup QueryClient
const queryClient = new QueryClient()

// Read project ID from env
const projectId = import.meta.env.VITE_PROJECT_ID || ""

// Optional metadata for AppKit
const metadata = {
  name: "OmniPay",
  description: "Universal cross-chain payments gateway",
  url: typeof window !== "undefined" ? window.location.origin : "https://localhost",
  icons: ["/omnipay.svg"],
}

// Define EVM networks and conditionally add Push Chain Testnet via env
const baseNetworks: AppKitNetwork[] = [mainnet, arbitrum, base, polygon]

const pushRpc = import.meta.env.VITE_PUSHCHAIN_RPC_URL || "https://evm.rpc-testnet-donut-node1.push.org"
const pushChainId = import.meta.env.VITE_PUSHCHAIN_CHAIN_ID || "42101"
const pushExplorer = import.meta.env.VITE_PUSHCHAIN_EXPLORER_URL || "https://testnet-explorer.push.org"
const pushName = import.meta.env.VITE_PUSHCHAIN_NAME || "Push Testnet Donut"
const pushSymbol = import.meta.env.VITE_PUSHCHAIN_SYMBOL || "PC"

// Contract addresses (using deployed addresses as defaults)
const omniPayNotifier = import.meta.env.VITE_OMNIPAY_NOTIFIER || "0x7c19b04AD3375e3710e5bBF4C528909C407af46B"
const omniPayCore = import.meta.env.VITE_OMNIPAY_CORE || "0x19ADFCCDB66985EeD6dAA6f5A7846A3d4fd86b9D"
const omniPaySubscription = import.meta.env.VITE_OMNIPAY_SUBSCRIPTION || "0x64C4601153e9E553806f37d30f49a0295267c1Ae"
const omniPayBridge = import.meta.env.VITE_OMNIPAY_BRIDGE || "0x634b3cD5db670b9f104D4242621c4E200c6aDb4F"
const omniPaySettlement = import.meta.env.VITE_OMNIPAY_SETTLEMENT || "0x37525E8B82C776F608eCA8A49C000b98a456fBdD"

// Ensure networks array has at least one element for AppKit requirements
let networks: [AppKitNetwork, ...AppKitNetwork[]]

if (pushRpc && pushChainId) {
  const pushChainTestnet: AppKitNetwork = {
    id: Number(pushChainId),
    name: pushName,
    nativeCurrency: { name: pushSymbol, symbol: pushSymbol, decimals: 18 },
    rpcUrls: { default: { http: [pushRpc] } },
    ...(pushExplorer
      ? { blockExplorers: { default: { name: "Explorer", url: pushExplorer } } }
      : {}),
  }
  networks = [baseNetworks[0], ...baseNetworks.slice(1), pushChainTestnet] as [AppKitNetwork, ...AppKitNetwork[]]
} else {
  networks = baseNetworks as [AppKitNetwork, ...AppKitNetwork[]]
}

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

// Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}