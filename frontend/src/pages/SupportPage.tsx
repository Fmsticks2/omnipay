import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import type { FunctionComponent } from '../common/types';
import { UI_ICONS } from '../components/ui/iconConstants';

const SupportPage = (): FunctionComponent => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });

  const supportCategories = [
    {
      id: 'general',
      title: 'General Support',
      icon: 'mdi:help-circle',
      description: 'General questions and account issues'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'mdi:cog',
      description: 'API integration and technical issues'
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: 'mdi:credit-card',
      description: 'Payment issues and billing questions'
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'mdi:shield-alert',
      description: 'Security concerns and incident reports'
    }
  ];

  const faqData = {
    general: [
      {
        question: 'How do I get started with OmniPay?',
        answer: 'Simply connect your wallet, choose your preferred network, and start making payments. Our getting started guide will walk you through the process step by step.'
      },
      {
        question: 'Which wallets are supported?',
        answer: 'OmniPay supports all major wallets including MetaMask, WalletConnect, Coinbase Wallet, and more through our RainbowKit integration.'
      },
      {
        question: 'What are the fees for using OmniPay?',
        answer: 'OmniPay charges a small service fee (typically 0.1-0.5%) plus network gas fees. Bridge transactions may have additional fees depending on the destination chain.'
      },
      {
        question: 'Is my money safe with OmniPay?',
        answer: 'Yes, OmniPay uses battle-tested smart contracts that have been audited by leading security firms. Your funds are always under your control.'
      }
    ],
    technical: [
      {
        question: 'How do I integrate OmniPay API?',
        answer: 'Check our API Reference documentation for detailed integration guides, SDKs, and code examples for popular programming languages.'
      },
      {
        question: 'What are the rate limits for the API?',
        answer: 'Free tier allows 1,000 requests per hour. Paid plans offer higher limits. Rate limit headers are included in all API responses.'
      },
      {
        question: 'How do I handle webhook events?',
        answer: 'Webhooks are sent as POST requests to your configured endpoint. Always verify the signature using your webhook secret for security.'
      },
      {
        question: 'What happens if a transaction fails?',
        answer: 'Failed transactions are automatically retried up to 3 times. You can check transaction status via API or webhook notifications.'
      }
    ],
    billing: [
      {
        question: 'How is billing calculated?',
        answer: 'Billing is based on transaction volume and API usage. You only pay for successful transactions with transparent, upfront pricing.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Service fees are generally non-refundable, but we handle disputes on a case-by-case basis. Contact support for specific situations.'
      },
      {
        question: 'How do I update my payment method?',
        answer: 'You can update your payment method in the billing section of your dashboard or contact support for assistance.'
      }
    ],
    security: [
      {
        question: 'How do you protect user funds?',
        answer: 'We use multi-signature wallets, smart contract audits, and follow industry best practices for security. Funds are never held in centralized accounts.'
      },
      {
        question: 'What should I do if I suspect unauthorized access?',
        answer: 'Immediately contact our security team, change your passwords, and revoke any suspicious API keys. We provide 24/7 security support.'
      },
      {
        question: 'Are smart contracts audited?',
        answer: 'Yes, all our smart contracts are audited by reputable security firms. Audit reports are publicly available on our documentation.'
      }
    ]
  };

  const supportChannels = [
    {
      title: 'Live Chat',
      icon: 'mdi:chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      icon: 'mdi:email',
      description: 'Send us a detailed message',
      availability: 'Response within 24h',
      action: 'Send Email'
    },
    {
      title: 'Community Forum',
      icon: 'mdi:forum',
      description: 'Connect with other users and developers',
      availability: 'Always active',
      action: 'Join Forum'
    },
    {
      title: 'Video Call',
      icon: 'mdi:video',
      description: 'Schedule a call with our experts',
      availability: 'Business hours',
      action: 'Schedule Call'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form or show success message
  };

  const activeFaqs = faqData[activeCategory as keyof typeof faqData] || faqData.general;

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
              <Icon icon={UI_ICONS.support} size={48} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Support Center</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're here to help you succeed with OmniPay. Find answers to common questions, 
              get technical support, or reach out to our team directly.
            </p>
          </motion.div>

          {/* Support Channels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How Can We Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card hover={true}>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                           style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <Icon icon={channel.icon} size={32} color="white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{channel.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                        {channel.description}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">{channel.availability}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        {channel.action}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Support</h2>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={contactForm.category}
                        onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                      >
                        {supportCategories.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-gray-800">
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                      >
                        <option value="low" className="bg-gray-800">Low</option>
                        <option value="medium" className="bg-gray-800">Medium</option>
                        <option value="high" className="bg-gray-800">High</option>
                        <option value="urgent" className="bg-gray-800">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 resize-none"
                      placeholder="Please provide as much detail as possible..."
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" variant="primary" className="w-full">
                    <Icon icon="mdi:send" size={20} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {supportCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {activeFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="border-b border-white/10 pb-4 last:border-b-0"
                    >
                      <h4 className="text-white font-semibold mb-2 flex items-start">
                        <Icon icon="mdi:help-circle" size={16} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed ml-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Additional Resources</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Explore our comprehensive resources to get the most out of OmniPay.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:book-open" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Complete guides and tutorials
                    </p>
                    <Button size="sm" variant="outline">
                      View Docs
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:api" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">API Reference</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Technical documentation for developers
                    </p>
                    <Button size="sm" variant="outline">
                      API Docs
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:account-group" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Community</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Connect with other users and developers
                    </p>
                    <Button size="sm" variant="outline">
                      Join Community
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;