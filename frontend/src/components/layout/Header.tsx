import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from '@tanstack/react-router';
import type { FunctionComponent } from '../../common/types';
import Icon from '../ui/Icon';
import { UI_ICONS } from '../ui/iconConstants';

const Header = (): FunctionComponent => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-blue-900 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:wallet" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold text-white">
                OmniPay
              </span>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon icon={UI_ICONS.home} size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/payments"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon icon={UI_ICONS.payments} size={18} />
              <span>Payments</span>
            </Link>
            <Link
              to="/subscriptions"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon icon={UI_ICONS.subscriptions} size={18} />
              <span>Subscriptions</span>
            </Link>
            <Link
              to="/bridge"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon icon={UI_ICONS.crossChain} size={18} />
              <span>Bridge</span>
            </Link>
            <Link
              to="/settlement"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon icon={UI_ICONS.settlement} size={18} />
              <span>Settlement</span>
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;