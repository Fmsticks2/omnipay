import { motion } from 'framer-motion';
import type { FunctionComponent } from '../../common/types';
import Icon from '../ui/Icon';

const Footer = (): FunctionComponent => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-white"
      style={{ backgroundColor: '#060011' }}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#060011', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Icon icon="mdi:wallet" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold text-white">
                OmniPay
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The next-generation payment platform enabling seamless cross-chain transactions, 
              subscriptions, and settlements with advanced DeFi integration.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon icon="mdi:twitter" size={20} color="white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon icon="mdi:email" size={20} color="white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon icon="mdi:github" size={20} color="white" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:book-open" size={16} />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:api" size={16} />
                  <span>API Reference</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:help-circle" size={16} />
                  <span>Support</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:account-group" size={16} />
                  <span>Community</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:shield-account" size={16} />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:file-document" size={16} />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Icon icon="mdi:cookie" size={16} />
                  <span>Cookie Policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-2">
            <span>© 2024 OmniPay. All rights reserved. Built with</span>
            <Icon icon="mdi:heart" size={16} color="#ef4444" />
            <span>for the decentralized future.</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;