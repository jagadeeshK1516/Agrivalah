const nodemailer = require('nodemailer');
const twilio = require('twilio');
const OTP = require('../models/OTP');
const logger = require('../utils/logger');

class OTPService {
  constructor() {
    // Initialize email transporter
    if (process.env.EMAIL_PROVIDER !== 'mock') {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    // Initialize Twilio client
    if (process.env.OTP_PROVIDER !== 'mock') {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  // Generate and send OTP
  async sendOTP(target, purpose, metadata = {}) {
    try {
      // Clean up any existing OTPs for this target and purpose
      await OTP.deleteMany({ target, purpose, isUsed: false });

      // Generate new OTP
      const code = process.env.NODE_ENV === 'development' ? '123456' : OTP.generateOTP();
      
      // Set expiration (5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Save OTP to database
      const otpDoc = await OTP.create({
        target,
        code,
        purpose,
        expiresAt,
        metadata
      });

      // Determine if target is email or phone
      const isEmail = target.includes('@');
      
      // Send OTP
      if (isEmail) {
        await this.sendEmailOTP(target, code, purpose);
      } else {
        await this.sendSMSOTP(target, code, purpose);
      }

      logger.info(`OTP sent successfully to ${target} for ${purpose}`);
      
      return {
        success: true,
        message: `OTP sent to ${isEmail ? 'email' : 'phone'}`,
        otpId: otpDoc._id,
        expiresAt: expiresAt.toISOString()
      };

    } catch (error) {
      logger.error('OTP sending failed:', error);
      throw new Error('Failed to send OTP');
    }
  }

  // Send OTP via email
  async sendEmailOTP(email, code, purpose) {
    if (process.env.EMAIL_PROVIDER === 'mock') {
      logger.info(`[MOCK EMAIL] OTP ${code} sent to ${email} for ${purpose}`);
      return;
    }

    const subject = this.getEmailSubject(purpose);
    const html = this.getEmailTemplate(code, purpose);

    await this.emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html
    });
  }

  // Send OTP via SMS
  async sendSMSOTP(phone, code, purpose) {
    if (process.env.OTP_PROVIDER === 'mock') {
      logger.info(`[MOCK SMS] OTP ${code} sent to ${phone} for ${purpose}`);
      return;
    }

    const message = `Your AgriValah verification code is: ${code}. Valid for 5 minutes. Do not share this code.`;

    await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.startsWith('+91') ? phone : `+91${phone}`
    });
  }

  // Verify OTP
  async verifyOTP(target, inputCode, purpose) {
    try {
      const otpDoc = await OTP.findOne({
        target,
        purpose,
        isUsed: false
      }).sort({ createdAt: -1 });

      if (!otpDoc) {
        return {
          success: false,
          message: 'OTP not found or expired'
        };
      }

      // Use the model's verify method
      otpDoc.verify(inputCode);

      return {
        success: true,
        message: 'OTP verified successfully'
      };

    } catch (error) {
      logger.error('OTP verification failed:', error);
      return {
        success: false,
        message: error.message || 'OTP verification failed'
      };
    }
  }

  // Get email subject based on purpose
  getEmailSubject(purpose) {
    const subjects = {
      signup: 'Welcome to AgriValah - Verify Your Account',
      login: 'AgriValah Login Verification',
      password_reset: 'Reset Your AgriValah Password',
      phone_verification: 'Verify Your Phone Number',
      email_verification: 'Verify Your Email Address',
      transaction: 'Transaction Verification'
    };
    return subjects[purpose] || 'AgriValah Verification';
  }

  // Get email template
  getEmailTemplate(code, purpose) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AgriValah OTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a;">AgriValah</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #16a34a; margin-bottom: 20px;">Verification Code</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
          <div style="background: #16a34a; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 5px; display: inline-block; letter-spacing: 5px;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            This code will expire in 5 minutes. Do not share this code with anyone.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Thank you for choosing AgriValah!</p>
        </div>
      </body>
      </html>
    `;
  }

  // Cleanup expired OTPs (can be called periodically)
  async cleanupExpiredOTPs() {
    try {
      const result = await OTP.cleanupExpired();
      logger.info(`Cleaned up ${result} expired OTPs`);
      return result;
    } catch (error) {
      logger.error('OTP cleanup failed:', error);
      return 0;
    }
  }
}

module.exports = new OTPService();