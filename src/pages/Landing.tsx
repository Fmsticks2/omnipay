import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  ArrowRight, Shield, Zap, Globe, Star, TrendingUp, Users, Award, 
  CheckCircle, Play, Sparkles, Layers, Lock, Rocket, BarChart3,
  Wallet, CreditCard, Smartphone, Monitor, Code, Database, 
  ChevronDown, ExternalLink, Github, Twitter, Linkedin,
  Building2, Banknote, Clock, Target, Cpu
} from 'lucide-react';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleOnHover } from '../lib/utils';
import Button from '../components/Button';
import Card from '../components/Card';
import ParticleBackground from '../components/ParticleBackground';

const Landing = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    setIsVisible(true);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Multi-layer security with hardware wallets, smart contract audits, and real-time fraud detection protecting $12B+ in transactions.",
      gradient: "from-emerald-400 via-emerald-500 to-teal-600",
      delay: 0,
      stats: "99.99% Security Rating"
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Sub-second cross-chain settlements with Layer 2 optimization and intelligent routing across 15+ blockchain networks.",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      delay: 0.1,
      stats: "<0.5s Settlement"
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "24/7 uptime across 6 continents with automatic failover, supporting 180+ countries and 50+ fiat currencies.",
      gradient: "from-blue-400 via-blue-500 to-indigo-600",
      delay: 0.2,
      stats: "180+ Countries"
    },
    {
      icon: Layers,
      title: "Universal Compatibility",
      description: "Native support for Ethereum, Polygon, BSC, Solana, Arbitrum, and emerging L1/L2 networks with automatic bridging.",
      gradient: "from-purple-400 via-purple-500 to-pink-600",
      delay: 0.3,
      stats: "15+ Blockchains"
    },
    {
      icon: BarChart3,
      title: "Enterprise Analytics",
      description: "Real-time dashboards, predictive insights, compliance reporting, and advanced treasury management tools.",
      gradient: "from-indigo-400 via-blue-500 to-cyan-600",
      delay: 0.4,
      stats: "Real-time Insights"
    },
    {
      icon: Code,
      title: "Developer Experience",
      description: "RESTful APIs, GraphQL endpoints, WebHooks, and SDKs in 8+ languages with comprehensive documentation.",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      delay: 0.5,
      stats: "5min Integration"
    }
  ];

  const stats = [
    { value: "$12.8B+", label: "Volume Processed", icon: TrendingUp, change: "+127%" },
    { value: "2.4M+", label: "Active Users", icon: Users, change: "+89%" },
    { value: "99.99%", label: "Uptime SLA", icon: Shield, change: "Guaranteed" },
    { value: "180+", label: "Countries", icon: Globe, change: "+15 New" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      company: "TechFlow",
      content: "OmniPay revolutionized our payment infrastructure. We've seen 400% growth in international transactions with zero downtime.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO, DeFi Innovations",
      company: "DeFi Labs",
      content: "The seamless integration and enterprise-grade security made our migration effortless. Best decision we've made.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Founder, CryptoCommerce",
      company: "CryptoCommerce",
      content: "Outstanding support and reliability. OmniPay handles our $50M+ monthly volume flawlessly.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      rating: 5
    }
  ];

  const integrations = [
    { name: "Shopify", logo: "🛍️", category: "E-commerce" },
    { name: "WooCommerce", logo: "🛒", category: "WordPress" },
    { name: "Stripe", logo: "💳", category: "Payments" },
    { name: "PayPal", logo: "💰", category: "Payments" },
    { name: "Magento", logo: "🏪", category: "E-commerce" },
    { name: "BigCommerce", logo: "🏬", category: "E-commerce" },
    { name: "Salesforce", logo: "☁️", category: "CRM" },
    { name: "HubSpot", logo: "🎯", category: "Marketing" }
  ];

  const useCases = [
    {
      icon: Building2,
      title: "Enterprise Solutions",
      description: "Fortune 500 companies trust OmniPay for high-volume, mission-critical payment processing.",
      metrics: ["$1B+ Daily Volume", "99.99% SLA", "24/7 Support"]
    },
    {
      icon: Banknote,
      title: "DeFi Protocols",
      description: "Power your DeFi application with seamless cross-chain liquidity and automated treasury management.",
      metrics: ["15+ Chains", "MEV Protection", "Gas Optimization"]
    },
    {
      icon: Smartphone,
      title: "Mobile Commerce",
      description: "Enable instant crypto payments in mobile apps with our lightweight SDKs and native wallet integration.",
      metrics: ["<100KB SDK", "Offline Support", "Biometric Auth"]
    },
    {
      icon: Globe,
      title: "Global Marketplaces",
      description: "Accept payments from anywhere in the world with automatic compliance and regulatory support.",
      metrics: ["180+ Countries", "Auto Compliance", "Tax Reporting"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 via-blue-500/15 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            damping: 20,
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/15 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            damping: 20,
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-500/10 to-teal-500/15 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
            rotate: [0, 360],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 30, 
            damping: 15,
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Trust Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full px-8 py-4 mb-8"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">Trusted by 2.4M+ businesses globally</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-7xl md:text-9xl font-black mb-8 leading-none"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                Web3 Payments
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Accept crypto payments from <span className="text-purple-400 font-semibold">any blockchain</span>, 
              anywhere in the world. Enterprise-grade infrastructure that scales with your business.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
            >
              <Button 
                size="xl" 
                variant="gradient" 
                icon={Rocket} 
                iconPosition="right"
                glow
                className="min-w-[240px]"
              >
                Start Building Now
              </Button>
              
              <Button 
                variant="secondary" 
                size="xl" 
                icon={Play}
                className="min-w-[200px]"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Enhanced Stats Grid */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
            >
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  variant="premium"
                  padding="lg"
                  className="text-center group relative overflow-hidden"
                  hover
                  glow
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    className="relative z-10"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        <stat.icon className="w-8 h-8 text-purple-400 group-hover:text-white transition-colors duration-300" />
                        <motion.div
                          className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">
                      {stat.label}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium bg-emerald-400/10 rounded-full px-3 py-1">
                      {stat.change}
                    </div>
                  </motion.div>
                  
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ 
                      background: [
                        "linear-gradient(135deg, rgba(168,85,247,0.05) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)",
                        "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(168,85,247,0.05) 50%, transparent 100%)",
                        "linear-gradient(135deg, rgba(168,85,247,0.05) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <motion.div style={{ y: y1 }} className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-8"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-200">Enterprise Features</span>
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-black text-white mb-8"
            >
              Built for <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Scale</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Enterprise-grade infrastructure designed for the next generation of digital commerce
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={feature.delay}
              >
                <Card 
                  variant="premium" 
                  padding="lg" 
                  hover 
                  glow
                  className="h-full group"
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl relative overflow-hidden`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <feature.icon className="w-8 h-8 text-white relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-2xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="text-xs text-purple-400 font-semibold bg-purple-400/10 rounded-full px-3 py-1 inline-block">
                    {feature.stats}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 relative">
        <motion.div style={{ y: y1 }} className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-6 py-3 mb-8"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-200">Use Cases</span>
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-black text-white mb-8"
            >
              Built for <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Every Industry</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto"
            >
              From Fortune 500 enterprises to innovative startups, OmniPay powers the future of digital payments
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index * 0.1}
              >
                <Card 
                  variant="premium" 
                  padding="lg" 
                  hover 
                  glow
                  className="h-full group"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <useCase.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">
                        {useCase.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {useCase.metrics.map((metric, metricIndex) => (
                      <span 
                        key={metricIndex}
                        className="text-xs text-emerald-400 font-medium bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <motion.div style={{ y: y2 }} className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 mb-8"
            >
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-200">Customer Success</span>
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-black text-white mb-8"
            >
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Leaders</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto"
            >
              See how industry leaders are transforming their businesses with OmniPay
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index * 0.1}
              >
                <Card 
                  variant="glass" 
                  padding="lg" 
                  hover
                  className="h-full"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-200 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                      <div className="text-xs text-purple-400 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-black text-white mb-8"
            >
              Seamless <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Integration</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto mb-12"
            >
              Connect with your existing tools and platforms in minutes
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center items-center gap-6 max-w-5xl mx-auto"
            >
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 min-w-[140px]">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{integration.logo}</span>
                    <div className="text-center">
                      <div className="font-semibold text-white text-sm">{integration.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{integration.category}</div>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"
          animate={{ 
            background: [
              "linear-gradient(to bottom, transparent 0%, rgba(168,85,247,0.1) 50%, transparent 100%)",
              "linear-gradient(to bottom, transparent 0%, rgba(59,130,246,0.1) 50%, transparent 100%)",
              "linear-gradient(to bottom, transparent 0%, rgba(168,85,247,0.1) 50%, transparent 100%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-4 mb-12"
            >
              <Rocket className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-200">Ready to Launch?</span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-black text-white mb-8 leading-none"
            >
              Transform Your 
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                Business Today
              </span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-slate-300 mb-16 leading-relaxed font-light max-w-4xl mx-auto"
            >
              Join <span className="text-purple-400 font-semibold">2.4M+ businesses</span> already using OmniPay to accept crypto payments globally. 
              <span className="block mt-2 text-xl text-slate-400">Start your free trial today — no setup fees, no commitments.</span>
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
            >
              <Button 
                size="xl" 
                variant="gradient" 
                icon={ArrowRight} 
                iconPosition="right"
                glow
                className="min-w-[320px] text-lg py-6"
              >
                Start Free Trial
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                icon={Play}
                className="min-w-[240px] text-lg py-6"
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
            >
              <div className="flex items-center justify-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">No setup fees</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              Trusted by Fortune 500 companies and innovative startups worldwide. 
              SOC 2 Type II certified with bank-grade security and 99.99% uptime SLA.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="relative bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">OmniPay</span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6">
                  The future of payments is here. Accept crypto payments globally with enterprise-grade security and lightning-fast processing.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                    <Twitter className="w-5 h-5 text-slate-300" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                    <Github className="w-5 h-5 text-slate-300" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                    <Linkedin className="w-5 h-5 text-slate-300" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Product Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-white font-semibold mb-6">Product</h3>
                <ul className="space-y-4">
                  {['Payment Gateway', 'Crypto Wallet', 'API Documentation', 'Mobile SDK', 'Webhooks', 'Analytics'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Company Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-white font-semibold mb-6">Company</h3>
                <ul className="space-y-4">
                  {['About Us', 'Careers', 'Press Kit', 'Blog', 'Partners', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Support Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-white font-semibold mb-6">Support</h3>
                <ul className="space-y-4">
                  {['Help Center', 'Developer Docs', 'Status Page', 'Security', 'Privacy Policy', 'Terms of Service'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-slate-500">
              <span>© 2024 OmniPay. All rights reserved.</span>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  SOC 2 Certified
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  256-bit SSL
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  99.99% Uptime
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Globe className="w-4 h-4" />
              <span>Available in 180+ countries</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

;

export default Landing