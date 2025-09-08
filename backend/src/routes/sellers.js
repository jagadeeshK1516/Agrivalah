const express = require('express');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const { authenticateToken } = require('../middlewares/auth');
const { sellerValidation } = require('../middlewares/validation');
const otpService = require('../services/otpService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/sellers/init:
 *   post:
 *     summary: Initialize seller registration (Step 1)
 *     tags: [Sellers]
 */
router.post('/init', async (req, res) => {
  try {
    const { 
      designation, 
      name, 
      email, 
      password, 
      confirmPassword 
    } = req.body;

    // Basic validation
    if (!designation || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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
      verified: false
    };

    if (isEmail) {
      userData.email = email.toLowerCase();
    } else {
      userData.phone = email;
      userData.email = `${email}@temp.agrivalah.com`;
    }

    const user = new User(userData);
    await user.save();

    // Create initial seller profile
    const sellerProfile = new SellerProfile({
      userId: user._id,
      sellerType: designation,
      kycStatus: 'pending'
    });
    await sellerProfile.save();

    res.json({
      success: true,
      message: 'Seller profile initialized',
      data: {
        userId: user._id,
        sellerId: sellerProfile._id,
        sellerType: designation,
        step: 1
      }
    });

  } catch (error) {
    logger.error('Seller init error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/step/farmer:
 *   post:
 *     summary: Complete farmer-specific details (Step 2)
 *     tags: [Sellers]
 */
router.post('/step/farmer', async (req, res) => {
  try {
    const {
      userId,
      acres,
      soilType,
      cropsGrown,
      cropDetails,
      location,
      pinCode,
      language
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile || sellerProfile.sellerType !== 'farmer') {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    // Update farmer details
    sellerProfile.farmerDetails = {
      acres: parseFloat(acres),
      soilType: soilType?.toLowerCase(),
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : [],
      cropDetails: cropDetails || '',
      location: location?.trim(),
      pinCode: pinCode?.trim(),
      language: language || 'en'
    };

    await sellerProfile.save();

    res.json({
      success: true,
      message: 'Farmer details saved',
      data: {
        userId,
        sellerId: sellerProfile._id,
        step: 2
      }
    });

  } catch (error) {
    logger.error('Farmer details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/step/reseller:
 *   post:
 *     summary: Complete reseller-specific details (Step 2)
 *     tags: [Sellers]
 */
router.post('/step/reseller', async (req, res) => {
  try {
    const {
      userId,
      businessName,
      businessType,
      gstNumber,
      businessAddress,
      preferredCategories
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile || sellerProfile.sellerType !== 'reseller') {
      return res.status(404).json({
        success: false,
        message: 'Reseller profile not found'
      });
    }

    sellerProfile.resellerDetails = {
      businessName: businessName?.trim(),
      businessType: businessType,
      gstNumber: gstNumber?.trim() || '',
      businessAddress: businessAddress?.trim(),
      preferredCategories: Array.isArray(preferredCategories) ? preferredCategories : []
    };

    await sellerProfile.save();

    res.json({
      success: true,
      message: 'Reseller details saved',
      data: {
        userId,
        sellerId: sellerProfile._id,
        step: 2
      }
    });

  } catch (error) {
    logger.error('Reseller details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/step/startup:
 *   post:
 *     summary: Complete startup-specific details (Step 2)
 *     tags: [Sellers]
 */
router.post('/step/startup', async (req, res) => {
  try {
    const {
      userId,
      companyName,
      registrationNumber,
      companyAddress,
      natureOfBusiness,
      yearsInOperation,
      collaborationAreas
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile || sellerProfile.sellerType !== 'startup') {
      return res.status(404).json({
        success: false,
        message: 'Startup profile not found'
      });
    }

    sellerProfile.startupDetails = {
      companyName: companyName?.trim(),
      registrationNumber: registrationNumber?.trim() || '',
      companyAddress: companyAddress?.trim(),
      natureOfBusiness: natureOfBusiness,
      yearsInOperation: parseInt(yearsInOperation) || 0,
      collaborationAreas: Array.isArray(collaborationAreas) ? collaborationAreas : []
    };

    await sellerProfile.save();

    res.json({
      success: true,
      message: 'Startup details saved',
      data: {
        userId,
        sellerId: sellerProfile._id,
        step: 2
      }
    });

  } catch (error) {
    logger.error('Startup details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/sellers/step/service-provider:
 *   post:
 *     summary: Complete service provider details (Step 2)
 *     tags: [Sellers]
 */
router.post('/step/service-provider', async (req, res) => {
  try {
    const {
      userId,
      selectedServices,
      vehicleNumber,
      model,
      rentPerDay,
      serviceArea,
      equipmentDetails,
      capacity,
      serviceCharges,
      storageCapacity,
      storageType,
      rentalModel
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile || sellerProfile.sellerType !== 'service') {
      return res.status(404).json({
        success: false,
        message: 'Service provider profile not found'
      });
    }

    sellerProfile.serviceDetails = {
      selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
      serviceArea: serviceArea?.trim() || '',
      tractorServices: {
        vehicleNumber: vehicleNumber?.trim() || '',
        model: model?.trim() || '',
        rentPerDay: parseInt(rentPerDay) || 0
      },
      equipmentServices: {
        equipmentDetails: equipmentDetails?.trim() || '',
        serviceCharges: serviceCharges?.trim() || ''
      },
      storageServices: {
        storageCapacity: storageCapacity?.trim() || '',
        storageType: storageType || '',
        rentalModel: rentalModel?.trim() || ''
      }
    };

    await sellerProfile.save();

    res.json({
      success: true,
      message: 'Service provider details saved',
      data: {
        userId,
        sellerId: sellerProfile._id,
        step: 2
      }
    });

  } catch (error) {
    logger.error('Service provider details error:', error);
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
 *     summary: Verify OTP and complete seller registration
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

    // Verify OTP
    const otpResult = await otpService.verifyOTP(emailOrPhone, otp, 'signup');
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }

    // Find and verify user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mark user as verified
    user.verified = true;
    await user.save();

    // Update seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (sellerProfile) {
      sellerProfile.kycStatus = 'under_review';
      await sellerProfile.save();
    }

    res.json({
      success: true,
      message: 'Seller registration completed successfully',
      data: {
        userId: user._id,
        verified: true,
        kycStatus: 'under_review'
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
 * /api/v1/sellers/{id}:
 *   get:
 *     summary: Get seller profile
 *     tags: [Sellers]
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sellerProfile = await SellerProfile.findOne({ userId: id })
      .populate('userId', 'name email phone role verified');

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

/**
 * @swagger
 * /api/v1/sellers/send-otp:
 *   post:
 *     summary: Send OTP for seller verification
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

    // Send OTP
    const otpResult = await otpService.sendOTP(
      emailOrPhone,
      'signup',
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
    logger.error('Send seller OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

module.exports = router;