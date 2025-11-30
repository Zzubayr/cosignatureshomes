import { PaymentData } from './types'

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export class PaystackService {
  private publicKey: string
  private secretKey: string

  constructor() {
    this.publicKey = PAYSTACK_PUBLIC_KEY || ''
    this.secretKey = PAYSTACK_SECRET_KEY || ''
  }

  // Initialize payment on frontend
  async initializePayment(paymentData: PaymentData) {
    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize payment')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment initialization error:', error)
      throw error
    }
  }

  // Verify payment
  async verifyPayment(reference: string) {
    try {
      const response = await fetch(`/api/payment/verify?reference=${reference}`)
      
      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment verification error:', error)
      throw error
    }
  }

  // Open Paystack popup (client-side)
  openPaystackPopup(config: {
    key: string
    email: string
    amount: number
    reference: string
    callback: (response: any) => void
    onClose: () => void
    metadata?: any
  }) {
    // This will be called on the client side
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      const handler = (window as any).PaystackPop.setup(config)
      handler.openIframe()
    } else {
      console.error('Paystack script not loaded')
    }
  }

  // Calculate fees (Paystack charges)
  calculateFees(amount: number): { fees: number; total: number } {
    // Paystack charges 1.5% + NGN 100 for local cards
    // 3.9% for international cards
    const percentage = 0.015 // 1.5% for local cards
    const fixedFee = 100 // NGN 100
    
    let fees = (amount * percentage) + fixedFee
    
    // Cap at NGN 2,000
    if (fees > 2000) {
      fees = 2000
    }

    return {
      fees: Math.round(fees),
      total: amount + Math.round(fees)
    }
  }

  // Generate payment reference
  generateReference(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `CO_${timestamp}_${random}`
  }
}

export const paystackService = new PaystackService()
