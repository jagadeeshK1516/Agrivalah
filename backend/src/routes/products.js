const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, authorize, optionalAuth } = require('../middlewares/auth');
const { productValidation } = require('../middlewares/validation');
const uploadService = require('../services/uploadService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
  authenticateToken,
  authorize(['farmer', 'reseller', 'agritech_startup']),
  productValidation.create,
  async (req, res) => {
    try {
      const productData = {
        ...req.body,
        sellerId: req.user._id,
        status: 'draft'
      };

      // Set location from user's profile if not provided
      if (!productData.location && req.user.address) {
        productData.location = {
          state: req.user.address.state,
          district: req.user.address.city,
          pinCode: req.user.address.pinCode
        };
      }

      // Set farmer info for traceability
      if (req.user.role === 'farmer') {
        productData.farmerInfo = {
          name: req.user.name,
          location: req.user.address?.city || 'Unknown',
          farmingMethod: 'Organic', // Default, can be customized
          harvestDate: new Date()
        };
      }

      const product = new Product(productData);
      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });

    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get products with filters
 *     tags: [Products]
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      organic,
      sellerId,
      location,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (organic) filter.organic = organic === 'true';
    if (sellerId) filter.sellerId = sellerId;
    if (location) filter['location.pinCode'] = location;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort query
    const sortQuery = {};
    sortQuery[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sellerId', 'name profilePic')
        .lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('sellerId', 'name email phone profilePic address')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await Product.findByIdAndUpdate(id, { $inc: { 'metrics.viewCount': 1 } });

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    logger.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id',
  authenticateToken,
  productValidation.update,
  async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if user owns the product
      if (product.sellerId !== req.user._id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }

      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });

    } catch (error) {
      logger.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/products/{id}/images:
 *   post:
 *     summary: Upload product images
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/images',
  authenticateToken,
  uploadService.multiple('images', 5, 'products'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { uploadResult } = req;

      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if user owns the product
      if (product.sellerId !== req.user._id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }

      // Add images to product
      const newImages = uploadResult.files.map((file, index) => ({
        url: file.url,
        alt: `${product.title} image ${index + 1}`,
        isPrimary: index === 0 && product.images.length === 0
      }));

      product.images.push(...newImages);
      await product.save();

      res.json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
          product,
          uploadedImages: uploadResult.files
        }
      });

    } catch (error) {
      logger.error('Product image upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Image upload failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/products/categories:
 *   get:
 *     summary: Get product categories
 *     tags: [Products]
 */
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = [
      { name: 'Vegetables', icon: 'Sprout' },
      { name: 'Fruits', icon: 'Apple' },
      { name: 'Grains', icon: 'Wheat' },
      { name: 'Spices', icon: 'Utensils' },
      { name: 'Oils', icon: 'Droplets' },
      { name: 'Dairy', icon: 'Milk' },
      { name: 'Pulses', icon: 'Circle' },
      { name: 'Seeds', icon: 'Sprout' },
      { name: 'Nuts', icon: 'Nut' },
      { name: 'Herbs', icon: 'Leaf' }
    ];

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/v1/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 */
router.get('/meta/featured', optionalAuth, async (req, res) => {
  try {
    const featuredProducts = await Product.find({
      status: 'active',
      featuredUntil: { $gte: new Date() }
    })
    .sort({ 'metrics.orderCount': -1, 'metrics.rating': -1 })
    .limit(10)
    .populate('sellerId', 'name profilePic')
    .lean();

    res.json({
      success: true,
      data: featuredProducts
    });

  } catch (error) {
    logger.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;