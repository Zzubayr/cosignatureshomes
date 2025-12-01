import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
    },
  })
}

// Email templates
const createCustomerEmailTemplate = (bookingData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - CO Signatures Homes</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F5A623, #dd941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .logo { font-size: 24px; font-weight: bold; }
        .highlight { color: #F5A623; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CO SIGNATURES HOMES</div>
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <h2>Dear ${bookingData.name},</h2>
          <p>Thank you for choosing CO Signatures Homes! We're delighted to confirm your booking request.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Property:</strong> ${bookingData.companyName}</p>
            <p><strong>Apartment:</strong> ${bookingData.apartmentName}</p>
            <p><strong>Check-in:</strong> <span class="highlight">${bookingData.checkin}</span></p>
            <p><strong>Check-out:</strong> <span class="highlight">${bookingData.checkout}</span></p>
            <p><strong>Guests:</strong> ${bookingData.guests}</p>
            <p><strong>Booking Reference:</strong> <span class="highlight">${bookingData.reference}</span></p>
          </div>

          <div class="booking-details">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
            ${bookingData.message ? `<p><strong>Special Requests:</strong> ${bookingData.message}</p>` : ''}
          </div>

          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Our team will review your booking and contact you within 24 hours</li>
            <li>You'll receive payment instructions and final confirmation</li>
            <li>Feel free to contact us if you have any questions</li>
          </ul>

          <p>We look forward to hosting you!</p>
          
          <div class="footer">
            <p><strong>CO Signatures Homes</strong></p>
            <p>Phone: +2348110382179</p>
            <p>Email: info@cosignatureshomes.com</p>
            <p>Premium serviced apartments across Nigeria</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

const createAdminEmailTemplate = (bookingData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Request - CO Signatures Homes</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #F5A623; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .urgent { background: #fff3cd; border-left-color: #ffc107; }
        .logo { font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CO SIGNATURES HOMES</div>
          <h1>🔔 New Booking Request</h1>
        </div>
        <div class="content">
          <div class="booking-details urgent">
            <h3>⚡ Action Required</h3>
            <p>A new booking request has been submitted and requires your attention.</p>
            <p><strong>Booking Reference:</strong> ${bookingData.reference}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="booking-details">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
          </div>

          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Property:</strong> ${bookingData.companyName}</p>
            <p><strong>Apartment:</strong> ${bookingData.apartmentName}</p>
            <p><strong>Check-in:</strong> ${bookingData.checkin}</p>
            <p><strong>Check-out:</strong> ${bookingData.checkout}</p>
            <p><strong>Guests:</strong> ${bookingData.guests}</p>
            <p><strong>Duration:</strong> ${bookingData.nights} night(s)</p>
          </div>

          ${bookingData.message ? `
          <div class="booking-details">
            <h3>Special Requests</h3>
            <p>${bookingData.message}</p>
          </div>
          ` : ''}

          <div class="booking-details">
            <h3>Next Steps</h3>
            <ul>
              <li>Review booking details and availability</li>
              <li>Contact customer within 24 hours</li>
              <li>Send payment instructions if confirmed</li>
              <li>Update booking status in system</li>
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'company', 'apartment', 'checkin', 'checkout', 'guests']
    const missingFields = requiredFields.filter(field => !bookingData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate booking reference
    const reference = `CO${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

    // Calculate nights
    const checkinDate = new Date(bookingData.checkin)
    const checkoutDate = new Date(bookingData.checkout)
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))

    // Get company and apartment names
    const companies = {
      'pa-claudius': 'Pa Claudius Apartments',
      'claudius-elite': 'Claudius Elite Lofts',
      'omolaja-flats': 'Omolaja Flats'
    }

    const apartments = {
      'pa-claudius': {
        'premium-3bedroom': 'Premium 3-Bedroom Ensuite Apartment (Unit 1)',
        'executive-3bedroom': 'Executive 3-Bedroom Ensuite Apartment (Unit 2)',
        'deluxe-1bedroom': 'Deluxe 1-Bedroom Ensuite Apartment (Unit 3)'
      },
      'claudius-elite': {
        'coming-soon': 'Coming Soon - Premium Lofts'
      },
      'omolaja-flats': {
        'coming-soon': 'Coming Soon - Comfortable Flats'
      }
    }

    const enrichedBookingData = {
      ...bookingData,
      reference,
      nights,
      companyName: companies[bookingData.company as keyof typeof companies] || bookingData.company,
      apartmentName: (apartments as any)[bookingData.company]?.[bookingData.apartment] || bookingData.apartment
    }

    const transporter = createTransporter()

    // Send confirmation email to customer
    const customerMailOptions = {
      from: `"CO Signatures Homes" <${process.env.EMAIL_USER}>`,
      to: bookingData.email,
      subject: `Booking Confirmation - ${enrichedBookingData.companyName} | Ref: ${reference}`,
      html: createCustomerEmailTemplate(enrichedBookingData),
    }

    // Send notification email to admin
    const adminMailOptions = {
      from: `"CO Signatures Homes Bookings" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🔔 New Booking Request - ${enrichedBookingData.companyName} | Ref: ${reference}`,
      html: createAdminEmailTemplate(enrichedBookingData),
    }

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ])

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully! Check your email for confirmation.',
      reference: reference
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking request. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
