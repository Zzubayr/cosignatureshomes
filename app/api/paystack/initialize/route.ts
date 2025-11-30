import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { email, amount, reference, metadata } = await request.json()

        if (!email || !amount || !reference) {
            return NextResponse.json({ error: 'Email, amount, and reference are required' }, { status: 400 })
        }

        // Amount already includes Paystack fees from frontend calculation
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking/payment/callback`

        console.log('Initializing Paystack payment with callback URL:', callbackUrl)

        const paystackData = {
            email,
            amount: amount * 100, // Paystack expects amount in kobo
            reference,
            currency: 'NGN',
            callback_url: callbackUrl,
            metadata
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
