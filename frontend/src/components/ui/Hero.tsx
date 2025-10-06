import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import type { FunctionComponent } from '../../common/types';
import Icon from './Icon';
import { UI_ICONS } from './iconConstants';

const Hero = (): FunctionComponent => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-blue-900/20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#9C92AC" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`
          }}></div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-xl"
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Future of
            <br />
            <span className="text-blue-400">
              Cross-Chain Payments
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience seamless payments, subscriptions, and settlements across multiple blockchains 
            with OmniPay's advanced DeFi infrastructure.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/payments">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
              >
                <Icon icon={UI_ICONS.payment} size={20} className="mr-2" />
                Start Paying
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center"
            >
              <Icon icon={UI_ICONS.document} size={20} className="mr-2" />
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Icon icon={UI_ICONS.speed} size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Payments</h3>
            <p className="text-gray-400">Send and receive payments instantly across multiple blockchains with minimal fees.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Icon icon={UI_ICONS.subscription} size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Subscriptions</h3>
            <p className="text-gray-400">Automate recurring payments with intelligent subscription management.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Icon icon={UI_ICONS.bridge} size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Cross-Chain Bridge</h3>
            <p className="text-gray-400">Seamlessly bridge assets and payments between different blockchain networks.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;