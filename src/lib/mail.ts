import nodemailer from "nodemailer"

export async function sendVerificationEmail(email: string, token: string) {
  const VerificationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification For Spendwise",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your SpendWise Account</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 3px solid #4CAF50;
        }
        .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .logo {
            max-width: 100px;
            height: auto;
        }
        .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #2E7D32;
            margin: auto 0;
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
        }
        h1 {
            color: #2E7D32;
            margin-top: 0;
            font-size: 24px;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 12px 32px;
            background-color: #2E7D32;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #eaeaea;
        }
        .divider {
            height: 1px;
            background-color: #eaeaea;
            margin: 20px 0;
        }
        .link {
            color: #2E7D32;
            word-break: break-all;
            font-size: 14px;
        }
        .security-notice {
            background-color: #F1F8E9;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
            color: #33691E;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="https://trackwithspendwise.vercel.app/SpendWIse-5.png" alt="SpendWise Logo" class="logo">
                <span class="logo-text">Spendwise</span>
            </div>
        </div>
        <div class="content">
            <h1>Verify Your Email Address</h1>
            <p>Hello,</p>
            <p>Welcome to Spendwise! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${VerificationLink}" class="btn" style="color: white;">Verify Email</a>
            </p>
            <div class="security-notice">
                🔒 This link will expire in 24 hours for your security.
            </div>
            <div class="divider"></div>
            <p style="font-size: 14px;">If you're having trouble with the button, copy and paste this link into your browser:</p>
            <p class="link">${VerificationLink}</p>
            <p style="font-size: 14px; color: #666;">If you didn't create an account with Spendwise, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at etracker690@gmail.com</p>
            <p>&copy; 2023 Spendwise. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      throw error
    }
  })
}

// RESET PASSWORD EMAIL
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verification",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your SpendWise Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .logo { text-align: center; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="/public/SpendWise-3.png" alt="SpendWise Logo" width="150">
        </div>
        <div class="content">
            <h2 style="color: #4CAF50;">Reset Your Password</h2>
            <p>We received a request to reset your SpendWise password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
                <a href=${resetLink} class="button">Reset Password</a>
            </p>
            <p>If you didn't request a password reset, please ignore this email or contact our support team.</p>
        </div>
    </div>
</body>
</html>`,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      throw error
    }
  })
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your SpendWise Two-Factor Authentication Code",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SpendWise Two-Factor Authentication Code</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .logo { text-align: center; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
        .code { font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50; letter-spacing: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="[Your-Logo-URL]" alt="SpendWise Logo" width="150">
        </div>
        <div class="content">
            <h2 style="color: #4CAF50;">Your Two-Factor Authentication Code</h2>
            <p>To complete your login to SpendWise, please use the following code:</p>
            <p class="code">${token}</p>
            <p>This code will expire in 10 minutes. If you didn't attempt to log in, please contact our support team immediately.</p>
        </div>
    </div>
</body>
</html>`,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      throw error
    }
  })
}
