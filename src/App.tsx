import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import { PageLoader } from './components/ui/LoadingSpinner';
import { 
  LazyDashboardPage, 
  LazyPaymentsPage, 
  LazySubscriptionsPage, 
  LazySettlementPage, 
  LazyBridgePage 
} from './lib/performance';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-background text-foreground ${theme}`}>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<LazyDashboardPage />} />
            <Route path="/payments" element={<LazyPaymentsPage />} />
            <Route path="/subscriptions" element={<LazySubscriptionsPage />} />
            <Route path="/settlement" element={<LazySettlementPage />} />
            <Route path="/bridge" element={<LazyBridgePage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;