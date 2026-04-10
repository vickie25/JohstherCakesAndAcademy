# Email Integration Guide - Johsther Cakes & Academy

## Overview
This guide explains how to configure and use the email functionality integrated with your Node.js backend. The system automatically sends welcome emails when new users register.

## Email Features
- **Welcome Emails**: Automatically sent when users register
- **Password Reset Emails**: Ready for implementation
- **Beautiful HTML Templates**: Professional, responsive email designs
- **Text Fallback**: Plain text versions for accessibility
- **Error Handling**: Graceful failure handling with logging

## Configuration

### 1. Environment Variables
Add these to your `.env` file:

```env
# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### 2. Gmail Setup (Recommended)
For Gmail, you need to use an App Password:

1. Enable 2-factor authentication on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" for the app
4. Generate a 16-character password
5. Use this password in your `.env` file

### 3. Alternative Email Providers
```env
# Outlook/Hotmail
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587

# Yahoo Mail
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587

# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

## Testing

### Development Testing with Ethereal
Use the built-in test script to verify email functionality:

```bash
node scripts/testEmail.js
```

This creates a temporary email account and sends a test email.

### Production Testing
Register a new user to test the welcome email:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your_email@example.com",
    "password": "Password123"
  }'
```

## Email Templates

### Welcome Email Template
The welcome email includes:
- Personalized greeting
- Feature highlights
- Call-to-action button
- Professional branding
- Social media links

### Customization
Edit `config/email.js` to customize:
- Email content and styling
- Brand colors and logos
- Feature lists
- Footer information

## Error Handling

The email system includes comprehensive error handling:
- Connection failures are logged
- Registration continues even if email fails
- Detailed error messages in console
- Graceful degradation

## Security Features

- **TLS/STARTTLS**: Automatic encryption
- **App Passwords**: No plain text passwords stored
- **Environment Variables**: Sensitive data not in code
- **Input Validation**: Email addresses validated

## Troubleshooting

### Common Issues

1. **Gmail Authentication Failed**
   - Enable 2-factor authentication
   - Use App Password (not regular password)
   - Check Gmail SMTP settings

2. **Connection Timeout**
   - Verify SMTP host and port
   - Check firewall settings
   - Ensure internet connectivity

3. **Email Not Received**
   - Check spam/junk folder
   - Verify sender email address
   - Check email logs in console

### Debug Mode
Add to your `.env`:
```env
NODE_ENV=development
```

This enables detailed email logging.

## Production Deployment

### Environment Variables
Set these in your production environment:
- `SMTP_HOST`: Your production SMTP server
- `SMTP_USER`: Production email address
- `SMTP_PASS`: Production email password
- `NODE_ENV=production`

### Recommended Email Services for Production
- **SendGrid**: Reliable email delivery
- **Amazon SES**: Cost-effective for high volume
- **Mailgun**: Advanced features and analytics
- **Postmark**: Fast, reliable delivery

## Usage Statistics

Monitor your email sending:
```bash
# Check logs for email status
tail -f logs/app.log | grep "email"
```

## Future Enhancements

Ready-to-implement features:
- Email verification for new accounts
- Password reset functionality
- Order confirmation emails
- Marketing emails
- Email analytics and tracking

## Support

For email-related issues:
1. Check the console logs
2. Verify SMTP credentials
3. Test with the provided test script
4. Check your email provider's documentation
