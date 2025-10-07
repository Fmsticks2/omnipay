import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { UI_ICONS } from '../components/ui/iconConstants';

const ApiReferencePage = (): FunctionComponent => {
  const [activeEndpoint, setActiveEndpoint] = useState('payments');

  const endpoints = [
    {
      id: 'payments',
      title: 'Payments',
      icon: 'mdi:send',
      description: 'Send and manage payments across chains',
      methods: [
        {
          method: 'POST',
          path: '/api/v1/payments',
          description: 'Create a new payment',
          params: ['recipient', 'amount', 'token', 'chainId'],
          example: `{
  "recipient": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b",
  "amount": "100.50",
  "token": "USDC",
  "chainId": 1,
  "reference": "Invoice #12345"
}`
        },
        {
          method: 'GET',
          path: '/api/v1/payments/{id}',
          description: 'Get payment details',
          params: ['id'],
          example: `{
  "id": "pay_1234567890",
  "status": "completed",
  "amount": "100.50",
  "token": "USDC",
  "txHash": "0x..."
}`
        }
      ]
    },
    {
      id: 'bridge',
      title: 'Bridge',
      icon: 'mdi:bridge',
      description: 'Cross-chain asset bridging operations',
      methods: [
        {
          method: 'POST',
          path: '/api/v1/bridge',
          description: 'Bridge assets between chains',
          params: ['fromChain', 'toChain', 'amount', 'token'],
          example: `{
  "fromChain": 1,
  "toChain": 137,
  "amount": "50.0",
  "token": "USDC",
  "recipient": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b"
}`
        },
        {
          method: 'GET',
          path: '/api/v1/bridge/status/{id}',
          description: 'Get bridge transaction status',
          params: ['id'],
          example: `{
  "id": "bridge_1234567890",
  "status": "pending",
  "fromChain": 1,
  "toChain": 137,
  "estimatedTime": "5-10 minutes"
}`
        }
      ]
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      icon: 'mdi:refresh',
      description: 'Manage recurring payment subscriptions',
      methods: [
        {
          method: 'POST',
          path: '/api/v1/subscriptions',
          description: 'Create a new subscription',
          params: ['recipient', 'amount', 'interval', 'token'],
          example: `{
  "recipient": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b",
  "amount": "29.99",
  "interval": "monthly",
  "token": "USDC",
  "startDate": "2025-01-01"
}`
        },
        {
          method: 'DELETE',
          path: '/api/v1/subscriptions/{id}',
          description: 'Cancel a subscription',
          params: ['id'],
          example: `{
  "id": "sub_1234567890",
  "status": "cancelled",
  "cancelledAt": "2025-01-15T10:30:00Z"
}`
        }
      ]
    },
    {
      id: 'settlement',
      title: 'Settlement',
      icon: 'mdi:handshake',
      description: 'Multi-party settlement operations',
      methods: [
        {
          method: 'POST',
          path: '/api/v1/settlements',
          description: 'Create a settlement request',
          params: ['parties', 'amounts', 'token'],
          example: `{
  "parties": [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b",
    "0x8ba1f109551bD432803012645Hac136c22C"
  ],
  "amounts": ["100.0", "50.0"],
  "token": "USDC"
}`
        }
      ]
    }
  ];

  const sdks = [
    {
      name: 'JavaScript/TypeScript',
      icon: 'mdi:language-javascript',
      description: 'Official SDK for web and Node.js applications',
      installation: 'npm install @omnipay/sdk',
      example: `import { OmniPay } from '@omnipay/sdk';

const omnipay = new OmniPay({
  apiKey: 'your-api-key',
  network: 'mainnet'
});

// Send a payment
const payment = await omnipay.payments.create({
  recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b',
  amount: '100.50',
  token: 'USDC'
});`
    },
    {
      name: 'Python',
      icon: 'mdi:language-python',
      description: 'Python SDK for backend integrations',
      installation: 'pip install omnipay-python',
      example: `from omnipay import OmniPay

omnipay = OmniPay(
    api_key='your-api-key',
    network='mainnet'
)

# Send a payment
payment = omnipay.payments.create(
    recipient='0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b',
    amount='100.50',
    token='USDC'
)`
    },
    {
      name: 'Go',
      icon: 'mdi:language-go',
      description: 'Go SDK for high-performance applications',
      installation: 'go get github.com/omnipay/go-sdk',
      example: `package main

import (
    "github.com/omnipay/go-sdk"
)

func main() {
    client := omnipay.NewClient("your-api-key", "mainnet")
    
    payment, err := client.Payments.Create(&omnipay.PaymentRequest{
        Recipient: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b",
        Amount:    "100.50",
        Token:     "USDC",
    })
}`
    }
  ];

  const activeEndpointData = endpoints.find(e => e.id === activeEndpoint)!;

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Icon icon={UI_ICONS.api} size={48} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">API Reference</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Complete API documentation for integrating OmniPay into your applications. 
              RESTful APIs, SDKs, and code examples to get you started quickly.
            </p>
          </motion.div>

          {/* API Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                       style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:api" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">RESTful API</h3>
                  <p className="text-gray-400 text-sm">
                    Standard HTTP methods with JSON responses
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                       style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:shield-check" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                  <p className="text-gray-400 text-sm">
                    API key authentication with rate limiting
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                       style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Icon icon="mdi:clock-fast" size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-time</h3>
                  <p className="text-gray-400 text-sm">
                    WebSocket support for live updates
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <Card>
                <h3 className="text-lg font-bold text-white mb-4">Endpoints</h3>
                <nav className="space-y-2">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeEndpoint === endpoint.id
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon icon={endpoint.icon} size={20} />
                      <span className="font-medium">{endpoint.title}</span>
                    </button>
                  ))}
                </nav>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="lg:col-span-3"
            >
              <Card>
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon icon={activeEndpointData.icon} size={32} className="text-white" />
                    <h2 className="text-2xl font-bold text-white">{activeEndpointData.title}</h2>
                  </div>
                  <p className="text-gray-300">{activeEndpointData.description}</p>
                </div>

                <div className="space-y-8">
                  {activeEndpointData.methods.map((method, index) => (
                    <div key={index} className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          method.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                          method.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                          method.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {method.method}
                        </span>
                        <code className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded">
                          {method.path}
                        </code>
                      </div>
                      <p className="text-gray-300 mb-4">{method.description}</p>
                      
                      {method.params && (
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2">Parameters:</h4>
                          <div className="flex flex-wrap gap-2">
                            {method.params.map((param) => (
                              <code key={param} className="text-sm bg-white/10 text-gray-300 px-2 py-1 rounded">
                                {param}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-white font-semibold mb-2">Example:</h4>
                        <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                          <code className="text-gray-300 text-sm font-mono">
                            {method.example}
                          </code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* SDKs Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Official SDKs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {sdks.map((sdk, index) => (
                <motion.div
                  key={sdk.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                           style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <Icon icon={sdk.icon} size={32} color="white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{sdk.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{sdk.description}</p>
                      <code className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded">
                        {sdk.installation}
                      </code>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Example Usage:</h4>
                      <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                        <code className="text-gray-300 text-xs font-mono">
                          {sdk.example}
                        </code>
                      </pre>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16"
          >
            <Card>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Our developer support team is here to help you integrate OmniPay successfully.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="primary">
                    <Icon icon="mdi:help-circle" size={20} className="mr-2" />
                    Contact Support
                  </Button>
                  <Button size="lg" variant="outline">
                    <Icon icon="mdi:account-group" size={20} className="mr-2" />
                    Join Community
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ApiReferencePage;