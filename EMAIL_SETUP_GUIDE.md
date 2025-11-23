# 📧 Email Setup Guide for CO Signature Homes

## 🚀 Quick Setup Instructions

### Step 1: Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → Turn On

2. **Generate App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Copy the generated 16-character password

### Step 2: Environment Variables

1. **Create `.env.local` file** in your project root:
```bash
# Copy from .env.example and fill in your details
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=info@cosignaturehomes.com
```
2. **For Production** (Squarespace or custom domain):
```bash
# When you get your custom domain email
EMAIL_USER=info@cosignaturehomes.com
EMAIL_PASSWORD=your-domain-email-password
ADMIN_EMAIL=info@cosignaturehomes.com
```

### Step 3: Test the System

1. **Start your development server**:
```bash
npm run dev
```

2. **Test booking form**:
   - Go to `/booking`
   - Fill out the form with valid data
   - Submit and check both customer and admin emails

## 🔧 Features Implemented

### ✅ Form Validation
- **Real-time validation** with error messages
- **Date validation**: No past dates, checkout after checkin
- **Email validation**: Proper email format
- **Phone validation**: International format support
- **Guest limits**: 1-10 guests maximum
- **Stay limits**: Maximum 30 days
- **Coming soon properties**: Blocked from booking

### ✅ Email System
- **Customer confirmation**: Professional HTML email with booking details
- **Admin notification**: Detailed booking info with action items
- **Booking reference**: Auto-generated unique reference numbers
- **Error handling**: Graceful failure with user feedback

### ✅ User Experience
- **Loading states**: Spinner during submission
- **Success/Error messages**: Clear feedback
- **Form reset**: Clears after successful submission
- **Responsive design**: Works on all devices
- **Accessibility**: Screen reader friendly

## 📋 Validation Rules

### Required Fields
- Property selection
- Apartment selection  
- Check-in date
- Check-out date
- Number of guests
- Full name
- Email address
- Phone number

### Validation Logic
- **Dates**: Check-in must be today or future, check-out must be after check-in
- **Email**: Must be valid email format
- **Phone**: Must be valid international format
- **Name**: Minimum 2 characters, maximum 50
- **Guests**: Between 1-10 people
- **Stay**: Maximum 30 days
- **Message**: Maximum 500 characters

## 🎯 Email Templates

### Customer Email Features
- **Professional branding** with CO Signature Homes logo styling
- **Complete booking details** with reference number
- **Next steps information** 
- **Contact information**
- **Responsive HTML** design

### Admin Email Features
- **Urgent notification** styling
- **Complete customer information**
- **Booking details** with calculated nights
- **Action items** checklist
- **Professional formatting**

## 🔒 Security Features

- **Environment variables** for sensitive data
- **Input validation** and sanitization
- **Error handling** without exposing system details
- **Rate limiting** ready (can be added)
- **CSRF protection** via Next.js

## 🚀 Production Deployment

### Vercel/Netlify
1. Add environment variables in dashboard
2. Deploy normally - email API will work automatically

### Custom Server
1. Ensure Node.js environment supports nodemailer
2. Set environment variables
3. Test email delivery

## 📞 Support

### Common Issues

**Emails not sending?**
- Check Gmail app password is correct
- Verify 2FA is enabled
- Check environment variables are loaded

**Validation errors?**
- Check date formats
- Verify email format
- Ensure all required fields are filled

**Form not submitting?**
- Check browser console for errors
- Verify API route is accessible
- Test with simple data first

### Contact Information
- **Phone**: +234 913 559 1544
- **Email**: info@cosignaturehomes.com
- **Website**: CO Signature Homes

---

## 🎉 You're All Set!

Your booking system now includes:
- ✅ Professional email notifications
- ✅ Comprehensive form validation  
- ✅ Excellent user experience
- ✅ Admin workflow integration
- ✅ Production-ready security

Test thoroughly and enjoy your fully functional booking system! 🏠✨
