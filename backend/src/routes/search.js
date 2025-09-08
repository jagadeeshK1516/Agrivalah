const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const { optionalAuth } = require('../middlewares/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Unified search across products, sellers, and services
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, products, sellers, services]
 *         description: Search type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (pincode or city)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      q: query,
      type = 'all',
      category,
      location,
      organic,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchResults = {
      products: [],
      sellers: [],
      services: [],
      total: 0
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Search Products
    if (type === 'all' || type === 'products') {
      const productFilter = {
        status: 'active',
        $text: { $search: query }
      };

      if (category) productFilter.category = category;
      if (organic) productFilter.organic = organic === 'true';
      if (location) {
        productFilter.$or = [
          { 'location.pinCode': location },
          { 'location.district': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } }
        ];
      }
      if (minPrice || maxPrice) {
        productFilter.price = {};
        if (minPrice) productFilter.price.$gte = parseFloat(minPrice);
        if (maxPrice) productFilter.price.$lte = parseFloat(maxPrice);
      }

      const products = await Product.find(productFilter)
        .populate('sellerId', 'name profilePic')
        .sort({ score: { $meta: 'textScore' }, 'metrics.orderCount': -1 })
        .skip(type === 'products' ? skip : 0)
        .limit(type === 'products' ? parseInt(limit) : 5)
        .lean();

      searchResults.products = products.map(product => ({
        ...product,
        type: 'product'
      }));
    }

    // Search Sellers
    if (type === 'all' || type === 'sellers') {
      const sellerFilter = {
        verified: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      };

      if (location) {
        sellerFilter['address.city'] = { $regex: location, $options: 'i' };
      }

      const sellers = await User.find(sellerFilter)
        .select('name email profilePic role address createdAt')
        .sort({ 'meta.loginCount': -1 })
        .skip(type === 'sellers' ? skip : 0)
        .limit(type === 'sellers' ? parseInt(limit) : 5)
        .lean();

      // Enrich with seller profiles
      for (const seller of sellers) {
        const profile = await SellerProfile.findOne({ userId: seller._id })
          .select('sellerType kycStatus businessMetrics farmerDetails resellerDetails')
          .lean();
        
        seller.sellerProfile = profile;
        seller.type = 'seller';
      }

      searchResults.sellers = sellers;
    }

    // Search Services (from service providers)
    if (type === 'all' || type === 'services') {
      const serviceFilter = {
        sellerType: 'service',
        kycStatus: 'approved',
        isActive: true,
        $or: [
          { 'serviceDetails.selectedServices': { $regex: query, $options: 'i' } },
          { 'serviceDetails.serviceArea': { $regex: query, $options: 'i' } }
        ]
      };

      if (location) {
        serviceFilter['serviceDetails.serviceArea'] = { $regex: location, $options: 'i' };
      }

      const services = await SellerProfile.find(serviceFilter)
        .populate('userId', 'name email phone profilePic address')
        .sort({ 'businessMetrics.customerRating': -1 })
        .skip(type === 'services' ? skip : 0)
        .limit(type === 'services' ? parseInt(limit) : 5)
        .lean();

      searchResults.services = services.map(service => ({
        ...service,
        type: 'service'
      }));
    }

    // Calculate total results
    searchResults.total = searchResults.products.length + 
                         searchResults.sellers.length + 
                         searchResults.services.length;

    // If searching for all, combine and sort results
    if (type === 'all') {
      const allResults = [
        ...searchResults.products,
        ...searchResults.sellers,
        ...searchResults.services
      ];

      // Simple relevance sorting (can be enhanced)
      allResults.sort((a, b) => {
        const aScore = (a.metrics?.orderCount || 0) + (a.businessMetrics?.customerRating || 0) * 20;
        const bScore = (b.metrics?.orderCount || 0) + (b.businessMetrics?.customerRating || 0) * 20;
        return bScore - aScore;
      });

      return res.json({
        success: true,
        data: {
          results: allResults.slice(skip, skip + parseInt(limit)),
          breakdown: {
            products: searchResults.products.length,
            sellers: searchResults.sellers.length,
            services: searchResults.services.length
          },
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: searchResults.total,
            pages: Math.ceil(searchResults.total / parseInt(limit))
          }
        }
      });
    }

    // Return specific type results
    const typeResults = searchResults[type] || [];
    
    res.json({
      success: true,
      data: {
        results: typeResults,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: typeResults.length,
          pages: Math.ceil(typeResults.length / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

/**
 * @swagger
 * /api/v1/search/suggestions:
 *   get:
 *     summary: Get search suggestions
 *     tags: [Search]
 */
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get product suggestions
    const productSuggestions = await Product.aggregate([
      {
        $match: {
          status: 'active',
          title: { $regex: query, $options: 'i' }
        }
      },
      {
        $project: {
          suggestion: '$title',
          type: { $literal: 'product' },
          category: 1,
          _id: 0
        }
      },
      { $limit: parseInt(limit) / 2 }
    ]);

    // Get category suggestions
    const categories = [
      'vegetables', 'fruits', 'grains', 'spices', 
      'oils', 'dairy', 'pulses', 'seeds', 'nuts', 'herbs'
    ];
    
    const categorySuggestions = categories
      .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
      .map(cat => ({
        suggestion: cat.charAt(0).toUpperCase() + cat.slice(1),
        type: 'category'
      }))
      .slice(0, parseInt(limit) / 2);

    const suggestions = [...productSuggestions, ...categorySuggestions]
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    logger.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
});

module.exports = router;