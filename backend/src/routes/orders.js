const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, authorize } = require('../middlewares/auth');
const { orderValidation } = require('../middlewares/validation');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
  authenticateToken,
  orderValidation.create,
  async (req, res) => {
    try {
      const { items, deliveryAddress, paymentMethod = 'cod' } = req.body;

      // Validate products and calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.productId}`
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.title}`
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: product._id,
          productName: product.title,
          quantity: item.quantity,
          unit: product.unit,
          pricePerUnit: product.price,
          totalPrice: itemTotal,
          productImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
        });
      }

      // Calculate additional charges
      const deliveryCharge = subtotal < 500 ? 50 : 0; // Free delivery above ₹500
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + deliveryCharge + tax;

      // Get sellerId from the first product (assuming single seller order for now)
      const firstProduct = await Product.findById(items[0].productId);
      
      // Create order
      const order = new Order({
        buyerId: req.user._id,
        sellerId: firstProduct.sellerId,
        items: orderItems,
        pricing: {
          subtotal,
          deliveryCharge,
          tax,
          total
        },
        deliveryAddress,
        paymentInfo: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'pending'
        }
      });

      await order.save();

      // Update product stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { 
            $inc: { 
              stock: -item.quantity,
              'metrics.orderCount': 1
            }
          }
        );
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });

    } catch (error) {
      logger.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/orders/user:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { buyerId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sellerId', 'name profilePic')
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
    logger.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .populate('items.productId', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (!order.buyerId._id.equals(req.user._id) && 
        !order.sellerId._id.equals(req.user._id) && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = [
      'pending', 'confirmed', 'processing', 'packed', 
      'shipped', 'out_for_delivery', 'delivered', 
      'cancelled', 'returned', 'refunded'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization - seller can update most statuses, buyer can cancel
    const canUpdate = (
      order.sellerId === req.user._id || 
      req.user.role === 'admin' ||
      (order.buyerId === req.user._id && status === 'cancelled')
    );

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update order status
    await order.updateStatus(status, note, req.user._id);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/orders/{id}/cancel:
 *   post:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (order.buyerId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order
    order.status = 'cancelled';
    order.cancellation = {
      reason: reason || 'Cancelled by customer',
      requestedBy: 'buyer',
      requestedAt: new Date(),
      approvedAt: new Date()
    };

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;