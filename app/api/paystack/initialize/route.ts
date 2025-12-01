import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { calculatePricing } from '@/lib/pricing'

export async function POST(request: NextRequest) {
    try {
        const { email, reference, metadata, bookingDetails, customer } = await request.json()
        const metadataObj: Record<string, any> = metadata || {}

        if (!email || !reference) {
            return NextResponse.json({ error: 'Email and reference are required' }, { status: 400 })
        }

        // Server-side availability check
        if (bookingDetails) {
            const { company, property: propertyFromClient, apartment, checkin, checkout } = bookingDetails
            const property = propertyFromClient || company

            if (property && apartment && checkin && checkout) {
                const pricing = calculatePricing(property, apartment, checkin, checkout)
                if (!pricing) {
                    return NextResponse.json({ error: 'Unable to calculate pricing for selected apartment' }, { status: 400 })
                }

                const bookingsRef = collection(db, 'bookings')
                const q = query(
                    bookingsRef,
                    where('property', '==', property),
                    where('apartment', '==', apartment),
                    where('status', 'in', ['confirmed', 'pending'])
                )

                const querySnapshot = await getDocs(q)
                const checkinDate = new Date(checkin)
                const checkoutDate = new Date(checkout)

                let isBooked = false

                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    if (data.checkIn && data.checkOut) {
                        const bookingStart = data.checkIn.toDate()
                        const bookingEnd = data.checkOut.toDate()

                        // Treat checkout as exclusive so a new guest can check in on the same day another checks out
                        if (checkinDate < bookingEnd && checkoutDate > bookingStart) {
                            isBooked = true
                        }
                    }
                })

                if (isBooked) {
                    return NextResponse.json({
                        error: 'Selected dates are no longer available. Please choose different dates.'
                    }, { status: 400 })
                }

                // Prepare metadata to be echoed back on verification
                metadataObj.bookingPayload = {
                    property,
                    apartment,
                    checkin,
                    checkout,
                    guests: bookingDetails.guests,
                    message: bookingDetails.message || '',
                    userId: bookingDetails.userId,
                    name: customer?.name,
                    email,
                    phone: customer?.phone,
                    totalAmount: pricing.totalAmount
                }

                // Override amount using trusted pricing
                metadataObj.amount = pricing.totalAmount
            }
        }

        // Amount already includes Paystack fees from frontend calculation
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking/payment/callback`

        console.log('Initializing Paystack payment with callback URL:', callbackUrl)

        const amountToCharge = metadataObj?.amount
        if (!amountToCharge) {
            return NextResponse.json({ error: 'Calculated amount missing' }, { status: 400 })
        }

        const paystackData = {
            email,
            amount: amountToCharge * 100, // Paystack expects amount in kobo
            reference,
            currency: 'NGN',
            callback_url: callbackUrl,
            metadata: metadataObj
        }

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paystackData),
        })

        const result = await response.json()

        if (!response.ok) {
            console.error('Paystack initialization error:', result)
            return NextResponse.json({ error: 'Payment initialization failed' }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            data: {
                authorization_url: result.data.authorization_url,
                access_code: result.data.access_code,
                reference: result.data.reference
            }
        })

    } catch (error) {
        console.error('Payment initialization error:', error)
        return NextResponse.json(
            { error: 'Failed to initialize payment' },
            { status: 500 }
        )
    }
}
