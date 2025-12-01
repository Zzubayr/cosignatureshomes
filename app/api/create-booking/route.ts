import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { calculatePricing, getPropertyDetails } from '@/lib/pricing'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

function generateBookingReference(): string {
  const prefix = 'CSH'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 })
    }

    // Verify payment directly with Paystack to retrieve trusted metadata
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const verifyResult = await verifyResponse.json()

    if (!verifyResponse.ok || verifyResult.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const paymentData = verifyResult.data
    const bookingPayload = paymentData.metadata?.bookingPayload

    if (!bookingPayload) {
      return NextResponse.json({ error: 'Missing booking details from payment metadata' }, { status: 400 })
    }

    const {
      property,
      apartment,
      checkin,
      checkout,
      guests,
      message,
      userId,
      name,
      email,
      phone
    } = bookingPayload

    if (!userId || !property || !apartment || !checkin || !checkout || !guests || !name || !email || !phone) {
      return NextResponse.json({ error: 'Incomplete booking details' }, { status: 400 })
    }

    // Recalculate pricing to ensure it matches payment amount
    const pricingDetails = calculatePricing(property, apartment, checkin, checkout)

    if (!pricingDetails) {
      return NextResponse.json({ error: 'Unable to calculate pricing' }, { status: 400 })
    }

    const paidAmount = paymentData.amount / 100
    if (pricingDetails.totalAmount !== paidAmount) {
      return NextResponse.json({ error: 'Paid amount does not match booking total' }, { status: 400 })
    }

    // Parse dates
    const checkInDate = new Date(checkin)
    const checkOutDate = new Date(checkout)

    // Validate dates - allow same-day bookings
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return NextResponse.json({ error: 'Check-in date cannot be in the past' }, { status: 400 })
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Check-out date must be after check-in date' }, { status: 400 })
    }

    const { nights, basePrice, taxes, serviceFee, subtotal, paystackFee, totalAmount } = pricingDetails

    // Generate booking reference
    const bookingReference = generateBookingReference()

    // Get property and apartment names from shared module
    const { propertyName, apartmentName } = getPropertyDetails(property, apartment)

    // Create booking object for emails
    const booking = {
      userEmail: email,
      userName: name,
      userPhone: phone,
      property,
      apartment,
      propertyName,
      apartmentName,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      nights,
      basePrice,
      taxes,
      serviceFee,
      paystackFee,
      subtotal,
      totalAmount,
      paymentReference: reference,
      userId,
      specialRequests: message || null,
      bookingReference,
      createdAt: new Date()
    }

    // Create booking in Firestore
    await addDoc(collection(db, 'bookings'), {
      userId,
      userEmail: email,
      userName: name,
      userPhone: phone,

      property,
      apartment,
      propertyName,
      apartmentName,

      checkIn: Timestamp.fromDate(checkInDate),
      checkOut: Timestamp.fromDate(checkOutDate),
      guests: parseInt(guests),
      nights,

      basePrice,
      taxes,
      serviceFee,
      paystackFee,
      subtotal,
      totalAmount,

      paymentStatus: 'paid',
      paymentReference: reference,
      paymentMethod: 'paystack',

      status: 'pending', // Admin will confirm
      specialRequests: message || '',

      bookingReference,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    // Send emails
    await Promise.all([
      sendCustomerEmail(booking),
      sendAdminNotification(booking)
    ])

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully! We will contact you within 24 hours.',
      reference: bookingReference
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to submit booking request. Please try again.' },
      { status: 500 }
    )
  }
}



async function sendCustomerEmail(booking: any) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Request Received - CO Signatures Homes</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F5A623, #dd941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .logo { font-size: 24px; font-weight: bold; }
        .highlight { color: #F5A623; font-weight: bold; }
        .pending-badge { background: #F59E0B; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CO Signatures Homes</div>
          <h1>✅ Payment Received</h1>
          <div class="pending-badge">⏳ PENDING ADMIN REVIEW</div>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.userName},</h2>
          
          <p>Thank you for your payment! We have received your booking request and our team will review it shortly.</p>
          
          <div class="booking-details">
            <h3>📋 Your Booking Request</h3>
            <p><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingReference}</span></p>
            <p><strong>Property:</strong> ${booking.propertyName}</p>
            <p><strong>Apartment:</strong> ${booking.apartmentName}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Duration:</strong> ${booking.nights} night${booking.nights > 1 ? 's' : ''}</p>
            <p><strong>Estimated Total:</strong> <span class="highlight">₦${booking.totalAmount.toLocaleString()}</span></p>
            <p><strong>Payment Status:</strong> <span class="highlight">PAID</span></p>
            <p><strong>Payment Reference:</strong> ${booking.paymentReference}</p>
            ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          </div>

          <h3>What Happens Next?</h3>
          <ul>
            <li>📧 Our team will review your booking request within 24 hours</li>
            <li>📞 We'll contact you to confirm availability and discuss payment</li>
            <li>✅ Once confirmed, you'll receive detailed check-in information</li>
            <li>🏠 Enjoy your luxury stay with us!</li>
          </ul>

          <p><strong>Important:</strong> Your booking is not yet confirmed. We will contact you shortly to finalize the details.</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <div class="footer">
            <p><strong>CO Signatures Homes</strong></p>
            <p>Phone: +2348110384179</p>
            <p>Email: info@cosignatureshomes.com</p>
            <p>Premium serviced apartments across Nigeria</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"CO Signature Homes" <${process.env.EMAIL_USER}>`,
    to: booking.userEmail,
    subject: `Booking Request Received - ${booking.bookingReference}`,
    html: emailHtml,
  })
}

async function sendAdminNotification(booking: any) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Request - CO Signatures Homes Admin</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #F5A623; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .urgent { background: #fff3cd; border-left-color: #ffc107; }
        .logo { font-size: 24px; font-weight: bold; }
        .action-button { background: #F5A623; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚨 ADMIN ALERT</div>
          <h1>New Paid Booking</h1>
        </div>
        
        <div class="content">
          <div class="booking-details urgent">
            <h3>⚡ Action Required</h3>
            <p>A new booking has been paid for and requires your review.</p>
            <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="booking-details">
            <h3>👤 Guest Information</h3>
            <p><strong>Name:</strong> ${booking.userName}</p>
            <p><strong>Email:</strong> ${booking.userEmail}</p>
            <p><strong>Phone:</strong> ${booking.userPhone}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
          </div>
          
          <div class="booking-details">
            <h3>🏠 Booking Details</h3>
            <p><strong>Property:</strong> ${booking.propertyName}</p>
            <p><strong>Apartment:</strong> ${booking.apartmentName}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${booking.nights} night${booking.nights > 1 ? 's' : ''}</p>
            <p><strong>Total Amount:</strong> ₦${booking.totalAmount.toLocaleString()}</p>
            <p><strong>Payment Status:</strong> PAID</p>
            <p><strong>Payment Reference:</strong> ${booking.paymentReference}</p>
            ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" class="action-button">
              🔗 Review in Admin Dashboard
            </a>
          </div>

          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Log into the admin dashboard to review the booking</li>
            <li>Verify availability and guest requirements</li>
            <li>Confirm or decline the booking</li>
            <li>Contact the guest with payment instructions if confirmed</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"CO Signatures Homes Admin" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 New Booking Request - ${booking.bookingReference}`,
    html: emailHtml,
  })
}
