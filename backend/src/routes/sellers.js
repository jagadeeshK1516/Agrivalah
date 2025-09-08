const express = require('express');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/sellers/register:
 *   post:
 *     summary: Register seller (simplified - adds to waiting list)
 *     tags: [Sellers]
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      designation, 
      name, 
      email, 
      password,
      confirmPassword,
      // Step 2 fields - all seller types
      ...additionalData
    } = req.body;

    // Basic validation
    if (!designation || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All basic fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const validTypes = ['farmer', 'reseller', 'startup', 'service'];
    if (!validTypes.includes(designation)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seller type'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: email } // In case email field contains phone
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email/phone'
      });
    }

    // Create user
    const isEmail = email.includes('@');
    const userData = {
      name: name.trim(),
      passwordHash: password,
      role: designation === 'farmer' ? 'farmer' : 
            designation === 'reseller' ? 'reseller' :
            designation === 'startup' ? 'agritech_startup' : 'service_provider',
      verified: false,
      status: 'pending_approval' // Add status field
    };

    if (isEmail) {
      userData.email = email.toLowerCase();
    } else {
      userData.phone = email;
      userData.email = `${email}@temp.agrivalah.com`;
    }

    const user = new User(userData);
    await user.save();

    // Map designation to correct sellerType enum values
    const sellerTypeMapping = {
      'farmer': 'farmer',
      'reseller': 'reseller', 
      'startup': 'agritech_startup',
      'service': 'service_provider'
    };

    // Create seller profile with all data in one go
    const sellerProfileData = {
      userId: user._id,
      sellerType: sellerTypeMapping[designation],
      kycStatus: 'pending',
      isActive: false, // Use isActive instead of status for waiting list
      applicationData: {
        basicInfo: {
          name,
          email,
          designation
        },
        additionalData: additionalData // Store all additional form data
      }
    };

    const sellerProfile = new SellerProfile(sellerProfileData);
    await sellerProfile.save();

    res.json({
      success: true,
      message: 'Seller application submitted successfully. You have been added to our waiting list.',
      data: {
        userId: user._id,
        sellerId: sellerProfile._id,
        status: 'pending_approval',
        message: 'Your application is under review. We will notify you once approved.'
      }
    });

  } catch (error) {
    logger.error('Seller registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/verify-otp:
 *   post:
 *     summary: Mock OTP verification (always returns success)
 *     tags: [Sellers]
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, emailOrPhone, otp } = req.body;

    if (!userId || !emailOrPhone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID, email/phone, and OTP are required'
      });
    }

    // Mock OTP verification - always accept 123456
    if (otp !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Use 123456 for demo.'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mark user as verified but still pending approval
    user.verified = true;
    await user.save();

    // Update seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (sellerProfile) {
      sellerProfile.kycStatus = 'pending';
      sellerProfile.isActive = true; // Move from waiting list to active pending
      await sellerProfile.save();
    }

    res.json({
      success: true,
      message: 'OTP verified successfully! Your application is in our waiting list for approval.',
      data: {
        userId: user._id,
        verified: true,
        status: 'waiting_list',
        message: 'We have received your complete application. Our team will review it and notify you once approved.'
      }
    });

  } catch (error) {
    logger.error('Seller OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/send-otp:
 *   post:
 *     summary: Mock send OTP (always returns success)
 *     tags: [Sellers]
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required'
      });
    }

    // Mock OTP sending
    res.json({
      success: true,
      message: 'OTP sent successfully! Use 123456 for demo.'
    });

  } catch (error) {
    logger.error('Send seller OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/{id}:
 *   get:
 *     summary: Get seller profile
 *     tags: [Sellers]
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sellerProfile = await SellerProfile.findOne({ userId: id })
      .populate('userId', 'name email phone role verified status');

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    res.json({
      success: true,
      data: sellerProfile
    });

  } catch (error) {
    logger.error('Get seller profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;