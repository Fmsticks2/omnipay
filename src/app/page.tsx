"use client"

import Link from "next/link"
import { AppKitButton } from "@reown/appkit/react"
import dynamic from "next/dynamic"

const PushChainConnect = dynamic(() => import("./pushchain-kit"), { ssr: false })
import { useAppKitWallet } from "@reown/appkit-wallet-button/react"
import { useAccount } from "wagmi"

export default function Home() {
  const { isReady, isPending, connect } = useAppKitWallet({ namespace: "eip155" })
  const { address, isConnected } = useAccount()

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-8 sm:px-20 py-16 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
      {/* Top-left logo */}
      <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2">
        <img src="/omnipay.svg" alt="OmniPay logo" className="h-10 w-10" />
        <span className="sr-only">OmniPay</span>
      </Link>
      {/* Landing glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-24 right-12 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      <main className="relative w-full max-w-3xl rounded-3xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-black/40 backdrop-blur p-8 sm:p-10 text-center ring-1 ring-white/10 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">OmniPay</h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600">Universal Cross‑Chain Payments</p>

        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          {/* Push Chain UI Kit connect (renders when kit provides components) */}
          <PushChainConnect />
          {/* Existing AppKit universal connect */}
          <AppKitButton />
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-5"
            href="/checkout"
          >
            Go to Checkout
          </Link>
        </div>

        {isConnected && (
          <div className="mt-4 text-sm text-neutral-500">
            Connected Address: <span className="font-mono">{address}</span>
          </div>
        )}
      </main>

      <footer className="relative mt-10 text-sm text-neutral-600 flex items-center gap-2">
        <img src="/omnipay.svg" alt="OmniPay logo" className="h-5 w-5" />
        <span>Powered by PushChain</span>
      </footer>
    </div>
  )
}
