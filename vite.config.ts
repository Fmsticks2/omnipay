import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'web3-vendor': ['wagmi', '@rainbow-me/rainbowkit', 'viem'],
          // Feature chunks
          'dashboard': ['./src/pages/DashboardPage.tsx'],
          'payments': ['./src/pages/PaymentsPage.tsx'],
          'subscriptions': ['./src/pages/SubscriptionsPage.tsx'],
          'settlement': ['./src/pages/SettlementPage.tsx'],
          'bridge': ['./src/pages/BridgePage.tsx'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
  },
  // Development server optimization
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false,
    },
  },
  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'wagmi',
      '@rainbow-me/rainbowkit',
      'viem',
    ],
  },
})