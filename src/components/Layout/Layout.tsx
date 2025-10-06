import React from 'react'
import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { layoutVariants } from '../../lib/animations'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      variants={layoutVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Header />
      
      <main className="flex-1 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
      
      <Footer />
    </motion.div>
  )
}