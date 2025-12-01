'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import { Shield, Clock, CreditCard, Key, AlertTriangle, Phone, Mail } from 'lucide-react'
import Head from 'next/head'

const TermsPage = () => {
  const terms = [
    {
      id: 1,
      icon: CreditCard,
      title: 'Booking & Payment',
      content: 'All bookings must be confirmed through cosignatureshomes.com, WhatsApp, or approved booking platforms. Full payment or a deposit may be required.'
    },
    {
      id: 2,
      icon: Clock,
      title: 'Check-In & Check-Out',
      content: 'Check-in: 2:00 PM, Check-out: 12:00 PM. Early check-in/late check-out subject to availability.'
    },
    {
      id: 3,
      icon: Key,
      title: 'Identification',
      content: 'Valid government-issued ID required at check-in.'
    },
    {
      id: 4,
      icon: Shield,
      title: 'Security & Safety',
      content: '24/7 CCTV in operation. Guests responsible for personal belongings.'
    },
    {
      id: 5,
      icon: AlertTriangle,
      title: 'Property Rules',
      content: 'No smoking indoors. No parties. Damage charges may apply.'
    },
    {
      id: 6,
      icon: Clock,
      title: 'Cancellation Policy',
      content: 'Cancel 48 hrs prior to avoid charges. No-shows charged fully.'
    },
    {
      id: 7,
      icon: Shield,
      title: 'Liability',
      content: 'We are not liable for loss, injury, or external utility failures.'
    },
    {
      id: 8,
      icon: AlertTriangle,
      title: 'Maintenance',
      content: 'Notify management for repairs; we will respond promptly.'
    },
    {
      id: 9,
      icon: Shield,
      title: 'Facility Use',
      content: 'Improper use leading to damage incurs repair fees.'
    },
    {
      id: 10,
      icon: AlertTriangle,
      title: 'Modification',
      content: 'Terms may be updated at any time via the website.'
    }
  ]

  return (
    <>
      <Head>
        <title>Terms & Conditions - CO Signature Homes | Luxury Serviced Apartments</title>
        <meta name="description" content="Read the terms and conditions for CO Signature Homes luxury serviced apartments. Booking policies, check-in procedures, and property rules." />
        <meta name="keywords" content="terms conditions, booking policy, CO Signature Homes, serviced apartments, check-in rules, cancellation policy" />
        <meta property="og:title" content="Terms & Conditions - CO Signature Homes" />
        <meta property="og:description" content="Terms and conditions for luxury serviced apartment bookings" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms & Conditions - CO Signature Homes" />
        <meta name="twitter:description" content="Booking terms and property rules for luxury accommodations" />
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
                Terms & <span className="text-gold-400">Conditions</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Please read these terms and conditions carefully before booking your stay with CO Signature Homes.
              </p>
              <div className="mt-8 text-sm text-gray-400">
                <p>Last updated: November 2025</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
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
                <h2 className="text-2xl font-playfair font-bold text-white mb-4">
                  Welcome to CO Signature Homes
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By booking accommodation with CO Signature Homes, you agree to comply with these terms and conditions. 
                  These terms govern your use of our services and facilities at our luxury serviced apartments.
                </p>
              </motion.div>

              {/* Terms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {terms.map((term, index) => (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <term.icon className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {term.id}. {term.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {term.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-gold-600 to-gold-500 rounded-2xl p-8 text-center"
              >
                <h2 className="text-2xl font-playfair font-bold text-black mb-4">
                  11. Contact Information
                </h2>
                <p className="text-black/80 mb-6">
                  For questions about these terms or to discuss your booking requirements, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-black" />
                    <span className="text-black font-semibold">+2348110384179</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-black" />
                    <span className="text-black font-semibold">info@cosignatureshomes.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Legal Notice */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <div className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    These terms and conditions are governed by the laws of Nigeria. Any disputes arising from these terms 
                    will be resolved in accordance with Nigerian law. By proceeding with your booking, you acknowledge 
                    that you have read, understood, and agree to be bound by these terms and conditions.
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

export default TermsPage
