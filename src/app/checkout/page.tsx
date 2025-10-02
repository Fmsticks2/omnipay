"use client"

import Link from "next/link"
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useSendTransaction } from "wagmi"
import { useState, useMemo } from "react"
import { parseUnits, isAddress } from "viem"
import { ERC20_ABI } from "../../lib/erc20"

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
    }
  }

  async function handlePay() {
    if (!canPay) return
    try {
      if (token === "ETH") {
        // Native transfer on selected chain
        await sendTransactionAsync({ to: recipient as `0x${string}`, value: amountUnits })
        alert("Payment sent: ETH")
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

      alert(`Payment sent: ${amount} ${token} on ${chain}`)
    } catch (err) {
      console.error(err)
      alert("Payment failed. Check console for details.")
    }
  }

  return (
    <div className="min-h-screen p-8 sm:p-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Universal Checkout</h1>
        <p className="mt-2 text-neutral-600">Choose chain, token, amount, and recipient to pay.</p>

        <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] p-6">
          <div className="mb-4 text-sm text-neutral-500">
            Wallet Status: {isConnected ? (
              <span className="text-green-600">Connected ({address})</span>
            ) : (
              <span className="text-red-600">Not connected — go back and use "Connect Wallet"</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm">Chain</span>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="border rounded-lg p-2 bg-background"
              >
                <option value="base">Base</option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm">Token</span>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="border rounded-lg p-2 bg-background"
              >
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="WETH">WETH</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm">Recipient (merchant) address</span>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="border rounded-lg p-2 bg-background"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm">Amount</span>
              <input
                type="number"
                min="0"
                step="0.0001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded-lg p-2 bg-background"
              />
            </label>
          </div>

          {requiresSwitch && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 text-yellow-800">
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

          {token !== "ETH" && tokenAddress && (
            <div className="mt-4 text-sm text-neutral-500">
              Balance: {tokenBalance !== undefined && tokenDecimals !== undefined
                ? (Number(tokenBalance) / 10 ** Number(tokenDecimals)).toLocaleString()
                : "Loading..."}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              disabled={!canPay}
              className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
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
        </div>

        <div className="mt-8 text-sm text-neutral-500">
          Next: integrate settlement contract (approve/permit + pull), balances for all supported tokens, and cross-chain flows on Push Chain.
        </div>
      </div>
    </div>
  )
}