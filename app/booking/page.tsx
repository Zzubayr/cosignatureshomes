'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'
import { calculatePricing } from '@/lib/pricing'

// Declare Paystack types
declare global {
  interface Window {
    // PaystackPop removed
  }
}

interface FormData {
  company: string
  apartment: string
  checkin: string
  checkout: string
  guests: string
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

const BookingPage = () => {
  const { user, userData } = useAuth()
  const [pricing, setPricing] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    company: '',
    apartment: '',
    checkin: '',
    checkout: '',
    guests: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [bookingReference, setBookingReference] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)

  // Auto-fill form with user data
  useEffect(() => {
    if (user && userData) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: userData.displayName || '',
        phone: userData.phone || ''
      }))
    }
  }, [user, userData])

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateDates = (checkin: string, checkout: string): { isValid: boolean; error?: string } => {
    if (!checkin || !checkout) {
      return { isValid: false, error: 'Both check-in and check-out dates are required' }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)

    if (checkinDate < today) {
      return { isValid: false, error: 'Check-in date cannot be in the past' }
    }

    if (checkoutDate <= checkinDate) {
      return { isValid: false, error: 'Check-out date must be after check-in date' }
    }

    const daysDifference = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDifference > 30) {
      return { isValid: false, error: 'Maximum stay is 30 days' }
    }

    return { isValid: true }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email address is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.company) newErrors.company = 'Please select a property'
    if (!formData.apartment) newErrors.apartment = 'Please select an apartment'
    if (!formData.checkin) newErrors.checkin = 'Check-in date is required'
    if (!formData.checkout) newErrors.checkout = 'Check-out date is required'
    if (!formData.guests) newErrors.guests = 'Number of guests is required'

    // Format validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    // Date validation
    const dateValidation = validateDates(formData.checkin, formData.checkout)
    if (!dateValidation.isValid && dateValidation.error) {
      newErrors.dates = dateValidation.error
    }

    // Guests validation
    const guestCount = parseInt(formData.guests)
    if (formData.guests && (isNaN(guestCount) || guestCount < 1 || guestCount > 10)) {
      newErrors.guests = 'Number of guests must be between 1 and 10'
    }

    // Check if trying to book coming soon properties
    if (formData.company && ['cladius-elite', 'omolaja-flats'].includes(formData.company)) {
      newErrors.company = 'This property is coming soon. Please select Pa Cladius Apartments for immediate booking.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !userData) {
      setSubmitStatus('error')
      setSubmitMessage('Please sign in to make a booking.')
      return
    }
    
    if (!validateForm() || !pricing) {
      setSubmitStatus('error')
      setSubmitMessage('Please correct the errors and try again.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // 1. Save pending booking to localStorage
      const pendingBooking = {
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        apartment: formData.apartment,
        checkin: formData.checkin,
        checkout: formData.checkout,
        guests: formData.guests,
        message: formData.message,
        pricing: pricing
      }
      localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking))

      // 2. Initialize Paystack Transaction
      const paymentReference = `CSH_${Date.now()}_${user.uid.slice(-6)}`
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: pricing.totalAmount,
          reference: paymentReference,
          metadata: {
            custom_fields: [
              { display_name: "Property", variable_name: "property", value: formData.company },
              { display_name: "Apartment", variable_name: "apartment", value: formData.apartment }
            ]
          }
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payment initialization failed')
      }

      // 3. Redirect to Paystack payment page
      window.location.href = result.data.authorization_url

    } catch (error) {
      console.error('Payment error:', error)
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
      setProcessingPayment(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Clear date errors when either date changes
    if ((name === 'checkin' || name === 'checkout') && errors.dates) {
      setErrors(prev => ({
        ...prev,
        dates: ''
      }))
    }

    // Reset apartment selection when company changes
    if (name === 'company' && formData.apartment) {
      setFormData(prev => ({
        ...prev,
        company: value,
        apartment: ''
      }))
    }
  }

  // Calculate pricing whenever relevant fields change
  useEffect(() => {
    if (formData.company && formData.apartment && formData.checkin && formData.checkout) {
      const pricingDetails = calculatePricing(
        formData.company,
        formData.apartment,
        formData.checkin,
        formData.checkout
      )
      setPricing(pricingDetails)
    } else {
      setPricing(null)
    }
  }, [formData.company, formData.apartment, formData.checkin, formData.checkout])

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0]
  
  // Get tomorrow's date for checkout min date
  const getTomorrowDate = (checkinDate: string) => {
    if (!checkinDate) return today
    const tomorrow = new Date(checkinDate)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const companies = [
    { value: 'pa-cladius', label: 'Pa Cladius Apartments', status: 'available' },
    { value: 'cladius-elite', label: 'Cladius Elite Lofts', status: 'coming-soon' },
    { value: 'omolaja-flats', label: 'Omolaja Flats', status: 'coming-soon' }
  ]

  const apartments = {
    'pa-cladius': [
      { value: 'premium-3bedroom', label: 'Premium 3-Bedroom Ensuite Apartment (Unit 1)' },
      { value: 'executive-3bedroom', label: 'Executive 3-Bedroom Ensuite Apartment (Unit 2)' },
      { value: 'deluxe-1bedroom', label: 'Deluxe 1-Bedroom Ensuite Apartment (Unit 3)' }
    ],
    'cladius-elite': [
      { value: 'coming-soon', label: 'Coming Soon - Premium Lofts' }
    ],
    'omolaja-flats': [
      { value: 'coming-soon', label: 'Coming Soon - Comfortable Flats' }
    ]
  }

  const getAvailableApartments = () => {
    if (!formData.company) return []
    return apartments[formData.company as keyof typeof apartments] || []
  }

  const steps = [
    { number: 1, title: 'Select Property', description: 'Choose your preferred property' },
    { number: 2, title: 'Select Apartment', description: 'Choose your preferred unit' },
    { number: 3, title: 'Choose Dates', description: 'Pick your check-in and check-out dates' },
    { number: 4, title: 'Submit Request', description: 'Fill in your contact details and submit' }
  ]

  return (
    <div className="min-h-screen bg-black">
        <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-dark-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Rates & Booking
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Reserve your luxury stay with CO Signature Homes. Follow our simple booking process 
              to secure your premium accommodation across our portfolio of properties.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-16 bg-dark-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">{step.number}</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-playfair font-bold text-white mb-8">
                Make a Reservation
              </h2>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="text-green-400 font-semibold">Booking Request Submitted!</h3>
                      <p className="text-green-300 text-sm mt-1">{submitMessage}</p>
                      {bookingReference && (
                        <p className="text-green-300 text-sm mt-1">
                          <strong>Reference:</strong> {bookingReference}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <h3 className="text-red-400 font-semibold">Submission Failed</h3>
                      <p className="text-red-300 text-sm mt-1">{submitMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Date validation error */}
              {errors.dates && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300 text-sm">{errors.dates}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gold-400 font-semibold mb-2">
                    Select Property *
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                      errors.company 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-gold-400'
                    }`}
                  >
                    <option value="">Select a property</option>
                    {companies.map((company) => (
                      <option key={company.value} value={company.value}>
                        {company.label} {company.status === 'coming-soon' ? '(Coming Soon)' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.company && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gold-400 font-semibold mb-2">
                    Preferred Apartment *
                  </label>
                  <select
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    required
                    disabled={!formData.company}
                    className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.apartment 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-gold-400'
                    }`}
                  >
                    <option value="">
                      {formData.company ? 'Select an apartment' : 'First select a property'}
                    </option>
                    {getAvailableApartments().map((apt) => (
                      <option key={apt.value} value={apt.value}>
                        {apt.label}
                      </option>
                    ))}
                  </select>
                  {errors.apartment && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.apartment}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-400 font-semibold mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      name="checkin"
                      value={formData.checkin}
                      onChange={handleChange}
                      min={today}
                      required
                      className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                        errors.checkin || errors.dates
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-gold-400'
                      }`}
                    />
                    {errors.checkin && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.checkin}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gold-400 font-semibold mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      name="checkout"
                      value={formData.checkout}
                      onChange={handleChange}
                      min={getTomorrowDate(formData.checkin)}
                      required
                      className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                        errors.checkout || errors.dates
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-gold-400'
                      }`}
                    />
                    {errors.checkout && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.checkout}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gold-400 font-semibold mb-2">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                      errors.guests 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-gold-400'
                    }`}
                  >
                    <option value="">Select number of guests</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  {errors.guests && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.guests}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-400 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={50}
                      className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-gold-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gold-400 font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-gold-400'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gold-400 font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-gold-400'
                    }`}
                    placeholder="e.g., +234 913 559 1544"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gold-400 font-semibold mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none resize-none"
                    placeholder="Any special requests, dietary requirements, accessibility needs, or other preferences..."
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || processingPayment}
                  className={`w-full font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting || processingPayment
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gold-500 hover:bg-gold-600 transform hover:scale-105'
                  } text-black`}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Initializing Payment...</span>
                    </>
                  ) : (
                    <span>
                      {pricing ? `Pay ₦${pricing.totalAmount.toLocaleString()} & Book` : 'Submit Booking Request'}
                    </span>
                  )}
                </button>

                {/* Pricing Summary */}
                {pricing && (
                  <div className="mt-8 bg-dark-900 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-gold-400 mr-2" />
                      <h3 className="text-xl font-playfair font-semibold text-gold-400">
                        Booking Summary
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-300">
                        <span>{pricing.nights} night{pricing.nights > 1 ? 's' : ''} × ₦{pricing.nightlyRate.toLocaleString()}</span>
                        <span className="text-white font-semibold">₦{pricing.basePrice.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-300">
                        <span>VAT (7.5%)</span>
                        <span className="text-white font-semibold">₦{pricing.taxes.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-300">
                        <span>Service Fee</span>
                        <span className="text-white font-semibold">₦{pricing.serviceFee.toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-3 mt-3">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal</span>
                          <span className="text-white font-semibold">₦{pricing.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gold-500/30 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gold-400 font-semibold text-lg">Total Amount</span>
                          <span className="text-gold-400 font-bold text-2xl">₦{pricing.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-300 text-sm flex items-start">
                        <span className="mr-2">💳</span>
                        <span>Payment will be processed securely through Paystack. You will be redirected to complete payment after clicking "Pay & Book Now".</span>
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                  You can also reach us directly through any of the following channels. 
                  Our team is available 24/7 to assist with your booking and any inquiries.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone</h3>
                    <p className="text-gray-300">+234 913 559 1544</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <p className="text-gray-300">info@cosignaturehomes.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Locations</h3>
                    <p className="text-gray-300">Multiple locations across Nigeria</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-playfair font-semibold text-gold-400 mb-4">
                  Booking Policy
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Check-in: 2:00 PM</li>
                  <li>• Check-out: 12:00 PM</li>
                  <li>• Advance booking recommended</li>
                  <li>• Payment required upon confirmation</li>
                  <li>• Cancellation policy applies</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
  )
}

export default BookingPage
