import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

export function TermsOfServicePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Please read these terms carefully before using OmniPay services
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: December 2024
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <Icon icon="info" className="text-blue-400 mt-1" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    By accessing and using OmniPay ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="globe" className="text-purple-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Service Description</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        OmniPay provides a comprehensive payment infrastructure platform that enables:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Cross-chain cryptocurrency payments and transfers</li>
                        <li>Subscription management and recurring billing</li>
                        <li>Settlement services for merchants and businesses</li>
                        <li>Bridge functionality for asset transfers across blockchains</li>
                        <li>API access for developers and integrations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* User Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="user" className="text-green-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">User Responsibilities</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>By using our services, you agree to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Provide accurate and complete information when creating an account</li>
                        <li>Maintain the security of your account credentials and private keys</li>
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Not use the service for illegal activities or money laundering</li>
                        <li>Not attempt to hack, disrupt, or compromise our systems</li>
                        <li>Report any security vulnerabilities or suspicious activities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Payment Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="credit-card" className="text-yellow-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Payment Terms</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        All transactions processed through OmniPay are subject to the following terms:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Transaction fees are clearly disclosed before confirmation</li>
                        <li>Cryptocurrency transactions are irreversible once confirmed</li>
                        <li>Network fees (gas fees) are separate from our service fees</li>
                        <li>Subscription payments are processed automatically on scheduled dates</li>
                        <li>Refunds are subject to our refund policy and applicable laws</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Prohibited Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="x-circle" className="text-red-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Prohibited Activities</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>You may not use OmniPay for:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Money laundering or terrorist financing</li>
                        <li>Purchasing illegal goods or services</li>
                        <li>Gambling in jurisdictions where prohibited</li>
                        <li>Tax evasion or fraud</li>
                        <li>Violating sanctions or export controls</li>
                        <li>Infringing intellectual property rights</li>
                        <li>Creating multiple accounts to circumvent limits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="shield" className="text-orange-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Limitation of Liability</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        OmniPay provides services "as is" without warranties. We are not liable for:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Network delays or blockchain congestion</li>
                        <li>Third-party service interruptions</li>
                        <li>Market volatility or price fluctuations</li>
                        <li>User errors or lost private keys</li>
                        <li>Regulatory changes affecting service availability</li>
                        <li>Force majeure events beyond our control</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Termination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="log-out" className="text-gray-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Termination</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                      </p>
                      <p>
                        Upon termination, your right to use the service will cease immediately. You may close your account at any time by contacting our support team.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="edit" className="text-cyan-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Changes to Terms</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new terms.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="mail" className="text-blue-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                    <div className="text-gray-300 space-y-2">
                      <p>
                        If you have any questions about these Terms of Service, please contact us:
                      </p>
                      <p>Email: legal@omnipay.com</p>
                      <p>Address: 123 Blockchain Street, Crypto City, CC 12345</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TermsOfServicePage;