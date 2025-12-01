import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Get booking details
    const bookingRef = doc(db, 'bookings', bookingId)
    const bookingSnap = await getDoc(bookingRef)

    if (!bookingSnap.exists()) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const booking = bookingSnap.data()

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json({ error: 'Email configuration missing on server' }, { status: 500 })
    }

    // Update status
    await updateDoc(bookingRef, {
      status: 'confirmed',
      confirmedAt: new Date()
    })

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Normalize dates from Firestore Timestamp or Date
    const resolveDate = (value: any) => {
      if (!value) return ''
      if (typeof value.toDate === 'function') return value.toDate()
      return new Date(value)
    }

    const checkInDate = resolveDate(booking.checkIn)
    const checkOutDate = resolveDate(booking.checkOut)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmed - CO Signatures Homes</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F5A623, #dd941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
          .highlight { color: #F5A623; font-weight: bold; }
          .confirmed-badge { background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CO Signatures Homes</div>
            <h1>🎉 Booking Confirmed</h1>
            <div class="confirmed-badge">✅ CONFIRMED</div>
          </div>
          
          <div class="content">
            <h2>Dear ${booking.userName},</h2>
            
            <p>Great news! Your booking has been confirmed by our team.</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <p><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingReference}</span></p>
              <p><strong>Property:</strong> ${booking.propertyName}</p>
              <p><strong>Apartment:</strong> ${booking.apartmentName}</p>
              <p><strong>Check-in:</strong> ${checkInDate.toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${checkOutDate.toLocaleDateString()}</p>
            </div>

            <h3>Check-in Instructions</h3>
            <p>Our concierge team will be expecting you. Please present your booking reference upon arrival.</p>
            <p>Check-in time is from 2:00 PM.</p>
            
            <div class="footer">
              <p><strong>CO Signatures Homes</strong></p>
              <p>Phone: +2348110382179</p>
              <p>WhatsApp: +234 902 842 5896</p>
              <p>Email: info@cosignatureshomes.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    const mailResult = await transporter.sendMail({
      from: `"CO Signatures Homes" <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: `Booking Confirmed - ${booking.bookingReference}`,
      html: emailHtml,
    })

    console.log('Confirmation email sent:', mailResult?.messageId)

    return NextResponse.json({ success: true, emailSent: true })
  } catch (error) {
    console.error('Error confirming booking:', error)
    return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 })
  }
}
