const express = require('express');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticateToken, authorize } = require('../middlewares/auth');
const logger = require('../utils/logger');

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken, authorize(['admin']));

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 365;
    const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    // Get basic counts
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      newSignups,
      newOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      SellerProfile.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.aggregate([
        { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ])
    ]);

    // Get user distribution by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get seller distribution by type
    const sellersByType = await SellerProfile.aggregate([
      { $group: { _id: '$sellerType', count: { $sum: 1 } } }
    ]);

    // Get order status distribution
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get top products
    const topProducts = await Product.find()
      .sort({ 'metrics.orderCount': -1 })
      .limit(5)
      .select('title metrics.orderCount metrics.rating sellerId')
      .populate('sellerId', 'name');

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSellers,
          totalProducts,
          totalOrders,
          newSignups,
          newOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        distributions: {
          usersByRole: usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          sellersByType: sellersByType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          ordersByStatus: ordersByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        topProducts,
        period
      }
    });

  } catch (error) {
    logger.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with filters and pagination
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', async (req, res) => {
  try {
    const {
      role,
      verified,
      search,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortQuery = {};
    sortQuery[sort] = order === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash')
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/admin/sellers:
 *   get:
 *     summary: Get all sellers with KYC status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/sellers', async (req, res) => {
  try {
    const {
      sellerType,
      kycStatus,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};
    if (sellerType) filter.sellerType = sellerType;
    if (kycStatus) filter.kycStatus = kycStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sellers, total] = await Promise.all([
      SellerProfile.find(filter)
        .populate('userId', 'name email phone verified createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      SellerProfile.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        sellers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Get admin sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/admin/verify-seller:
 *   post:
 *     summary: Verify or reject seller KYC
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.post('/verify-seller', async (req, res) => {
  try {
    const { sellerId, action, notes } = req.body;

    if (!sellerId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID and action are required'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be approve or reject'
      });
    }

    const seller = await SellerProfile.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Update KYC status
    seller.kycStatus = action === 'approve' ? 'approved' : 'rejected';
    if (action === 'approve') {
      seller.verifiedAt = new Date();
      seller.isActive = true;
    } else {
      seller.suspensionReason = notes || 'KYC rejected';
      seller.isActive = false;
    }

    await seller.save();

    res.json({
      success: true,
      message: `Seller ${action}d successfully`,
      data: seller
    });

  } catch (error) {
    logger.error('Verify seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders for admin management
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/orders', async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter['paymentInfo.status'] = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('buyerId', 'name email phone')
        .populate('sellerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;