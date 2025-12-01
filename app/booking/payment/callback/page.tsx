'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const verificationAttempted = useRef(false)

  useEffect(() => {
    // Prevent duplicate verification in development (React StrictMode)
    if (verificationAttempted.current) return
    
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    
    if (reference || trxref) {
      verificationAttempted.current = true
      verifyPayment((reference || trxref) as string)
    } else {
      setStatus('failed')
    }
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      console.log('Starting payment verification for reference:', reference)
      
      // Verify payment with Paystack through our backend
      const verifyResponse = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      })

      const verifyResult = await verifyResponse.json()
      console.log('Payment verification result:', verifyResult)

      if (!verifyResult.success) {
        console.error('Payment verification failed:', verifyResult)
        setStatus('failed')
        return
      }

      setPaymentData(verifyResult.data)

      // Create booking server-side using trusted payment metadata
      const bookingResponse = await fetch('/api/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      })

      const bookingResult = await bookingResponse.json()
      console.log('Booking creation result:', bookingResult)

      if (bookingResult.success) {
        setBookingData(bookingResult)
        setStatus('success')
      } else {
        console.error('Booking creation failed:', bookingResult.error)
        setStatus('failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setStatus('failed')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-gold-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Verifying Payment</h2>
          <p className="text-gray-400">Please wait while we confirm your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-900 rounded-lg p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-300 mb-6">
            Your booking has been confirmed and payment processed successfully.
          </p>
          
          {paymentData && (
            <div className="bg-dark-800 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-gold-400 font-semibold mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Reference:</span>
                  <span className="text-white">{paymentData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">₦{paymentData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Channel:</span>
                  <span className="text-white">{paymentData.channel}</span>
                </div>
              </div>
            </div>
          )}

          {bookingData && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-green-400 font-semibold mb-3">Booking Confirmed</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking Reference:</span>
                  <span className="text-white font-semibold">{bookingData.reference}</span>
                </div>
                <p className="text-gray-300 text-xs mt-2">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/profile"
              className="block w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View My Bookings
            </Link>
            <Link
              href="/"
              className="block w-full bg-dark-800 hover:bg-dark-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-900 rounded-lg p-8 text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
        <p className="text-gray-300 mb-6">
          We couldn't process your payment. Please try again or contact support.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/booking"
            className="block w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="block w-full bg-dark-800 hover:bg-dark-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
