/**
 * Centralized Pricing Configuration for CO Signature Homes
 * 
 * This module contains all pricing logic, apartment configurations,
 * and fee calculations to ensure consistency across the application.
 */

export interface ApartmentConfig {
  value: string
  label: string
  nightlyRate: number
  bedrooms: number
}

export interface PropertyConfig {
  name: string
  apartments: ApartmentConfig[]
}

export interface PricingBreakdown {
  nights: number
  nightlyRate: number
  basePrice: number
  taxes: number
  serviceFee: number
  subtotal: number
  paystackFee: number
  totalAmount: number
  discount: number
}

// Property and Apartment Configurations
export const PROPERTIES: Record<string, PropertyConfig> = {
  'pa-claudius': {
    name: 'Pa Claudius Apartments',
    apartments: [
      {
        value: 'premium-3bedroom',
        label: 'Premium 3-Bedroom Ensuite Apartment (Unit 1)',
        nightlyRate: 165000,
        bedrooms: 3
      },
      {
        value: 'executive-3bedroom',
        label: 'Executive 3-Bedroom Ensuite Apartment (Unit 2)',
        nightlyRate: 165000,
        bedrooms: 3
      },
      {
        value: 'deluxe-1bedroom',
        label: 'Deluxe 1-Bedroom Ensuite Apartment (Unit 3)',
        nightlyRate: 80000,
        bedrooms: 1
      }
    ]
  }
}

// Fee Constants
export const FEES = {
  PAYSTACK_RATE: 0.015, // 1.5% Paystack fee
  PAYSTACK_FIXED: 10000 // ₦100 fixed Paystack fee
}

// Discount Tiers
export const DISCOUNTS = {
  WEEKLY: { minNights: 7, rate: 0.05 }, // 5% for 7+ nights
  MONTHLY: { minNights: 30, rate: 0.1 } // 10% for 30+ nights
}

/**
 * Get nightly rate for a specific apartment
 */
export function getNightlyRate(property: string, apartment: string): number {
  const propertyConfig = PROPERTIES[property]
  if (!propertyConfig) return 0 // Unknown property

  const apartmentConfig = propertyConfig.apartments.find(apt => apt.value === apartment)
  return apartmentConfig?.nightlyRate || 0
}

/**
 * Calculate discount percentage based on number of nights
 */
export function calculateDiscount(nights: number): number {
  if (nights >= DISCOUNTS.MONTHLY.minNights) return DISCOUNTS.MONTHLY.rate
  if (nights >= DISCOUNTS.WEEKLY.minNights) return DISCOUNTS.WEEKLY.rate
  return 0
}

/**
 * Calculate complete pricing breakdown for a booking
 */
export function calculatePricing(
  property: string,
  apartment: string,
  checkin: string,
  checkout: string
): PricingBreakdown | null {
  if (!property || !apartment || !checkin || !checkout) return null
  const nightlyRate = getNightlyRate(property, apartment)
  if (!nightlyRate) return null

  const checkInDate = new Date(checkin)
  const checkOutDate = new Date(checkout)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  if (nights <= 0) return null

  const discount = calculateDiscount(nights)

  const basePrice = Math.round(nightlyRate * nights * (1 - discount))
  const taxes = Math.round(basePrice * 0.075) // 7.5% VAT

  // Calculate Paystack fee first (before adding service fee)
  const preliminarySubtotal = basePrice + taxes
  const paystackFee = Math.round(preliminarySubtotal * FEES.PAYSTACK_RATE) + FEES.PAYSTACK_FIXED

  // Include Paystack fee in service fee (hidden from user)
  const serviceFee = 5000 + paystackFee
  const subtotal = basePrice + taxes + serviceFee
  const totalAmount = subtotal

  return {
    nights,
    nightlyRate,
    basePrice,
    taxes,
    serviceFee,
    subtotal,
    paystackFee, // Still returned for backend use
    totalAmount,
    discount: discount * 100 // Convert to percentage
  }
}

/**
 * Get property and apartment display names
 */
export function getPropertyDetails(property: string, apartment: string): {
  propertyName: string
  apartmentName: string
} {
  const propertyConfig = PROPERTIES[property]

  if (!propertyConfig) {
    return {
      propertyName: 'Unknown Property',
      apartmentName: 'Unknown Apartment'
    }
  }

  const apartmentConfig = propertyConfig.apartments.find(apt => apt.value === apartment)

  return {
    propertyName: propertyConfig.name,
    apartmentName: apartmentConfig?.label || 'Unknown Apartment'
  }
}

/**
 * Get all apartments for a property
 */
export function getApartmentsForProperty(property: string): ApartmentConfig[] {
  const propertyConfig = PROPERTIES[property]
  return propertyConfig?.apartments || []
}
