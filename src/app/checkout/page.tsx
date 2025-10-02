"use client"

import Link from "next/link"
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useSendTransaction } from "wagmi"
import { useState, useMemo } from "react"
import { parseUnits, isAddress } from "viem"
import { ERC20_ABI } from "../../lib/erc20"
import { motion } from "framer-motion"

const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  polygon: 137,
  arbitrum: 42161,
}

// Token addresses (Base only for MVP)
const TOKEN_ADDRESSES_BASE: Record<string, `0x${string}` | undefined> = {
  USDC: "0x833589fCD6EDb6E08f4c7c32D4f71B54Bda02913",
  WETH: undefined, // TODO: add WETH address on Base when ready
}

export default function CheckoutPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const { sendTransactionAsync } = useSendTransaction()

  const [chain, setChain] = useState("base")
  const [token, setToken] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  const settlementSpender = process.env.NEXT_PUBLIC_SETTLEMENT_SPENDER as `0x${string}` | undefined

  const selectedChainId = CHAIN_IDS[chain]
  const requiresSwitch = isConnected && selectedChainId && chainId !== selectedChainId

  const tokenAddress: `0x${string}` | undefined = useMemo(() => {
    if (chain === "base") return TOKEN_ADDRESSES_BASE[token]
    return undefined // extend for other chains later
  }, [chain, token])

  // Decimals & balance for ERC-20 (USDC on Base)
  const { data: tokenDecimals } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "decimals",
    query: { enabled: !!tokenAddress },
  })

  const { data: tokenBalance } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!tokenAddress && !!address },
  })

  // Current allowance for optional settlement spender
  const { data: allowance } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "allowance",
    args: address && settlementSpender ? [address, settlementSpender] : undefined,
    query: { enabled: !!tokenAddress && !!address && !!settlementSpender },
  })

  const amountUnits = useMemo(() => {
    try {
      if (!amount) return undefined
      if (token === "ETH") return parseUnits(amount, 18)
      if (tokenDecimals !== undefined) return parseUnits(amount, Number(tokenDecimals))
      return undefined
    } catch {
      return undefined
    }
  }, [amount, token, tokenDecimals])

  const hasEnoughBalance = useMemo(() => {
    if (!amountUnits) return false
    if (token === "ETH") return true // native ETH balance check omitted for brevity; could use useBalance
    if (tokenBalance !== undefined) return amountUnits <= tokenBalance
    return false
  }, [amountUnits, token, tokenBalance])

  const canPay = isConnected && Number(amount) > 0 && isAddress(recipient) && !requiresSwitch && (token === "ETH" || (tokenAddress && hasEnoughBalance))

  async function handleSwitchNetwork() {
    if (!selectedChainId) return
    try {
      await switchChain({ chainId: selectedChainId })
    } catch (err) {
      console.error("Network switch failed", err)
      setStatus({ type: "error", message: "Network switch failed. Please try again." })
    }
  }

  async function handlePay() {
    if (!canPay) return
    setStatus({ type: "info", message: "Submitting transaction..." })
    try {
      if (token === "ETH") {
        // Native transfer on selected chain
        await sendTransactionAsync({ to: recipient as `0x${string}`, value: amountUnits })
        setStatus({ type: "success", message: "Payment sent: ETH" })
        return
      }

      if (!tokenAddress || !amountUnits) return

      // Optional: Approve settlement spender first if configured
      if (settlementSpender) {
        const currentAllowance = allowance
        const needsApprove = !currentAllowance || (amountUnits && currentAllowance < amountUnits)
        if (needsApprove) {
          await writeContractAsync({
            abi: ERC20_ABI,
            address: tokenAddress,
            functionName: "approve",
            args: [settlementSpender, amountUnits],
          })
        }
      }

      // Direct transfer to recipient (merchant)
      await writeContractAsync({
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "transfer",
        args: [recipient as `0x${string}`, amountUnits],
      })

      setStatus({ type: "success", message: `Payment sent: ${amount} ${token} on ${chain}` })
    } catch (err) {
      console.error(err)
      setStatus({ type: "error", message: "Payment failed. Check console for details." })
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-12 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">OmniPay Universal Checkout</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Pay with USDC or native ETH across supported chains. Real-time validation, network-aware, and wallet-native.</p>
        </motion.div>

        {/* Status Banner */}
        {status && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : status.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"} mt-4 rounded-lg border p-3`}> 
            {status.message}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 rounded-2xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-black/40 backdrop-blur p-6 shadow-sm">
          {/* Wallet Status */}
          <div className="mb-4 text-sm">
            {isConnected ? (
              <span className="inline-flex items-center gap-2 text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> Connected ({address})</span>
            ) : (
              <span className="inline-flex items-center gap-2 text-red-700"><span className="h-2 w-2 rounded-full bg-red-500" /> Not connected — go back and use "Connect Wallet"</span>
            )}
          </div>

          {/* Chain & Token selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium">Chain</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["base", "ethereum", "polygon", "arbitrum"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChain(c)}
                    className={`px-3 py-2 rounded-full border text-sm ${chain === c ? "bg-foreground text-background border-foreground" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Token</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["USDC", "ETH", "WETH"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setToken(t)}
                    className={`px-3 py-2 rounded-full border text-sm ${token === t ? "bg-foreground text-background border-foreground" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="mt-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Recipient (merchant) address</span>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={`border rounded-lg p-2 bg-background ${recipient ? (isAddress(recipient) ? "border-green-300" : "border-red-300") : ""}`}
              />
              {recipient && !isAddress(recipient) && (
                <span className="text-xs text-red-600">Invalid address format</span>
              )}
            </label>
          </div>

          {/* Amount */}
          <div className="mt-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Amount</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 border rounded-lg p-2 bg-background"
                />
                <span className="text-sm px-2 py-1 rounded-md border">{token}</span>
              </div>
              {token !== "ETH" && tokenAddress && (
                <span className="text-xs text-neutral-500">Balance: {tokenBalance !== undefined && tokenDecimals !== undefined
                  ? (Number(tokenBalance) / 10 ** Number(tokenDecimals)).toLocaleString()
                  : "Loading..."}</span>
              )}
            </label>
          </div>

          {/* Switch network banner */}
          {requiresSwitch && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
              You are connected to the wrong network. Please switch to {chain}.
              <div className="mt-2">
                <button
                  onClick={handleSwitchNetwork}
                  disabled={isSwitching}
                  className="rounded-full border border-transparent transition-colors bg-foreground text-background px-4 py-2"
                >
                  {isSwitching ? "Switching..." : "Switch Network"}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              disabled={!canPay}
              className={`rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${!canPay ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={handlePay}
            >
              {canPay ? "Pay" : "Complete requirements to Pay"}
            </button>
            <Link
              href="/"
              className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>

        <div className="mt-8 text-sm text-neutral-500">
          Next: integrate settlement contract (approve/permit + pull), balances for all supported tokens, and cross-chain flows on Push Chain.
        </div>
      </div>
    </div>
  )
}