import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Providers } from './components/Providers';
import ThemeToggle from './components/ThemeToggle';
import ParticleBackground from './components/ParticleBackground';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { fadeInUp, scaleOnHover, cn } from './lib/utils';
import './index.css';

function Navigation() {
  const location = useLocation()
  
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div 
              {...scaleOnHover}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                OmniPay
              </span>
            </motion.div>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-purple-300 ${
                  location.pathname === '/' ? 'text-white' : 'text-gray-400'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-purple-300 ${
                  location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'
                }`}
              >
                Dashboard
              </Link>
              <a 
                href="#" 
                className="text-sm font-medium text-gray-400 hover:text-purple-300 transition-colors"
              >
                Docs
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-gray-400 hover:text-purple-300 transition-colors"
              >
                Support
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <w3m-button />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pt-20"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Providers>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
          <ParticleBackground />
          <Navigation />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </PageTransition>
        </div>
      </Router>
    </Providers>
  )
}

export default App