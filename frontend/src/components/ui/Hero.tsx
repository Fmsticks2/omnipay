import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import type { FunctionComponent } from '../../common/types';
import Icon from './Icon';
import Button from './Button';
import { UI_ICONS } from './iconConstants';

const Hero = (): FunctionComponent => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(6, 0, 17, 0.2)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#9C92AC" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`
          }}></div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div
        className="absolute top-20 left-10 w-20 h-20 rounded-full blur-xl"
        style={{ backgroundColor: 'rgba(6, 0, 17, 0.4)' }}
      />
      <div
        className="absolute top-40 right-20 w-16 h-16 rounded-full blur-xl"
        style={{ backgroundColor: 'rgba(6, 0, 17, 0.3)' }}
      />
      <div
        className="absolute bottom-20 left-20 w-24 h-24 rounded-full blur-xl"
        style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)' }}
      />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full blur-xl"
        style={{ backgroundColor: 'rgba(6, 0, 17, 0.4)' }}
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
            <span className="text-white">
              Cross-Chain Payments
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
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
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-white font-semibold shadow-lg transition-all duration-300 flex items-center"
                >
                  Start Paying
                  <Icon icon="mdi:arrow-right" size={20} />
                </Button>
              </motion.div>
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
          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Icon icon="mdi:shield-check" size={24} color="white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 text-center">Secure</h3>
            <p className="text-gray-400 text-sm text-center">Battle-tested smart contracts</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Icon icon="mdi:flash" size={24} color="white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 text-center">Fast</h3>
            <p className="text-gray-400 text-sm text-center">Sub-second confirmations</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Icon icon="mdi:link-variant" size={24} color="white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 text-center">Multi-Chain</h3>
            <p className="text-gray-400 text-sm text-center">15+ supported networks</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;