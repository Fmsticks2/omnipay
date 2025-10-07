import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { UI_ICONS } from '../components/ui/iconConstants';

interface FaucetRequest {
  id: string;
  amount: string;
  timestamp: number;
  txHash: string;
  status: 'pending' | 'success' | 'failed';
}

export default function FaucetPage() {
  const [isRequesting, setIsRequesting] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendTransaction, data: hash, error } = useSendTransaction();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const MIN_REQUEST_AMOUNT = 1;
  const MAX_REQUEST_AMOUNT = 100;

  const [amount, setAmount] = useState('10');
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [requestHistory, setRequestHistory] = useState<FaucetRequest[]>([]);

  // Load request history from localStorage
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`faucet-history-${address}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const history = parsed as FaucetRequest[];
            setRequestHistory(history);
            if (history.length > 0 && history[0]) {
              setLastRequestTime(history[0].timestamp);
            }
          }
        } catch (error) {
          console.error('Failed to parse request history:', error);
        }
      }
    }
  }, [address]);

  // Save request history to localStorage
  useEffect(() => {
    if (address && requestHistory.length > 0) {
      localStorage.setItem(`faucet-history-${address}`, JSON.stringify(requestHistory));
    }
  }, [address, requestHistory]);

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && hash) {
      setRequestHistory(prev => 
        prev.map(req => 
          req.txHash === hash ? { ...req, status: 'success' as const } : req
        )
      );
      setIsRequesting(false);
    }
  }, [isSuccess, hash]);

  // Handle transaction error
  useEffect(() => {
    if (error && hash) {
      setRequestHistory(prev => 
        prev.map(req => 
          req.txHash === hash ? { ...req, status: 'failed' as const } : req
        )
      );
      setIsRequesting(false);
    }
  }, [error, hash]);

  const canRequest = () => {
    if (!lastRequestTime) return true;
    return Date.now() - lastRequestTime > COOLDOWN_PERIOD;
  };

  const getTimeUntilNextRequest = () => {
    if (!lastRequestTime) return 0;
    const timeLeft = COOLDOWN_PERIOD - (Date.now() - lastRequestTime);
    return Math.max(0, timeLeft);
  };

  const formatTimeLeft = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleRequestTokens = async () => {
    if (!isConnected || !address || !canRequest()) return;

    const amountValue = parseFloat(amount);
    if (amountValue < MIN_REQUEST_AMOUNT || amountValue > MAX_REQUEST_AMOUNT) return;

    setIsRequesting(true);

    try {
      // Create a pending request entry
      const newRequest: FaucetRequest = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        timestamp: Date.now(),
        txHash: '', // Will be updated when transaction is sent
        status: 'pending'
      };
      
      // For demonstration purposes, we'll simulate a faucet transaction
      // In a real implementation, this would either:
      // 1. Call a faucet contract that distributes tokens
      // 2. Make an API call to a faucet service
      // 3. Use a pre-funded wallet to send tokens
      
      // Simulate the faucet sending tokens to the user
      sendTransaction({
        to: address,
        value: parseEther(amount),
      });

      // Update the request with a placeholder hash (will be updated when transaction is confirmed)
      newRequest.txHash = `pending-${Date.now()}`;
      
      setRequestHistory(prev => [newRequest, ...prev]);
      setLastRequestTime(Date.now());
      
      // Reset form
      setAmount('10');
      
    } catch (error) {
      console.error('Faucet request failed:', error);
      setIsRequesting(false);
    }
  };

  const timeLeft = getTimeUntilNextRequest();

  return (
    <Layout>
      <div className="min-h-screen py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center" 
                 style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Icon icon="mdi:water" size={40} color="#00D4FF" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Push Testnet Faucet
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get free Push testnet tokens to start using OmniPay. Perfect for testing and development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Tokens Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Icon icon="mdi:coins" size={24} color="#00D4FF" className="mr-3" />
                    <h2 className="text-2xl font-bold text-white">Request Tokens</h2>
                  </div>

                  {!isConnected ? (
                    <div className="text-center py-8">
                      <Icon icon={UI_ICONS.wallet} size={48} color="#666" className="mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Connect your wallet to request testnet tokens</p>
                      <Button variant="primary">
                        <Icon icon={UI_ICONS.wallet} size={20} className="mr-2" />
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Current Balance */}
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Current Balance</span>
                          <span className="text-white font-mono">
                            {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                          </span>
                        </div>
                      </div>

                      {/* Request Amount */}
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Request Amount (PC Tokens)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={MIN_REQUEST_AMOUNT}
                            max={MAX_REQUEST_AMOUNT}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter amount"
                            disabled={!canRequest() || isRequesting}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span className="text-gray-400 text-sm">PC</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          Min: {MIN_REQUEST_AMOUNT} PC • Max: {MAX_REQUEST_AMOUNT} PC per request
                        </p>
                      </div>

                      {/* Cooldown Warning */}
                      {!canRequest() && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                          <div className="flex items-center">
                            <Icon icon="mdi:clock-outline" size={20} color="#FCD34D" className="mr-2" />
                            <span className="text-yellow-300 text-sm">
                              Next request available in {formatTimeLeft(timeLeft)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Request Button */}
                      <Button
                        onClick={handleRequestTokens}
                        disabled={!canRequest() || isRequesting || parseFloat(amount) < MIN_REQUEST_AMOUNT || parseFloat(amount) > MAX_REQUEST_AMOUNT}
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        {isRequesting ? (
                          <>
                            <Icon icon="mdi:loading" size={20} className="mr-2 animate-spin" />
                            Requesting Tokens...
                          </>
                        ) : !canRequest() ? (
                          <>
                            <Icon icon="mdi:clock-outline" size={20} className="mr-2" />
                            Cooldown Active
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:water" size={20} className="mr-2" />
                            Request {amount} PC Tokens
                          </>
                        )}
                      </Button>

                      {/* Faucet Rules */}
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h3 className="text-blue-300 font-medium mb-2">Faucet Rules</h3>
                        <ul className="text-blue-200 text-sm space-y-1">
                          <li>• One request per wallet every 24 hours</li>
                          <li>• Maximum {MAX_REQUEST_AMOUNT} PC tokens per request</li>
                          <li>• Tokens are for testnet use only</li>
                          <li>• No real value - for testing purposes</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Request History Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Icon icon="mdi:history" size={24} color="#00D4FF" className="mr-3" />
                    <h2 className="text-2xl font-bold text-white">Request History</h2>
                  </div>

                  {requestHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon icon="mdi:history" size={48} color="#666" className="mx-auto mb-4" />
                      <p className="text-gray-400">No requests yet</p>
                      <p className="text-gray-500 text-sm">Your faucet requests will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {requestHistory.map((request, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">
                              +{request.amount} PC
                            </span>
                            <span className={`text-sm ${
                              request.status === 'success' ? 'text-green-400' :
                              request.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {request.status === 'success' ? 'Completed' :
                               request.status === 'pending' ? 'Pending' :
                               'Failed'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              {new Date(request.timestamp).toLocaleString()}
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(request.txHash)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Icon icon="mdi:content-copy" size={16} />
                            </button>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-500 text-xs font-mono">
                              {request.txHash.slice(0, 10)}...{request.txHash.slice(-8)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:flash" size={32} color="#00D4FF" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Instant Delivery</h3>
                    <p className="text-gray-400 text-sm">
                      Receive testnet tokens instantly to your wallet
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:shield-check" size={32} color="#00D4FF" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Rate Limited</h3>
                    <p className="text-gray-400 text-sm">
                      Fair distribution with 24-hour cooldown periods
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Icon icon="mdi:test-tube" size={32} color="#00D4FF" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Testing Ready</h3>
                    <p className="text-gray-400 text-sm">
                      Perfect for testing OmniPay features and development
                    </p>
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