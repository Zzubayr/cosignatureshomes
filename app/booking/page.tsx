'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar as CalendarIcon, Users, Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { calculatePricing } from '@/lib/pricing'
import { toast } from 'sonner'

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
  const { user, userData, loading } = useAuth()
  const router = useRouter()
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
  interface BookedDate {
    start: string
    end: string
  }

  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const availabilityRequestId = useRef(0)

  // Refs for auto-scrolling to errors
  const companyRef = useRef<HTMLDivElement>(null)
  const apartmentRef = useRef<HTMLDivElement>(null)
  const checkinRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<HTMLDivElement>(null)
  const guestsRef = useRef<HTMLSelectElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

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

  // Prefill contact details from authenticated user when available
  useEffect(() => {
    if (!user) return

    setFormData(prev => ({
      ...prev,
      name: prev.name || user.displayName || userData?.displayName || '',
      email: prev.email || user.email || '',
      phone: prev.phone || userData?.phone || ''
    }))
  }, [user, userData])

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

  // Get today's date for min date validation (allow same-day bookings)
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  
  const today = getTodayDate()
  
  // Get day after check-in for checkout min date
  const getCheckoutMinDate = (checkinDate: string) => {
    if (!checkinDate) return today
    const checkoutMin = new Date(checkinDate)
    checkoutMin.setDate(checkoutMin.getDate() + 1)
    return checkoutMin.toISOString().split('T')[0]
  }

  const companies = [
    { value: 'pa-claudius', label: 'Pa Claudius Apartments', status: 'available' },
    { value: 'claudius-elite', label: 'Claudius Elite Lofts', status: 'coming-soon' },
    { value: 'omolaja-flats', label: 'Omolaja Flats', status: 'coming-soon' }
  ]

  const apartments = {
    'pa-claudius': [
      { value: 'premium-3bedroom', label: 'Premium 3-Bedroom Ensuite Apartment (Unit 1)' },
      { value: 'executive-3bedroom', label: 'Executive 3-Bedroom Ensuite Apartment (Unit 2)' },
      { value: 'deluxe-1bedroom', label: 'Deluxe 1-Bedroom Ensuite Apartment (Unit 3)' }
    ],
    'claudius-elite': [],
    'omolaja-flats': []
  }

  const isDateRangeBooked = (checkin: string, checkout: string): boolean => {
    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)

    return bookedDates.some(booking => {
      const bookingStart = new Date(booking.start)
      const bookingEndExclusive = new Date(booking.end)

      // Treat checkout as exclusive so a new guest can check in on the same day another checks out
      return checkinDate < bookingEndExclusive && checkoutDate > bookingStart
    })
  }

  const isDateBooked = (date: string): boolean => {
    if (!date) return false
    const target = new Date(date)
    return bookedDates.some(({ start, end }) => {
      const bookingStart = new Date(start)
      const bookingEndExclusive = new Date(end)
      return target >= bookingStart && target < bookingEndExclusive
    })
  }

  const normalizeDate = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const getUnavailableDatesInRange = (checkin: string, checkout: string): string[] => {
    if (!checkin || !checkout) return []

    const conflicts = new Set<string>()
    const selectionStart = normalizeDate(new Date(checkin))
    const selectionEndExclusive = normalizeDate(new Date(checkout))

    bookedDates.forEach(({ start, end }) => {
      const bookingStart = normalizeDate(new Date(start))
      const bookingEndExclusive = normalizeDate(new Date(end))

      const overlapStart = new Date(Math.max(selectionStart.getTime(), bookingStart.getTime()))
      const overlapEndExclusive = new Date(Math.min(selectionEndExclusive.getTime(), bookingEndExclusive.getTime()))

      for (let day = overlapStart; day < overlapEndExclusive; day.setDate(day.getDate() + 1)) {
        conflicts.add(day.toISOString().split('T')[0])
      }
    })

    return Array.from(conflicts).sort()
  }

  const formatUnavailableMessage = (dates: string[]) => {
    if (!dates.length) return ''
    const preview = dates.slice(0, 3).map(date =>
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    ).join(', ')
    const more = dates.length > 3 ? ` + ${dates.length - 3} more` : ''
    return `Selected dates are not available. Unavailable: ${preview}${more}`
  }

  const getAvailableApartments = () => {
    if (!formData.company) return []
    return apartments[formData.company as keyof typeof apartments] || []
  }

  // Fetch availability whenever property/apartment selection changes
  useEffect(() => {
    if (!formData.company || !formData.apartment) {
      setBookedDates([])
      setLoadingAvailability(false)
      return
    }

    const requestId = ++availabilityRequestId.current
    setLoadingAvailability(true)

    const fetchAvailability = async () => {
      try {
        const params = new URLSearchParams({
          company: formData.company,
          apartment: formData.apartment
        })

        const response = await fetch(`/api/bookings/availability?${params.toString()}`)
        const result = await response.json()

        if (requestId !== availabilityRequestId.current) return

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Unable to load availability')
        }

        setBookedDates(result.bookedDates || [])
      } catch (error) {
        if (requestId !== availabilityRequestId.current) return
        console.error('Availability fetch error:', error)
        setBookedDates([])
        toast.error(error instanceof Error ? error.message : 'Failed to load availability')
      } finally {
        if (requestId === availabilityRequestId.current) {
          setLoadingAvailability(false)
        }
      }
    }

    fetchAvailability()
  }, [formData.company, formData.apartment])

  // Update date availability errors whenever selection or availability changes
  useEffect(() => {
    if (!formData.checkin || !formData.checkout) return

    const unavailableDates = getUnavailableDatesInRange(formData.checkin, formData.checkout)
    if (unavailableDates.length) {
      setErrors(prev => ({
        ...prev,
        dates: formatUnavailableMessage(unavailableDates)
      }))
    } else if (errors.dates?.startsWith('Selected dates are not available')) {
      setErrors(prev => ({
        ...prev,
        dates: ''
      }))
    }
  }, [formData.checkin, formData.checkout, bookedDates, errors.dates])

  const validateForm = () => {
    const newErrors: FormErrors = {}
    let isValid = true
    let firstErrorField: string | null = null

    if (!formData.company) {
      newErrors.company = 'Please select a property'
      if (!firstErrorField) firstErrorField = 'company'
      isValid = false
    }

    if (!formData.apartment) {
      newErrors.apartment = 'Please select an apartment'
      if (!firstErrorField) firstErrorField = 'apartment'
      isValid = false
    }

    if (!formData.checkin) {
      newErrors.checkin = 'Check-in date is required'
      if (!firstErrorField) firstErrorField = 'checkin'
      isValid = false
    }

    if (!formData.checkout) {
      newErrors.checkout = 'Check-out date is required'
      if (!firstErrorField) firstErrorField = 'checkout'
      isValid = false
    }

    if (formData.checkin && formData.checkout) {
      const checkinDate = new Date(formData.checkin)
      const checkoutDate = new Date(formData.checkout)
      
      if (checkoutDate <= checkinDate) {
        newErrors.dates = 'Check-out must be after check-in'
        if (!firstErrorField) firstErrorField = 'checkout'
        isValid = false
      } else {
        const unavailableDates = getUnavailableDatesInRange(formData.checkin, formData.checkout)
        if (unavailableDates.length) {
          newErrors.dates = formatUnavailableMessage(unavailableDates)
          if (!firstErrorField) firstErrorField = 'checkin'
          isValid = false
        } else if (isDateRangeBooked(formData.checkin, formData.checkout)) {
          newErrors.dates = 'Selected dates are not available. Please choose different dates.'
          if (!firstErrorField) firstErrorField = 'checkin'
          isValid = false
        }
      }
    }

    if (!formData.guests) {
      newErrors.guests = 'Please select number of guests'
      if (!firstErrorField) firstErrorField = 'guests'
      isValid = false
    }

    if (!formData.name) {
      newErrors.name = 'Full name is required'
      if (!firstErrorField) firstErrorField = 'name'
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
      if (!firstErrorField) firstErrorField = 'email'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
      if (!firstErrorField) firstErrorField = 'email'
      isValid = false
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
      if (!firstErrorField) firstErrorField = 'phone'
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) {
      toast.error('Please fix the errors in the form')
      
      // Auto-scroll to first error
      if (firstErrorField) {
        const refs: { [key: string]: React.RefObject<HTMLElement> } = {
          company: companyRef,
          apartment: apartmentRef,
          checkin: checkinRef,
          checkout: checkoutRef,
          guests: guestsRef,
          name: nameRef,
          email: emailRef,
          phone: phoneRef
        }
        
        const ref = refs[firstErrorField]
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !userData) {
      toast.error('Please sign in to make a booking')
      router.push('/auth')
      return
    }
    
    if (!validateForm()) {
      return
    }

    if (loadingAvailability) {
      toast.error('Please wait while we check availability...')
      return
    }

    if (!pricing) {
      toast.error('Unable to calculate pricing. Please check your dates.')
      return
    }

    setIsSubmitting(true)

    try {
      // Initialize Paystack Transaction (server calculates amount)
      const paymentReference = `CSH_${Date.now()}_${user.uid.slice(-6)}`
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          reference: paymentReference,
          // Send booking details for server-side validation
          bookingDetails: {
            property: formData.company,
            company: formData.company,
            apartment: formData.apartment,
            checkin: formData.checkin,
            checkout: formData.checkout,
            guests: formData.guests,
            message: formData.message,
            userId: user.uid
          },
          customer: {
            name: formData.name,
            phone: formData.phone
          },
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
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
      setProcessingPayment(false)
    }
  }

  const steps = [
    { number: 1, title: 'Select Property', description: 'Choose your preferred property' },
    { number: 2, title: 'Select Apartment', description: 'Choose your preferred unit' },
    { number: 3, title: 'Choose Dates', description: 'Pick your check-in and check-out dates' },
    { number: 4, title: 'Submit Request', description: 'Fill in your contact details and submit' }
  ]

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

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
              Reserve your luxury stay with CO Signatures Homes. Follow our simple booking process 
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
                <div ref={companyRef}>
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
                      <option key={company.value} value={company.value} disabled={company.status !== 'available'}>
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

                <div ref={apartmentRef}>
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
                  {loadingAvailability && formData.apartment && (
                    <p className="text-blue-400 text-sm mt-1 flex items-center">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Checking availability...
                    </p>
                  )}
                  {!loadingAvailability && formData.apartment && bookedDates.length > 0 && (
                    <p className="text-yellow-400 text-sm mt-1">
                      Some dates are already booked for this apartment
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div ref={checkinRef}>
                    <label className="block text-gold-400 font-semibold mb-3 text-base">
                      Check-in Date *
                    </label>
                    {!formData.apartment ? (
                      <div className="w-full bg-dark-900/50 border-2 border-dashed border-gray-600 rounded-xl px-6 py-8 text-center">
                        <CalendarIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Select an apartment first</p>
                      </div>
                    ) : loadingAvailability ? (
                      <div className="w-full bg-dark-900 border-2 border-gray-700 rounded-xl p-4 shadow-xl">
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mb-3" />
                          <span className="text-gray-300 text-sm">Checking availability...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-dark-900 border-2 border-gray-700 rounded-xl overflow-hidden shadow-xl">
                        <input
                          type="date"
                          value={formData.checkin}
                          onChange={(e) => {
                            const selected = e.target.value
                            if (isDateBooked(selected)) {
                              toast.error('That check-in date is unavailable. Please pick another.')
                              return
                            }
                            setFormData(prev => ({
                              ...prev,
                              checkin: selected,
                              checkout: ''
                            }))
                          }}
                          min={today}
                          className="w-full bg-dark-800 border-b-2 border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                        />
                        {formData.checkin && (
                          <div className="p-3 bg-dark-800 border-b border-gray-700">
                            <p className="text-sm text-gray-300">
                              Selected: <span className="text-gold-400 font-semibold">
                                {new Date(formData.checkin).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </p>
                          </div>
                        )}
                        {bookedDates.length > 0 && (
                          <div className="p-3 bg-yellow-900/20 border-b border-yellow-700/30">
                            <p className="text-xs text-yellow-400 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Some dates are booked for this apartment (unavailable dates cannot be selected)
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {errors.checkin && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.checkin}
                      </p>
                    )}
                  </div>
                  <div ref={checkoutRef}>
                    <label className="block text-gold-400 font-semibold mb-3 text-base">
                      Check-out Date *
                    </label>
                    {!formData.checkin ? (
                      <div className="w-full bg-dark-900/50 border-2 border-dashed border-gray-600 rounded-xl px-6 py-8 text-center">
                        <CalendarIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Select check-in date first</p>
                      </div>
                    ) : (
                      <div className="w-full bg-dark-900 border-2 border-gray-700 rounded-xl overflow-hidden shadow-xl">
                        <input
                          type="date"
                          value={formData.checkout}
                          onChange={(e) => {
                            const selected = e.target.value
                            if (isDateBooked(selected)) {
                              toast.error('That check-out date is unavailable. Please pick another.')
                              return
                            }
                            setFormData(prev => ({
                              ...prev,
                              checkout: selected
                            }))
                          }}
                          min={getCheckoutMinDate(formData.checkin)}
                          className="w-full bg-dark-800 border-b-2 border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                        />
                        {formData.checkout && (
                          <div className="p-3 bg-dark-800">
                            <p className="text-sm text-gray-300">
                              Selected: <span className="text-gold-400 font-semibold">
                                {new Date(formData.checkout).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {errors.checkout && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
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
                    ref={guestsRef}
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
                      ref={nameRef}
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
                      ref={emailRef}
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
                    ref={phoneRef}
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
                    placeholder="e.g., +234 811 038 2179"
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
                      <CalendarIcon className="w-5 h-5 text-gold-400 mr-2" />
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
                    <p className="text-gray-300">+234 811 038 2179</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                    <Image
                      src="/whatsapp-black.svg"
                      alt="WhatsApp"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">WhatsApp</h3>
                    <p className="text-gray-300">+234 902 842 5896</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <p className="text-gray-300">info@cosignatureshomes.com</p>
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
