'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { ArrowLeft, Clock, Home, Shield, Wifi, Mail } from 'lucide-react'

export default function OmolajaFlatsPage() {
  return (
    <>
      <Head>
        <title>Omolaja Flats - Comfortable & Affordable Apartments Coming Soon | CO Signatures Homes</title>
        <meta name="description" content="Omolaja Flats - Comfortable and affordable apartment living with essential amenities and convenient location. Coming soon from CO Signatures Homes. Stay updated on our launch." />
        <meta name="keywords" content="Omolaja Flats, affordable apartments, comfortable living, essential amenities, convenient location, coming soon, CO Signatures Homes" />
        <meta property="og:title" content="Omolaja Flats - Comfortable & Affordable Apartments Coming Soon" />
        <meta property="og:description" content="Comfortable and affordable apartment living with essential amenities - Coming Soon" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Omolaja Flats - Coming Soon" />
        <meta name="twitter:description" content="Comfortable and affordable apartments coming soon from CO Signatures Homes" />
      </Head>
      <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back Button */}
            <Link href="/" className="flex items-center space-x-3 text-gold-400 hover:text-gold-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to CO Signatures Homes</span>
            </Link>

            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/Omolaja Flats.svg"
                alt="Omolaja Flats"
                width={200}
                height={200}
                className="h-[200px] w-[120px]"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-dark-950 to-black min-h-screen flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gold-500 text-black px-6 py-3 rounded-full font-semibold mb-8"
            >
              <Clock className="w-5 h-5" />
              <span>Coming Soon</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
              <span className="text-gold-400">Omolaja</span> Flats
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comfortable and affordable apartment living with essential amenities and convenient location. 
              Experience quality accommodation that combines value with comfort.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              {[
                {
                  icon: Home,
                  title: 'Comfortable Living',
                  description: 'Well-designed apartments with all essential amenities'
                },
                {
                  icon: Shield,
                  title: 'Secure Environment',
                  description: 'Safe and secure residential community'
                },
                {
                  icon: Wifi,
                  title: 'Modern Conveniences',
                  description: 'Essential modern amenities for comfortable living'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center bg-dark-950 rounded-2xl p-6 border border-gray-800"
                >
                  <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Notification Signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-dark-950 rounded-3xl p-8 max-w-2xl mx-auto border border-gray-800"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Mail className="w-6 h-6 text-gold-400" />
                <h2 className="text-2xl font-playfair font-bold text-white">
                  Stay Updated
                </h2>
              </div>
              <p className="text-gray-300 mb-6">
                Get notified when Omolaja Flats becomes available. 
                Be among the first to experience comfortable and affordable apartment living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                />
                <button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Notify Me
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            >
              <Link
                href="/"
                className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                Explore Other Properties
              </Link>
              <Link
                href="/contact"
                className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/Omolaja Flats.svg"
                alt="Omolaja Flats"
                width={200}
                height={200}
                className="h-[200px] w-[120px]"
              />
            </div>
            <p className="text-gray-300 mb-8">
              Comfortable and affordable apartment living - Coming Soon
            </p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-center text-gray-400">
                &copy; 2025 CO Signatures Homes. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
