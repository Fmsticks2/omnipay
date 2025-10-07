import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';

export function CookiePolicyPage() {
  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Learn how OmniPay uses cookies to enhance your experience
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
                  <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and enabling certain functionality.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Cookie Types */}
          <div className="space-y-8">
            {/* Essential Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="shield-check" className="text-green-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Essential Cookies</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        These cookies are necessary for the website to function properly and cannot be disabled:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                        <li><strong>Security:</strong> Protect against cross-site request forgery attacks</li>
                        <li><strong>Session Management:</strong> Maintain your session state during transactions</li>
                        <li><strong>Load Balancing:</strong> Ensure optimal server performance</li>
                      </ul>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
                        <p className="text-green-300 text-sm">
                          <Icon icon="check" className="inline mr-2" size={16} />
                          These cookies are always active and required for basic functionality.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Analytics Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="bar-chart" className="text-purple-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Analytics Cookies</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        These cookies help us understand how visitors interact with our website:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Google Analytics:</strong> Track page views, user behavior, and site performance</li>
                        <li><strong>Hotjar:</strong> Understand user interactions through heatmaps and recordings</li>
                        <li><strong>Custom Analytics:</strong> Monitor transaction success rates and user flows</li>
                        <li><strong>Error Tracking:</strong> Identify and fix technical issues</li>
                      </ul>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-4">
                        <p className="text-purple-300 text-sm">
                          <Icon icon="settings" className="inline mr-2" size={16} />
                          You can opt out of analytics cookies in your browser settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Functional Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="settings" className="text-yellow-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Functional Cookies</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        These cookies enhance your experience by remembering your preferences:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Theme Preferences:</strong> Remember your dark/light mode choice</li>
                        <li><strong>Language Settings:</strong> Store your preferred language</li>
                        <li><strong>Currency Display:</strong> Remember your preferred currency</li>
                        <li><strong>Wallet Connections:</strong> Remember your connected wallet preferences</li>
                        <li><strong>Dashboard Layout:</strong> Save your customized dashboard settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Marketing Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="target" className="text-orange-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Marketing Cookies</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        These cookies are used to deliver relevant advertisements and track campaign effectiveness:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Google Ads:</strong> Show relevant ads based on your interests</li>
                        <li><strong>Facebook Pixel:</strong> Track conversions from social media campaigns</li>
                        <li><strong>Twitter Analytics:</strong> Measure engagement from Twitter campaigns</li>
                        <li><strong>Retargeting:</strong> Show ads to users who have visited our site</li>
                      </ul>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-4">
                        <p className="text-orange-300 text-sm">
                          <Icon icon="x" className="inline mr-2" size={16} />
                          You can opt out of marketing cookies through our cookie preferences or browser settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Third-Party Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="external-link" className="text-cyan-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Third-Party Cookies</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        Some cookies are set by third-party services we use:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Service Providers</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Stripe (Payment processing)</li>
                            <li>• Cloudflare (CDN and security)</li>
                            <li>• Intercom (Customer support)</li>
                          </ul>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Analytics & Marketing</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Google Analytics</li>
                            <li>• Facebook Pixel</li>
                            <li>• Twitter Analytics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Cookie Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="sliders" className="text-indigo-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Managing Your Cookie Preferences</h3>
                    <div className="text-gray-300 space-y-4">
                      <p>You have several options to control cookies:</p>
                      
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Browser Settings</h4>
                          <p className="text-sm">
                            Most browsers allow you to control cookies through their settings. You can block all cookies, 
                            accept only first-party cookies, or delete existing cookies.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Cookie Preferences Center</h4>
                          <p className="text-sm mb-3">
                            Use our cookie preferences center to customize which types of cookies you accept.
                          </p>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center">
                            <Icon icon="settings" className="mr-2" size={16} />
                            Manage Cookie Preferences
                          </Button>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Opt-Out Links</h4>
                          <p className="text-sm">
                            You can opt out of specific tracking services:
                          </p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-400 hover:underline">Google Analytics Opt-out</a></li>
                            <li>• <a href="https://www.facebook.com/help/568137493302217" className="text-blue-400 hover:underline">Facebook Pixel Opt-out</a></li>
                            <li>• <a href="https://optout.aboutads.info/" className="text-blue-400 hover:underline">Digital Advertising Alliance Opt-out</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Cookie Retention */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <Icon icon="clock" className="text-pink-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Cookie Retention Periods</h3>
                    <div className="text-gray-300 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Session Cookies</h4>
                          <p className="text-sm">Deleted when you close your browser</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Persistent Cookies</h4>
                          <p className="text-sm">Stored for up to 2 years or until manually deleted</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Analytics Cookies</h4>
                          <p className="text-sm">Typically expire after 2 years</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Marketing Cookies</h4>
                          <p className="text-sm">Usually expire after 30-90 days</p>
                        </div>
                      </div>
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
                    <h3 className="text-xl font-bold text-white mb-4">Questions About Cookies?</h3>
                    <div className="text-gray-300 space-y-2">
                      <p>
                        If you have any questions about our use of cookies, please contact us:
                      </p>
                      <p>Email: privacy@omnipay.com</p>
                      <p>Subject: Cookie Policy Inquiry</p>
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

export default CookiePolicyPage;