const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Create transporter using SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates
        }
      });

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.log('Email transporter verification failed:', error);
        } else {
          console.log('Email transporter is ready to send messages');
        }
      });
    } catch (error) {
      console.error('Error creating email transporter:', error);
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    try {
      const mailOptions = {
        from: `"Johsther Cakes & Academy" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Welcome to Johsther Cakes & Academy! - Your Account is Ready',
        html: this.getWelcomeEmailTemplate(userName),
        text: this.getWelcomeEmailText(userName)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  getWelcomeEmailTemplate(userName) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Johsther Cakes</title>
    <!-- Importing website fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Base Styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #FBF4E4; /* Light Cream */
            font-family: 'Comic Neue', cursive, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        table { border-spacing: 0; width: 100%; }
        td { padding: 0; }
        img { border: 0; display: block; max-width: 100%; }

        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Typography */
        h1, h2 {
            font-family: 'Baloo 2', cursive, sans-serif;
        }
        h1 {
            color: #52362F;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 20px 0;
            letter-spacing: -0.5px;
        }
        p {
            color: #6D5B57;
            font-size: 16px;
            line-height: 1.8;
            margin: 0 0 20px 0;
        }

        /* Components */
        .section-padding {
            padding: 60px 40px; /* Large padding for "breathability" */
            text-align: center;
        }
        .cta-button {
            font-family: 'Baloo 2', cursive, sans-serif;
            background-color: #52362F;
            color: #ffffff !important;
            text-decoration: none;
            padding: 18px 35px;
            border-radius: 4px; /* More modern, slight round */
            font-weight: 600;
            display: inline-block;
            font-size: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .promo-box {
            background-color: #FDEBC3;
            padding: 30px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer-text {
            font-size: 12px;
            color: #A39390;
            line-height: 1.5;
        }
        
        /* Mobile adjustment */
        @media screen and (max-width: 600px) {
            .section-padding { padding: 40px 20px; }
        }
    </style>
</head>
<body>

    <table role="presentation" class="email-container" align="center">
        
        <tr>
            <td style="padding: 40px 0; text-align: center; background-color: #FBF4E4;">
                <span style="font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: bold; color: #52362F; text-transform: uppercase; letter-spacing: 2px;">
                    Johsther <span style="color: #E59A1D;">Cakes</span>
                </span>
            </td>
        </tr>

        <tr>
            <td>
                <img src="https://via.placeholder.com/600x400/F9F9F9/52362F?text=Artisanal+Baking" alt="Welcome to Johsther Cakes" width="600" style="width: 100%; height: auto;">
            </td>
        </tr>

        <tr>
            <td class="section-padding">
                <p style="font-family: 'Baloo 2', cursive; text-transform: uppercase; font-size: 12px; font-weight: bold; color: #E59A1D; letter-spacing: 2px; margin-bottom: 10px;">
                    Sweet beginnings
                </p>
                <h1>Every moment, made sweeter.</h1>
                <p>
                    Hello, <strong>\${userName}</strong>! We are thrilled to have you in our community. At Johsther Cakes, we believe baking is an art form—whether we're crafting a centerpiece for your wedding or teaching you how to master the perfect crumb in our Academy.
                </p>
                <div style="margin-top: 30px;">
                    <a href="\${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">Browse our Collection</a>
                </div>
            </td>
        </tr>

        <tr>
            <td style="padding: 0 40px;">
                <table class="promo-box">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #52362F; font-size: 14px;">Welcome Gift: Use code <strong>SWEET10</strong> for 10% off your first order.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td class="section-padding" style="padding-top: 20px;">
                <hr style="border: 0; border-top: 1px solid #EEE6D8; margin-bottom: 40px;">
                <h2 style="color: #52362F; font-size: 20px;">The Baking Academy</h2>
                <p style="font-size: 15px;">Want to learn our secrets? Join a class today.</p>
                <a href="\${process.env.FRONTEND_URL || 'http://localhost:3000'}/#courses" style="font-family: 'Baloo 2', cursive; color: #E59A1D; font-weight: bold; text-decoration: none; font-size: 14px;">View Courses &rarr;</a>
            </td>
        </tr>

        <tr>
            <td style="padding: 40px; text-align: center; background-color: #FBF4E4;">
                <p class="footer-text" style="font-family: 'Baloo 2', cursive; font-weight: bold; color: #52362F; margin-bottom: 10px; font-size: 14px;">Johsther Cakes</p>
                <p class="footer-text" style="margin-bottom: 10px;">
                    Nairobi, Kenya • Handcrafted with love
                </p>
                <p class="footer-text">
                    <a href="#" style="color: #A39390;">Instagram</a> &nbsp;•&nbsp; 
                    <a href="#" style="color: #A39390;">Facebook</a> &nbsp;•&nbsp; 
                    <a href="#" style="color: #A39390;">Unsubscribe</a>
                </p>
            </td>
        </tr>

    </table>

</body>
</html>
    `;
  }

  getWelcomeEmailText(userName) {
    return `
Welcome to Johsther Cakes & Academy!

Dear ${userName},

We're absolutely delighted to welcome you to Johsther Cakes & Academy! Your account has been successfully created, and you're now part of our wonderful community of baking enthusiasts and cake lovers.

What You Can Enjoy:
- Browse our exquisite cake collection
- Learn professional baking techniques  
- Join our interactive baking classes
- Get exclusive member discounts
- Connect with fellow baking enthusiasts

Your journey into the world of delicious cakes and professional baking starts here! We've prepared everything you need to get started.

Visit us at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

If you have any questions or need assistance, our support team is always here to help you. Simply reply to this email or visit our help center.

Thank you for choosing Johsther Cakes & Academy. We can't wait to see what amazing creations you'll make!

© 2026 Johsther Cakes & Academy. All rights reserved.
    `;
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"Johsther Cakes & Academy" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Password Reset Request - Johsther Cakes & Academy',
        html: this.getPasswordResetTemplate(resetUrl),
        text: this.getPasswordResetText(resetUrl)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  getPasswordResetTemplate(resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Johsther Cakes & Academy</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #e91e63;
            margin-bottom: 10px;
          }
          .reset-button {
            display: inline-block;
            background-color: #e91e63;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Johsther Cakes & Academy</div>
            <h1>Password Reset Request</h1>
          </div>
          
          <p>You requested to reset your password. Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">
              Reset Password
            </a>
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            <li>This link will expire in 1 hour for security reasons</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>For your security, never share this link with anyone</li>
          </ul>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          
          <div class="footer">
            <p>© 2026 Johsther Cakes & Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetText(resetUrl) {
    return `
Password Reset Request - Johsther Cakes & Academy

You requested to reset your password. Visit this link to reset your password:
${resetUrl}

Important:
- This link will expire in 1 hour for security reasons
- If you didn't request this password reset, please ignore this email
- For your security, never share this link with anyone

© 2026 Johsther Cakes & Academy. All rights reserved.
    `;
  }
}

module.exports = new EmailService();
