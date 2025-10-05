/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string
  readonly VITE_PUSHCHAIN_RPC_URL: string
  readonly VITE_PUSHCHAIN_CHAIN_ID: string
  readonly VITE_PUSHCHAIN_EXPLORER_URL: string
  readonly VITE_PUSHCHAIN_NAME: string
  readonly VITE_PUSHCHAIN_SYMBOL: string
  readonly VITE_OMNIPAY_NOTIFIER: string
  readonly VITE_OMNIPAY_CORE: string
  readonly VITE_OMNIPAY_SUBSCRIPTION: string
  readonly VITE_OMNIPAY_BRIDGE: string
  readonly VITE_OMNIPAY_SETTLEMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}