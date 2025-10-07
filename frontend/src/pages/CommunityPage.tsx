import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FunctionComponent } from '../common/types';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { UI_ICONS } from '../components/ui/iconConstants';

const CommunityPage = (): FunctionComponent => {
  const [activeTab, setActiveTab] = useState('overview');

  const communityChannels = [
    {
      name: 'Discord',
      icon: 'mdi:discord',
      description: 'Join our Discord server for real-time discussions, support, and community events.',
      members: '12,500+',
      activity: 'Very Active',
      link: '#',
      color: '#5865F2'
    },
    {
      name: 'Telegram',
      icon: 'mdi:telegram',
      description: 'Get updates and participate in discussions in our Telegram community.',
      members: '8,200+',
      activity: 'Active',
      link: '#',
      color: '#0088CC'
    },
    {
      name: 'Twitter',
      icon: 'mdi:twitter',
      description: 'Follow us for the latest news, updates, and community highlights.',
      members: '25,000+',
      activity: 'Daily Updates',
      link: '#',
      color: '#1DA1F2'
    },
    {
      name: 'GitHub',
      icon: 'mdi:github',
      description: 'Contribute to our open-source projects and report issues.',
      members: '1,800+',
      activity: 'Active Development',
      link: '#',
      color: '#333'
    },
    {
      name: 'Reddit',
      icon: 'mdi:reddit',
      description: 'Join discussions and share your experiences with the community.',
      members: '5,600+',
      activity: 'Weekly Posts',
      link: '#',
      color: '#FF4500'
    },
    {
      name: 'YouTube',
      icon: 'mdi:youtube',
      description: 'Watch tutorials, demos, and community-generated content.',
      members: '3,200+',
      activity: 'Weekly Videos',
      link: '#',
      color: '#FF0000'
    }
  ];

  const upcomingEvents = [
    {
      title: 'OmniPay Developer Workshop',
      date: '2024-02-15',
      time: '2:00 PM UTC',
      type: 'Workshop',
      description: 'Learn how to integrate OmniPay APIs into your applications with hands-on examples.',
      attendees: 150,
      platform: 'Discord Voice'
    },
    {
      title: 'Community AMA Session',
      date: '2024-02-22',
      time: '6:00 PM UTC',
      type: 'AMA',
      description: 'Ask the OmniPay team anything about our roadmap, features, and future plans.',
      attendees: 300,
      platform: 'Twitter Spaces'
    },
    {
      title: 'Cross-Chain Bridge Deep Dive',
      date: '2024-03-01',
      time: '3:00 PM UTC',
      type: 'Technical Talk',
      description: 'Technical presentation on how our cross-chain bridge works under the hood.',
      attendees: 200,
      platform: 'YouTube Live'
    }
  ];

  const communityStats = [
    { label: 'Total Members', value: '50,000+', icon: 'mdi:account-group' },
    { label: 'Active Developers', value: '2,500+', icon: 'mdi:code-tags' },
    { label: 'Projects Built', value: '800+', icon: 'mdi:rocket-launch' },
    { label: 'Countries', value: '120+', icon: 'mdi:earth' }
  ];

  const contributorSpotlight = [
    {
      name: 'Alex Chen',
      role: 'Core Contributor',
      avatar: '👨‍💻',
      contribution: 'Built the TypeScript SDK and improved API documentation',
      github: 'alexchen',
      location: 'San Francisco, CA'
    },
    {
      name: 'Sarah Johnson',
      role: 'Community Moderator',
      avatar: '👩‍💼',
      contribution: 'Manages Discord community and organizes events',
      github: 'sarahj',
      location: 'London, UK'
    },
    {
      name: 'Miguel Rodriguez',
      role: 'Security Researcher',
      avatar: '🔒',
      contribution: 'Identified and reported critical security vulnerabilities',
      github: 'miguelr',
      location: 'Madrid, Spain'
    }
  ];

  const communityGuidelines = [
    {
      title: 'Be Respectful',
      description: 'Treat all community members with respect and kindness. No harassment, discrimination, or offensive language.',
      icon: 'mdi:heart'
    },
    {
      title: 'Stay On Topic',
      description: 'Keep discussions relevant to OmniPay, blockchain technology, and related topics.',
      icon: 'mdi:target'
    },
    {
      title: 'Help Others',
      description: 'Share your knowledge and help fellow community members solve problems.',
      icon: 'mdi:hand-heart'
    },
    {
      title: 'No Spam',
      description: 'Avoid posting repetitive content, excessive self-promotion, or irrelevant links.',
      icon: 'mdi:shield-check'
    },
    {
      title: 'Use Search',
      description: 'Before asking questions, search previous discussions to avoid duplicates.',
      icon: 'mdi:magnify'
    },
    {
      title: 'Report Issues',
      description: 'Report any violations of community guidelines to moderators promptly.',
      icon: 'mdi:flag'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'mdi:view-dashboard' },
    { id: 'channels', label: 'Channels', icon: 'mdi:forum' },
    { id: 'events', label: 'Events', icon: 'mdi:calendar' },
    { id: 'contributors', label: 'Contributors', icon: 'mdi:account-star' },
    { id: 'guidelines', label: 'Guidelines', icon: 'mdi:book-open' }
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
              <Icon icon={UI_ICONS.community} size={48} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Community</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join our vibrant community of developers, users, and blockchain enthusiasts. 
              Connect, learn, and build the future of cross-chain payments together.
            </p>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {communityStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card hover={true}>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" 
                           style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <Icon icon={stat.icon} size={24} color="white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon icon={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <Card>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Welcome to OmniPay Community</h2>
                    <p className="text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                      Our community is the heart of OmniPay. Whether you're a developer building with our APIs, 
                      a user exploring cross-chain payments, or just curious about blockchain technology, 
                      you'll find a welcoming space to learn, share, and grow.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                             style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                          <Icon icon="mdi:lightbulb" size={32} color="white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Learn & Share</h3>
                        <p className="text-gray-400 text-sm">
                          Exchange knowledge, ask questions, and learn from experienced developers and users.
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                             style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                          <Icon icon="mdi:rocket-launch" size={32} color="white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Build Together</h3>
                        <p className="text-gray-400 text-sm">
                          Collaborate on projects, contribute to open source, and shape the future of OmniPay.
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                             style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                          <Icon icon="mdi:account-group" size={32} color="white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Connect</h3>
                        <p className="text-gray-400 text-sm">
                          Network with like-minded individuals and build lasting relationships in the blockchain space.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'channels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityChannels.map((channel, index) => (
                  <motion.div
                    key={channel.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card hover={true}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                             style={{ backgroundColor: channel.color + '20', border: `1px solid ${channel.color}40` }}>
                          <Icon icon={channel.icon} size={32} color={channel.color} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{channel.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {channel.description}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500 mb-4">
                          <span>{channel.members} members</span>
                          <span>{channel.activity}</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <Icon icon="mdi:open-in-new" size={16} className="mr-2" />
                          Join {channel.name}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Upcoming Events</h2>
                  <p className="text-gray-300">Join our community events to learn, network, and stay updated.</p>
                </div>
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card hover={true}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
                              {event.type}
                            </span>
                            <span className="text-gray-400 text-sm">{event.platform}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                          <p className="text-gray-300 mb-3 leading-relaxed">{event.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Icon icon="mdi:calendar" size={16} />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon icon="mdi:clock" size={16} />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon icon="mdi:account-group" size={16} />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <Button size="md" variant="primary">
                            <Icon icon="mdi:calendar-plus" size={18} className="mr-2" />
                            Register
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'contributors' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Contributor Spotlight</h2>
                  <p className="text-gray-300">Meet some of our amazing community contributors who help make OmniPay better.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contributorSpotlight.map((contributor, index) => (
                    <motion.div
                      key={contributor.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card hover={true}>
                        <div className="text-center">
                          <div className="text-4xl mb-4">{contributor.avatar}</div>
                          <h3 className="text-lg font-bold text-white mb-1">{contributor.name}</h3>
                          <p className="text-sm text-gray-400 mb-3">{contributor.role}</p>
                          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                            {contributor.contribution}
                          </p>
                          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Icon icon="mdi:github" size={14} />
                              <span>{contributor.github}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon icon="mdi:map-marker" size={14} />
                              <span>{contributor.location}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <Card>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Want to Contribute?</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      We're always looking for passionate individuals to join our community and contribute to OmniPay's growth.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button variant="primary">
                        <Icon icon="mdi:github" size={18} className="mr-2" />
                        View Open Issues
                      </Button>
                      <Button variant="outline">
                        <Icon icon="mdi:book-open" size={18} className="mr-2" />
                        Contribution Guide
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'guidelines' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Community Guidelines</h2>
                  <p className="text-gray-300">Help us maintain a welcoming and productive community for everyone.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {communityGuidelines.map((guideline, index) => (
                    <motion.div
                      key={guideline.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card hover={true}>
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                               style={{ backgroundColor: 'rgba(6, 0, 17, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <Icon icon={guideline.icon} size={24} color="white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">{guideline.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {guideline.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <Card>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Questions or Concerns?</h3>
                    <p className="text-gray-300 mb-6">
                      If you have questions about our guidelines or need to report an issue, don't hesitate to reach out.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button variant="primary">
                        <Icon icon="mdi:email" size={18} className="mr-2" />
                        Contact Moderators
                      </Button>
                      <Button variant="outline">
                        <Icon icon="mdi:flag" size={18} className="mr-2" />
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;