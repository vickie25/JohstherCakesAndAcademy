// Email setup helper for testing and development
const nodemailer = require('nodemailer');

// Create test account using Ethereal.email for development
async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('====================================');
    console.log('TEST EMAIL ACCOUNT CREATED');
    console.log('====================================');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('SMTP Server:', testAccount.smtp.host);
    console.log('SMTP Port:', testAccount.smtp.port);
    console.log('====================================');
    console.log('Add these to your .env file:');
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log('====================================');
    
    return testAccount;
  } catch (error) {
    console.error('Error creating test account:', error);
  }
}

// Test email sending
async function testEmailSending() {
  try {
    const testAccount = await createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"Johsther Cakes & Academy" <${testAccount.user}>`,
      to: testAccount.user,
      subject: 'Test Email - Johsther Cakes & Academy',
      html: `
        <h1>Test Email Successful!</h1>
        <p>This is a test email from Johsther Cakes & Academy.</p>
        <p>Your email setup is working correctly.</p>
        <p>Best regards,<br>Johsther Cakes & Academy Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('Error testing email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { createTestAccount, testEmailSending };
