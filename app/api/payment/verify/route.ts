import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Failed to verify payment' },
        { status: 400 }
      )
    }

    const paymentData = paystackData.data

    return NextResponse.json({
      success: true,
      data: {
        reference: paymentData.reference,
        amount: paymentData.amount / 100, // Convert from kobo
        status: paymentData.status,
        gateway_response: paymentData.gateway_response,
        paid_at: paymentData.paid_at,
        created_at: paymentData.created_at,
        channel: paymentData.channel,
        currency: paymentData.currency,
        customer: paymentData.customer,
        metadata: paymentData.metadata
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
