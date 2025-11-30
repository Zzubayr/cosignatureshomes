import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, reference, callback_url, metadata } = body

    // Validate required fields
    if (!amount || !email || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, email, reference' },
        { status: 400 }
      )
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        reference,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: "Booking Reference",
              variable_name: "booking_reference",
              value: reference
            }
          ]
        }
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize payment' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paystackData.data,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
