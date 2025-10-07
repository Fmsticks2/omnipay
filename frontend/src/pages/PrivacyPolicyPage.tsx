import { motion } from 'framer-motion';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import { UI_ICONS } from '../components/ui/iconConstants';

const PrivacyPolicyPage = (): FunctionComponent => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: 'mdi:information',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and other contact information.'
        },
        {
          subtitle: 'Wallet Information',
          text: 'When you connect your cryptocurrency wallet to our platform, we collect your wallet address and transaction history necessary to provide our services. We do not store your private keys or seed phrases.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you use our platform, including your IP address, browser type, device information, and interaction patterns with our services.'
        },
        {
          subtitle: 'Transaction Data',
          text: 'We collect information about your transactions processed through our platform, including transaction amounts, timestamps, and blockchain network details.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: 'mdi:cog',
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our cross-chain payment services, including processing transactions and managing your account.'
        },
        {
          subtitle: 'Security and Fraud Prevention',
          text: 'We use your information to detect, prevent, and respond to fraud, security incidents, and other harmful activities that could affect you or other users.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to send you service-related notifications, updates about our platform, and respond to your inquiries.'
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage patterns to understand how our services are used and to improve our platform\'s functionality and user experience.'
        }
      ]
    },
    {
      title: 'Information Sharing',
      icon: 'mdi:share-variant',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who help us operate our platform, such as cloud hosting providers and analytics services.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, regulation, or legal process, or if we believe disclosure is necessary to protect our rights or the safety of others.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to appropriate confidentiality protections.'
        },
        {
          subtitle: 'Blockchain Networks',
          text: 'Transaction data is recorded on public blockchain networks and becomes publicly accessible. This is inherent to blockchain technology and cannot be controlled by us.'
        }
      ]
    },
    {
      title: 'Data Security',
      icon: 'mdi:shield-check',
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures to protect your information, including encryption, secure data transmission, and access controls.'
        },
        {
          subtitle: 'Data Minimization',
          text: 'We collect and retain only the information necessary to provide our services and comply with legal obligations.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We regularly review and update our security practices and conduct security audits to ensure the protection of your information.'
        }
      ]
    },
    {
      title: 'Your Rights',
      icon: 'mdi:account-check',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access and correct your personal information. You can update most information through your account settings.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You have the right to request a copy of your personal information in a structured, machine-readable format.'
        },
        {
          subtitle: 'Deletion',
          text: 'You may request deletion of your personal information, subject to legal and operational requirements. Note that blockchain transactions cannot be deleted.'
        },
        {
          subtitle: 'Opt-out',
          text: 'You can opt out of non-essential communications and certain data processing activities through your account settings or by contacting us.'
        }
      ]
    },
    {
      title: 'Cookies and Tracking',
      icon: 'mdi:cookie',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies that are necessary for our platform to function properly, including authentication and security features.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics cookies to understand how users interact with our platform and to improve our services. You can disable these through your browser settings.'
        },
        {
          subtitle: 'Third-party Services',
          text: 'Our platform may include third-party services that use their own cookies and tracking technologies, subject to their respective privacy policies.'
        }
      ]
    }
  ];

  const lastUpdated = 'January 15, 2025';

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Icon icon={UI_ICONS.privacy} size={48} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Your privacy is important to us. This Privacy Policy explains how OmniPay collects, 
              uses, and protects your information when you use our cross-chain payment platform.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Privacy</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  At OmniPay, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This policy outlines our practices regarding the collection, use, and protection of your data when you use our 
                  decentralized payment platform.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:shield-check" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Data Protection</h3>
                    <p className="text-gray-400 text-sm">
                      Industry-standard encryption and security measures
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:eye-off" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Privacy by Design</h3>
                    <p className="text-gray-400 text-sm">
                      Minimal data collection and user-controlled privacy
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:gavel" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Compliance</h3>
                    <p className="text-gray-400 text-sm">
                      GDPR, CCPA, and other privacy regulation compliance
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon={section.icon} size={24} color="white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-2 border-white/20 pl-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.subtitle}</h3>
                        <p className="text-gray-300 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Questions About This Policy?</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please don't hesitate to contact us. We're here to help and ensure your privacy concerns are addressed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:email" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Send us your privacy-related questions
                    </p>
                    <p className="text-white font-medium">privacy@omnipay.com</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:help-circle" size={32} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Support Center</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Visit our support center for more help
                    </p>
                    <p className="text-white font-medium">support.omnipay.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Policy Updates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-8"
          >
            <Card>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <Icon icon="mdi:update" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Policy Updates</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                    We will notify you of any material changes by posting the updated policy on our website and updating the 
                    "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;