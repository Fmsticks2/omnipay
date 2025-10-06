import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import App from './App';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { config } from './lib/wagmi';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { trackWebVitals } from './lib/performance';

import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <RainbowKitProvider
      theme={theme === 'dark' ? darkTheme() : lightTheme()}
      showRecentTransactions={true}
    >
      {children}
    </RainbowKitProvider>
  );
}

// Track web vitals in production
if (process.env.NODE_ENV === 'production') {
  trackWebVitals();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RainbowKitWrapper>
              <BrowserRouter>
                <App />
                <Toaster 
                  position="top-right"
                  expand={false}
                  richColors
                  closeButton
                />
              </BrowserRouter>
            </RainbowKitWrapper>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
