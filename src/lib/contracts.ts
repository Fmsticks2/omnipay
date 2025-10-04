/**
 * OmniPay Contract Addresses
 * Network: Push Donut Testnet (Chain ID: 42101)
 */

export const OMNIPAY_ADDRESSES = {
  // Push Donut Testnet
  PUSH_DONUT: {
    NOTIFIER: '0xdc6c396319895dA489b0Cd145A4c5D660b9e10F6',
    CORE: '0xB6EE67F0c15f949433d0e484F60f70f1828458e3',
    SUBSCRIPTION: '0x72CA2541A705468368F9474fB419Defd002EC8af',
    BRIDGE_STUB: '0xF565086417Bf8ba76e4FaFC9F0088818eA027539',
  },
  // Add other networks as they are deployed
}

// Chain ID to network name mapping
export const CHAIN_ID_TO_NETWORK: Record<number, keyof typeof OMNIPAY_ADDRESSES> = {
  42101: 'PUSH_DONUT',
  // Add other chain IDs as needed
}

/**
 * Get contract addresses for a specific chain ID
 * @param chainId The chain ID to get addresses for
 * @returns Contract addresses for the specified chain or undefined if not supported
 */
export function getContractAddresses(chainId: number) {
  const network = CHAIN_ID_TO_NETWORK[chainId]
  return network ? OMNIPAY_ADDRESSES[network] : undefined
}