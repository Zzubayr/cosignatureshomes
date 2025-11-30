import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { reference } = await request.json()

        if (!reference) {
            return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 })
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        })

        const result = await response.json()

        if (!response.ok) {
            console.error('Paystack verification error:', result)
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
        }

        const { data } = result

        if (data.status === 'success') {
            return NextResponse.json({
                success: true,
                data: {
                    status: data.status,
                    reference: data.reference,
                    amount: data.amount / 100, // Convert from kobo to naira
                    customer: data.customer,
                    metadata: data.metadata,
                    paid_at: data.paid_at,
                    channel: data.channel,
                    currency: data.currency
                }
            })
        } else {
            return NextResponse.json({
                success: false,
                message: 'Payment was not successful',
                status: data.status
            }, { status: 400 })
        }

    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        )
    }
}
