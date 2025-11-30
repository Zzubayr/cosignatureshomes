import { Timestamp } from 'firebase/firestore'

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  role: 'user' | 'admin'
  phone?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  emailUpdates: boolean
  theme: 'light' | 'dark'
}

export interface Booking {
  id: string
  userId: string
  userEmail: string
  userName: string
  userPhone: string
  
  // Property details
  property: 'pa-cladius' | 'cladius-elite' | 'omolaja-flats'
  apartment: string
  propertyName: string
  apartmentName: string
  
  // Booking details
  checkIn: Date
  checkOut: Date
  guests: number
  nights: number
  
  // Pricing
  basePrice: number
  taxes: number
  fees: number
  totalAmount: number
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentReference: string
  paymentMethod: 'paystack'
  
  // Status
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  
  // Additional info
  specialRequests?: string
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // References
  bookingReference: string
}

export interface Payment {
  id: string
  bookingId: string
  userId: string
  amount: number
  currency: 'NGN'
  status: 'pending' | 'success' | 'failed'
  paymentMethod: 'paystack'
  reference: string
  paystackReference?: string
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  id: string
  name: string
  slug: string
  description: string
  location: string
  images: string[]
  amenities: string[]
  status: 'available' | 'coming-soon' | 'maintenance'
  apartments: Apartment[]
}

export interface Apartment {
  id: string
  name: string
  type: string
  description: string
  maxGuests: number
  basePrice: number
  images: string[]
  amenities: string[]
  available: boolean
}

export interface BookingFormData {
  property: string
  apartment: string
  checkIn: string
  checkOut: string
  guests: string
  specialRequests?: string
}

export interface PaymentData {
  amount: number
  email: string
  reference: string
  callback_url?: string
  metadata?: {
    bookingId: string
    userId: string
    [key: string]: any
  }
}

// Firestore document types (with Timestamp)
export interface BookingDocument extends Omit<Booking, 'checkIn' | 'checkOut' | 'createdAt' | 'updatedAt'> {
  checkIn: Timestamp
  checkOut: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PaymentDocument extends Omit<Payment, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp
  updatedAt: Timestamp
}
