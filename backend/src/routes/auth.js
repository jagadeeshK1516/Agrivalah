const express = require('express');
const User = require('../models/User');
const { userValidation } = require('../middlewares/validation');
const { 
  generateAccessToken, 
  generateRefreshToken,
  refreshAccessToken 
} = require('../middlewares/auth');
const otpService = require('../services/otpService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: User signup (Customer/Mitra)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - emailOrPhone
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               emailOrPhone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, mitra]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/signup', async (req, res) => {
  try {
    const { 
      name, 
      emailOrPhone, 
      password, 
      role = 'customer',
      subscriptionType,
      paymentAmount,
      creditsEarned
    } = req.body;

    // Basic validation
    if (!name || !emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email/phone, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email/phone'
      });
    }

    // Create user but don't verify yet
    const isEmail = emailOrPhone.includes('@');
    const userData = {
      name: name.trim(),
      passwordHash: password, // Will be hashed by pre-save middleware
      role: role,
      verified: false
    };

    // Add mitra-specific data
    if (role === 'mitra') {
      userData.subscriptionType = subscriptionType; // 'subscription' or 'donation'
      userData.paymentAmount = paymentAmount;
      userData.creditsEarned = creditsEarned || 0;
      userData.subscriptionStatus = 'active';
      userData.subscriptionDate = new Date();
    }

    if (isEmail) {
      userData.email = emailOrPhone.toLowerCase();
    } else {
      userData.phone = emailOrPhone;
      userData.email = `${emailOrPhone}@temp.agrivalah.com`; // Temporary email for phone users
    }

    const user = new User(userData);
    await user.save();

    // Send OTP
    const otpResult = await otpService.sendOTP(
      emailOrPhone,
      'signup',
      {
        userId: user._id,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    );

    res.json({
      ok: true,
      success: true,
      message: role === 'mitra' ? "Payment processed successfully! OTP sent for verification." : "OTP sent",
      data: {
        userId: user._id,
        otpSent: true,
        target: isEmail ? 'email' : 'phone',
        role: role,
        ...(role === 'mitra' && {
          subscriptionType: subscriptionType,
          paymentAmount: paymentAmount,
          creditsEarned: creditsEarned
        })
      }
    });

  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and complete registration
 *     tags: [Authentication]
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { emailOrPhone, otp, tempToken } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and OTP are required'
      });
    }

    // Verify OTP
    const otpResult = await otpService.verifyOTP(emailOrPhone, otp, 'signup');

    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }

    // Find and verify user
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mark user as verified
    user.verified = true;
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, {
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    // Update login metadata
    await user.updateLoginMeta();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified
      }
    });

  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 */
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your account first',
        code: 'ACCOUNT_NOT_VERIFIED'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, {
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    // Update login metadata
    await user.updateLoginMeta();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post('/refresh', refreshAccessToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const RefreshToken = require('../models/RefreshToken');
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { revoked: true, revokedAt: new Date() }
      );
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Authentication]
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { emailOrPhone, purpose = 'signup' } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required'
      });
    }

    // Send OTP
    const otpResult = await otpService.sendOTP(
      emailOrPhone,
      purpose,
      {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    );

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    logger.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

module.exports = router;