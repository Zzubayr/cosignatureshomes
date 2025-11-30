import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { booking } = await request.json()

    if (!booking) {
      return NextResponse.json({ error: 'Booking data is required' }, { status: 400 })
    }

    // Send confirmation email to customer
    const customerEmailHtml = generateCustomerConfirmationEmail(booking)

    await transporter.sendMail({
      from: `"CO Signature Homes" <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: `Booking Confirmed - ${booking.bookingReference}`,
      html: customerEmailHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully'
    })

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}

function generateCustomerConfirmationEmail(booking: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmed - CO Signature Homes</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F5A623, #dd941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .logo { font-size: 24px; font-weight: bold; }
        .highlight { color: #F5A623; font-weight: bold; }
        .success-badge { background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        .important-info { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CO Signature Homes</div>
          <h1>🎉 Booking Confirmed!</h1>
          <div class="success-badge">✅ CONFIRMED</div>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.userName},</h2>
          
          <p>Great news! Your booking has been <strong>confirmed</strong> by our team. We're excited to host you at our luxury serviced apartment.</p>
          
          <div class="booking-details">
            <h3>📋 Your Booking Details</h3>
            <p><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingReference}</span></p>
            <p><strong>Property:</strong> ${booking.propertyName}</p>
            <p><strong>Apartment:</strong> ${booking.apartmentName}</p>
            <p><strong>Guest Name:</strong> ${booking.userName}</p>
            <p><strong>Email:</strong> ${booking.userEmail}</p>
            <p><strong>Phone:</strong> ${booking.userPhone}</p>
            <p><strong>Number of Guests:</strong> ${booking.guests}</p>
            <p><strong>Check-in Date:</strong> ${booking.checkIn.toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> ${booking.checkOut.toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${booking.nights} night${booking.nights > 1 ? 's' : ''}</p>
            <p><strong>Total Amount:</strong> <span class="highlight">₦${booking.totalAmount.toLocaleString()}</span></p>
            ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          </div>

          <div class="important-info">
            <h3>📍 Property Address</h3>
            <p><strong>Alatishe, Phase 2, Ile Ayo<br>
            Ilesha, Osun State, Nigeria</strong></p>
          </div>

          <div class="important-info">
            <h3>⏰ Check-in Information</h3>
            <ul>
              <li><strong>Check-in Time:</strong> 2:00 PM onwards</li>
              <li><strong>Check-out Time:</strong> 12:00 PM</li>
              <li><strong>Valid ID Required:</strong> Please bring government-issued identification</li>
              <li>Contact on Arrival: +2348110384179</li>
            </ul>
          </div>

          <div class="important-info">
            <h3>💳 Payment Information</h3>
            <p>Our team will contact you within 24 hours with payment instructions and final details. Payment can be made via:</p>
            <ul>
              <li>Bank Transfer</li>
              <li>Online Payment</li>
              <li>Cash on Arrival (subject to availability)</li>
            </ul>
          </div>

          <div class="booking-details">
            <h3>📋 Important Reminders</h3>
            <ul>
              <li>No smoking indoors</li>
              <li>No parties or loud gatherings</li>
              <li>24/7 CCTV surveillance in common areas</li>
              <li>Damage charges may apply for property damage</li>
              <li>Cancellation must be made 48 hours prior to avoid charges</li>
            </ul>
          </div>

          <h3>What's Next?</h3>
          <ul>
            <li>✅ Your booking is confirmed</li>
            <li>📞 Our team will contact you for payment details</li>
            <li>📧 You'll receive payment confirmation once processed</li>
            <li>🏠 Enjoy your luxury stay with us!</li>
          </ul>

          <p>If you have any questions or need to make changes to your booking, please contact us immediately.</p>
          
          <p>We look forward to providing you with an exceptional stay!</p>
          
          <div class="footer">
            <p><strong>CO Signature Homes</strong></p>
            <p>Phone: +2348110384179</p>
            <p>Email: info@cosignaturehomes.com</p>
            <p>Premium serviced apartments across Nigeria</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
