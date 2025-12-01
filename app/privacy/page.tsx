'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import { Shield, Eye, Database, Cookie, Users, Lock, FileText, Mail } from 'lucide-react'
import Head from 'next/head'

const PrivacyPage = () => {
  const policies = [
    {
      id: 1,
      icon: Database,
      title: 'Information We Collect',
      content: 'Name, phone, email, ID, guest count, payment details (not stored).'
    },
    {
      id: 2,
      icon: Users,
      title: 'How We Use It',
      content: 'To process bookings, communication, safety, compliance, and improvement.'
    },
    {
      id: 3,
      icon: Lock,
      title: 'Data Security',
      content: 'Secure storage; limited access.'
    },
    {
      id: 4,
      icon: Eye,
      title: 'CCTV',
      content: 'Surveillance only in public/common areas.'
    },
    {
      id: 5,
      icon: Cookie,
      title: 'Cookies',
      content: 'Used for booking functionality and analytics.'
    },
    {
      id: 6,
      icon: Shield,
      title: 'Third-Party Services',
      content: 'Payments, verification, analytics — all secure vendors.'
    },
    {
      id: 7,
      icon: FileText,
      title: 'Your Rights',
      content: 'Request access, correction, or deletion where applicable.'
    },
    {
      id: 8,
      icon: Database,
      title: 'Retention',
      content: 'Stored per Nigerian regulations.'
    },
    {
      id: 9,
      icon: FileText,
      title: 'Updates',
      content: 'Policy may change and will appear on the website.'
    }
  ]

  return (
    <>
      <Head>
        <title>Privacy Policy - CO Signatures Homes | Data Protection & Security</title>
        <meta name="description" content="Learn how CO Signatures Homes protects your privacy and personal data. Our commitment to data security and guest privacy." />
        <meta name="keywords" content="privacy policy, data protection, CO Signatures Homes, personal information, CCTV policy, cookies, data security" />
        <meta property="og:title" content="Privacy Policy - CO Signatures Homes" />
        <meta property="og:description" content="Our commitment to protecting your privacy and personal data" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy - CO Signatures Homes" />
        <meta name="twitter:description" content="Data protection and privacy practices for luxury accommodations" />
      </Head>

      <div className="min-h-screen bg-black">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-black to-dark-950">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                Privacy <span className="text-gold-400">Policy</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Your privacy is important to us. Learn how we collect, use, and protect your personal information.
              </p>
              <div className="mt-8 text-sm text-gray-400">
                <p>Last updated: November 2025</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-dark-900 rounded-2xl p-8 border border-gray-800 mb-12"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-white mb-4">
                      Our Commitment to Your Privacy
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      At CO Signatures Homes, we are committed to protecting your privacy and ensuring the security of your personal information. 
                      This privacy policy explains how we collect, use, store, and protect your data when you use our services.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Privacy Policies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {policies.map((policy, index) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <policy.icon className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {policy.id}. {policy.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {policy.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Data Protection Notice */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-dark-900 rounded-2xl p-8 border border-gray-800 mb-8"
              >
                <h2 className="text-2xl font-playfair font-bold text-white mb-6">
                  Data Protection & Security Measures
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gold-400 mb-3">Security Protocols</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Encrypted data transmission</li>
                      <li>• Secure payment processing</li>
                      <li>• Limited staff access to personal data</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gold-400 mb-3">Your Rights</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Access your personal data</li>
                      <li>• Request data correction</li>
                      <li>• Request data deletion</li>
                      <li>• Withdraw consent</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-gold-600 to-gold-500 rounded-2xl p-8 text-center"
              >
                <h2 className="text-2xl font-playfair font-bold text-black mb-4">
                  10. Contact Us About Privacy
                </h2>
                <p className="text-black/80 mb-6">
                  If you have questions about this privacy policy or how we handle your data, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-black" />
                    <span className="text-black font-semibold">info@cosignatureshomes.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-black font-semibold">cosignatureshomes.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Legal Compliance */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <div className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">Legal Compliance</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    This privacy policy complies with Nigerian data protection regulations and international best practices. 
                    We reserve the right to update this policy as needed to reflect changes in our practices or applicable laws. 
                    Any updates will be posted on our website with the effective date clearly indicated.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default PrivacyPage
