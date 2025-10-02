"use client"

import Link from "next/link"
import Image from "next/image"
import { useAppKitWallet } from "@reown/appkit-wallet-button/react"

export default function Home() {
  const { isReady, isPending, connect } = useAppKitWallet({
    namespace: "eip155",
  })

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/next.svg" alt="OmniPay" width={180} height={38} priority />

        <h1 className="text-3xl font-bold">OmniPay — Universal Cross-Chain Payments</h1>
        <p className="text-neutral-600">Connect your wallet to start a checkout flow.</p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            disabled={!isReady || isPending}
            onClick={() => connect("walletConnect")}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            {isPending ? "Connecting..." : "Connect Wallet"}
          </button>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://docs.reown.com/appkit/overview"
            target="_blank"
          >
            Reown Docs
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org/docs" target="_blank">
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Next.js Docs
        </Link>
        <Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://tailwindcss.com/docs" target="_blank">
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Tailwind Docs
        </Link>
      </footer>
    </div>
  )
}
