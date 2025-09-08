const express = require('express');
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middlewares/auth');
const uploadService = require('../services/uploadService');
const QRCode = require('qrcode');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 
      'phone', 
      'address', 
      'meta.preferredLanguage',
      'meta.notifications'
    ];
    
    const updates = {};
    
    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle nested updates
    if (req.body.address) {
      updates.address = {
        ...req.user.address,
        ...req.body.address
      };
    }

    if (req.body.notifications) {
      updates['meta.notifications'] = {
        ...req.user.meta.notifications,
        ...req.body.notifications
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/users/me/upload:
 *   post:
 *     summary: Upload profile image or video
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/me/upload', 
  authenticateToken,
  uploadService.single('file', 'profiles'),
  async (req, res) => {
    try {
      const { uploadResult } = req;
      const { type = 'image' } = req.body; // 'image' or 'video'

      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Update user profile with file URL
      const updateField = type === 'video' ? 'videoUrl' : 'profilePic';
      
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { [updateField]: uploadResult.url },
        { new: true }
      ).select('-passwordHash');

      res.json({
        success: true,
        message: `Profile ${type} uploaded successfully`,
        data: {
          user,
          uploadedFile: uploadResult
        }
      });

    } catch (error) {
      logger.error('Profile upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Upload failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/users/{id}/profile-qr:
 *   get:
 *     summary: Generate QR code for user profile
 *     tags: [Users]
 */
router.get('/:id/profile-qr', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'png' } = req.query; // 'png', 'svg', or 'url'

    const user = await User.findById(id).select('name email role profilePic');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create QR code data
    const qrData = {
      userId: user._id,
      name: user.name,
      role: user.role,
      profileUrl: `${req.protocol}://${req.get('host')}/profile/${user._id}`,
      timestamp: new Date().toISOString()
    };

    const qrDataString = JSON.stringify(qrData);

    if (format === 'url') {
      // Return just the profile URL
      return res.json({
        success: true,
        data: {
          profileUrl: qrData.profileUrl,
          qrData: qrData
        }
      });
    }

    // Generate QR code
    const qrCodeOptions = {
      errorCorrectionLevel: 'M',
      type: format === 'svg' ? 'svg' : 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    if (format === 'svg') {
      const qrSvg = await QRCode.toString(qrDataString, qrCodeOptions);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(qrSvg);
    } else {
      const qrBuffer = await QRCode.toBuffer(qrDataString, qrCodeOptions);
      res.setHeader('Content-Type', 'image/png');
      res.send(qrBuffer);
    }

  } catch (error) {
    logger.error('QR code generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    });
  }
});

/**
 * @swagger
 * /api/v1/users/stats:
 *   get:
 *     summary: Get user statistics (for dashboard)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'mitra') {
      // Mitra-specific stats
      stats = {
        investmentAmount: req.user.mitraDetails?.investmentAmount || 42000,
        expectedValue: req.user.mitraDetails?.expectedValue || 54000,
        currentROI: req.user.mitraDetails?.currentROI || 12000,
        monthlyKitStatus: req.user.mitraDetails?.monthlyKitStatus || 'pending',
        joinedDate: req.user.mitraDetails?.joinedDate || req.user.createdAt
      };
    } else if (userRole === 'customer') {
      // Customer-specific stats (these would come from actual orders)
      stats = {
        totalOrders: 0,
        totalSpent: 0,
        totalSaved: 0,
        favoriteProducts: 0
      };
    }

    res.json({
      success: true,
      data: {
        userInfo: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          joinedDate: req.user.createdAt,
          lastLogin: req.user.meta?.lastLogin
        },
        stats
      }
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;