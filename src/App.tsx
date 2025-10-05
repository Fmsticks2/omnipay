import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Banknote, Home, BarChart3, FileText, HelpCircle, Settings } from 'lucide-react';
import { Providers } from './components/Providers';
import ThemeToggle from './components/ThemeToggle';
import ParticleBackground from './components/ParticleBackground';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { fadeInUp, scaleOnHover, cn } from './lib/utils';
import './index.css';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Documentation', path: '/docs', icon: FileText },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const productItems = [
    { name: 'Payment Gateway', description: 'Accept crypto payments globally', href: '#' },
    { name: 'Crypto Wallet', description: 'Secure digital asset storage', href: '#' },
    { name: 'API Integration', description: 'Developer-friendly APIs', href: '#' },
    { name: 'Analytics Dashboard', description: 'Real-time transaction insights', href: '#' },
  ];
  
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              {...scaleOnHover}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                OmniPay
              </span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                    isActive 
                      ? "text-white bg-purple-600/20 border border-purple-500/30" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
              >
                Products
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isProductsOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/20 p-2"
                  >
                    {productItems.map((product) => (
                      <a
                        key={product.name}
                        href={product.href}
                        className="block p-4 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 group"
                      >
                        <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {product.description}
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <w3m-button />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pt-4 border-t border-slate-800/50"
            >
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "text-white bg-purple-600/20 border border-purple-500/30" 
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
                
                <div className="pt-4 border-t border-slate-800/50 flex items-center gap-3">
                  <ThemeToggle />
                  <w3m-button />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
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