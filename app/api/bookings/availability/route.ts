import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const company = searchParams.get('company')
        const property = searchParams.get('property') || company
        const apartment = searchParams.get('apartment')

        if (!property || !apartment) {
            return NextResponse.json(
                { error: 'Property and apartment parameters are required' },
                { status: 400 }
            )
        }

        // Query bookings for this specific apartment that are confirmed or pending
        const bookingsRef = collection(db, 'bookings')
        const q = query(
            bookingsRef,
            where('property', '==', property),
            where('apartment', '==', apartment),
            where('status', 'in', ['confirmed', 'pending'])
        )

        const querySnapshot = await getDocs(q)
        const bookedDates: { start: string; end: string }[] = []

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            if (data.checkIn && data.checkOut) {
                // Convert Firestore timestamps to date strings
                const checkIn = data.checkIn.toDate()
                const checkOut = data.checkOut.toDate()

                bookedDates.push({
                    start: checkIn.toISOString().split('T')[0],
                    end: checkOut.toISOString().split('T')[0] // treated as exclusive on the client
                })
            }
        })

        return NextResponse.json({
            success: true,
            bookedDates
        })

    } catch (error) {
        console.error('Error fetching availability:', error)
        return NextResponse.json(
            { error: 'Failed to fetch availability' },
            { status: 500 }
        )
    }
}
