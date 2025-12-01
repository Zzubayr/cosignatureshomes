import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Contact email template
const createContactEmailTemplate = (contactData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Message - CO Signatures Homes</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #F5A623; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .urgent { background: #fff3cd; border-left-color: #ffc107; }
        .logo { font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CO SIGNATURES HOMES</div>
          <h1>📧 New Contact Message</h1>
        </div>
        <div class="content">
          <div class="message-details urgent">
            <h3>⚡ New Message Received</h3>
            <p>A new contact message has been submitted through the website.</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="message-details">
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            ${contactData.subject ? `<p><strong>Subject:</strong> ${contactData.subject}</p>` : ''}
          </div>

          <div class="message-details">
            <h3>Message</h3>
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>

          <div class="message-details">
            <h3>Next Steps</h3>
            <ul>
              <li>Reply to the customer within 24 hours</li>
              <li>Address their inquiry or concern</li>
              <li>Follow up if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Auto-reply template for customer
const createAutoReplyTemplate = (contactData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You - CO Signatures Homes</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F5A623, #dd941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F5A623; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .logo { font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CO SIGNATURES HOMES</div>
          <h1>Thank You for Contacting Us!</h1>
        </div>
        <div class="content">
          <h2>Dear ${contactData.name},</h2>
          <p>Thank you for reaching out to CO Signatures Homes! We have received your message and appreciate you taking the time to contact us.</p>
          
          <div class="message-details">
            <h3>Your Message Details</h3>
            ${contactData.subject ? `<p><strong>Subject:</strong> ${contactData.subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; font-style: italic;">"${contactData.message}"</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="message-details">
            <h3>What Happens Next?</h3>
            <ul>
              <li>Our team will review your message carefully</li>
              <li>We'll respond to you within 24 hours</li>
              <li>If urgent, feel free to call us at +2348110384179</li>
            </ul>
          </div>

          <p>We look forward to assisting you!</p>
          
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
}

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'email', 'message']
    const missingFields = requiredFields.filter(field => !contactData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactData.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const transporter = createTransporter()

    // Send notification email to admin
    const adminMailOptions = {
      from: `"CO Signatures Homes Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `📧 New Contact Message${contactData.subject ? ` - ${contactData.subject}` : ''} | From: ${contactData.name}`,
      html: createContactEmailTemplate(contactData),
    }

    // Send auto-reply to customer
    const customerMailOptions = {
      from: `"CO Signatures Homes" <${process.env.EMAIL_USER}>`,
      to: contactData.email,
      subject: `Thank you for contacting CO Signatures Homes${contactData.subject ? ` - Re: ${contactData.subject}` : ''}`,
      html: createAutoReplyTemplate(contactData),
    }

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ])

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We have received it and will get back to you within 24 hours.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
