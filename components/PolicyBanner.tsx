'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, FileText } from 'lucide-react'
import Link from 'next/link'

const PolicyBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted policies
    const hasAcceptedPolicies = localStorage.getItem('cosignature-policies-accepted')
    if (!hasAcceptedPolicies) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cosignature-policies-accepted', 'true')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900 border-t border-gray-800 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Privacy & Terms Notice</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We use cookies and collect data to improve your experience. By using our website, you agree to our{' '}
                    <Link href="/terms" className="text-gold-400 hover:text-gold-300 underline">
                      Terms & Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={handleAccept}
                  className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PolicyBanner
