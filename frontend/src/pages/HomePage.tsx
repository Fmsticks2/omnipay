import { motion } from 'framer-motion';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Hero from '../components/ui/Hero';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { UI_ICONS } from '../components/ui/iconConstants';

const HomePage = (): FunctionComponent => {
  return (
    <Layout>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Why Choose OmniPay?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Built for the future of decentralized finance with cutting-edge technology and user-centric design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:shield-check" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Secure & Trustless</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Built on battle-tested smart contracts with multi-signature security and decentralized validation.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <Icon icon="mdi:flash" size={32} color="white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Sub-second transaction confirmations with optimized routing and parallel processing.
                </p>
              </div>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:link-variant" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Multi-Chain</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Seamlessly bridge assets across 15+ blockchains with unified liquidity pools.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'rgba(6, 0, 17, 0.2)' }}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          >
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                $50M+
              </h3>
              <p className="text-gray-400 text-base">Total Volume Processed</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                100K+
              </h3>
              <p className="text-gray-400 text-base">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                15+
              </h3>
              <p className="text-gray-400 text-base">Supported Networks</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                99.9%
              </h3>
              <p className="text-gray-400 text-base">Uptime</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust OmniPay for their cross-chain payment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary">
                <Icon icon={UI_ICONS.wallet} size={20} className="mr-2" />
                Connect Wallet
              </Button>
              <Button size="lg" variant="outline">
                <Icon icon={UI_ICONS.document} size={20} className="mr-2" />
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;