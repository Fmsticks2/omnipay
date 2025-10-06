import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { supportedChains } from './chains';

export const config = getDefaultConfig({
  appName: 'OmniPay',
  projectId: import.meta.env.VITE_PROJECT_ID || '8705083ab8c9e3514f4214364153d89c',
  chains: supportedChains,
  ssr: false,
});