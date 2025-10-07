import { motion } from 'framer-motion';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { UI_ICONS } from '../components/ui/iconConstants';

const DocumentationPage = (): FunctionComponent => {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'mdi:rocket-launch',
      description: 'Quick start guide to begin using OmniPay',
      items: [
        'Connect your wallet',
        'Choose your network',
        'Make your first payment',
        'Explore advanced features'
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: 'mdi:send',
      description: 'Learn how to send and receive payments',
      items: [
        'Single payments',
        'Batch payments',
        'Scheduled payments',
        'Payment references'
      ]
    },
    {
      id: 'bridge',
      title: 'Cross-Chain Bridge',
      icon: 'mdi:bridge',
      description: 'Bridge assets across different blockchains',
      items: [
        'Supported networks',
        'Bridge fees',
        'Transaction times',
        'Security measures'
      ]
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      icon: 'mdi:refresh',
      description: 'Set up recurring payments and subscriptions',
      items: [
        'Create subscriptions',
        'Manage recurring payments',
        'Cancel subscriptions',
        'Subscription analytics'
      ]
    },
    {
      id: 'settlement',
      title: 'Settlement',
      icon: 'mdi:handshake',
      description: 'Understand settlement processes',
      items: [
        'Settlement mechanisms',
        'Dispute resolution',
        'Multi-party settlements',
        'Settlement history'
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'mdi:shield-check',
      description: 'Security best practices and features',
      items: [
        'Smart contract audits',
        'Multi-signature wallets',
        'Transaction verification',
        'Risk management'
      ]
    }
  ];

  const quickLinks = [
    { title: 'API Reference', href: '/api-reference', icon: 'mdi:api' },
    { title: 'Support Center', href: '/support', icon: 'mdi:help-circle' },
    { title: 'Community', href: '/community', icon: 'mdi:account-group' },
    { title: 'GitHub', href: 'https://github.com/omnipay', icon: 'mdi:github', external: true }
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Icon icon={UI_ICONS.document} size={48} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Documentation</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about using OmniPay's cross-chain payment platform. 
              From basic setup to advanced features, we've got you covered.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card hover={true}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors"
                    >
                      <Icon icon={link.icon} size={24} />
                      <span className="font-semibold">{link.title}</span>
                      {link.external && <Icon icon="mdi:open-in-new" size={16} />}
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Documentation Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Documentation Sections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card hover={true}>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                           style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <Icon icon={section.icon} size={32} color="white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{section.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {section.description}
                      </p>
                      <ul className="text-left space-y-2 mb-6">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center space-x-2 text-gray-300 text-sm">
                            <Icon icon="mdi:check-circle" size={16} className="text-green-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button size="sm" variant="outline" className="w-full">
                        <Icon icon="mdi:book-open" size={16} className="mr-2" />
                        Read More
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <Card>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Can't find what you're looking for? Check out our comprehensive FAQ section or reach out to our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="primary">
                    <Icon icon="mdi:frequently-asked-questions" size={20} className="mr-2" />
                    View FAQ
                  </Button>
                  <Button size="lg" variant="outline">
                    <Icon icon="mdi:help-circle" size={20} className="mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Developer Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                       style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:code-braces" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Developer Tools</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    SDKs, APIs, and tools to integrate OmniPay into your applications.
                  </p>
                  <Button size="md" variant="outline" className="w-full">
                    <Icon icon="mdi:tools" size={16} className="mr-2" />
                    Explore Tools
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                       style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:school" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Tutorials</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Step-by-step guides and video tutorials to master OmniPay.
                  </p>
                  <Button size="md" variant="outline" className="w-full">
                    <Icon icon="mdi:play-circle" size={16} className="mr-2" />
                    Watch Tutorials
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentationPage;