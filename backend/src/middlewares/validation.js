const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  phone: body('phone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  objectId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
};

// User validation rules
const userValidation = {
  register: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('role')
      .optional()
      .isIn(['customer', 'mitra'])
      .withMessage('Role must be either customer or mitra'),
    handleValidationErrors
  ],
  
  login: [
    body('emailOrPhone')
      .notEmpty()
      .withMessage('Email or phone is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors
  ],
  
  verifyOTP: [
    body('emailOrPhone')
      .notEmpty()
      .withMessage('Email or phone is required'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be a 6-digit number'),
    handleValidationErrors
  ]
};

// Seller validation rules
const sellerValidation = {
  initSeller: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('designation')
      .isIn(['farmer', 'reseller', 'startup', 'service'])
      .withMessage('Invalid seller type'),
    handleValidationErrors
  ],
  
  farmerDetails: [
    body('acres')
      .isFloat({ min: 0.1 })
      .withMessage('Acres must be a positive number'),
    body('soilType')
      .isIn(['sandy', 'loamy', 'clay', 'alluvial', 'black', 'laterite', 'red'])
      .withMessage('Invalid soil type'),
    body('cropsGrown')
      .isArray({ min: 1 })
      .withMessage('At least one crop type must be selected'),
    body('location')
      .notEmpty()
      .withMessage('Location is required'),
    body('pinCode')
      .isPostalCode('IN')
      .withMessage('Invalid pin code'),
    handleValidationErrors
  ],
  
  resellerDetails: [
    body('businessName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Business name is required'),
    body('businessType')
      .isIn(['individual_reseller', 'retail_shop', 'online_seller', 'wholesale_distributor'])
      .withMessage('Invalid business type'),
    body('businessAddress')
      .notEmpty()
      .withMessage('Business address is required'),
    handleValidationErrors
  ],
  
  startupDetails: [
    body('companyName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Company name is required'),
    body('companyAddress')
      .notEmpty()
      .withMessage('Company address is required'),
    body('natureOfBusiness')
      .isIn(['agri_saas', 'farm_equipment', 'agri_fintech', 'logistics', 'advisory', 'drone_services', 'iot_solutions'])
      .withMessage('Invalid nature of business'),
    handleValidationErrors
  ],
  
  serviceDetails: [
    body('selectedServices')
      .isArray({ min: 1 })
      .withMessage('At least one service must be selected'),
    handleValidationErrors
  ]
};

// Product validation rules
const productValidation = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Product title must be between 2 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('unit')
      .isIn(['kg', 'g', 'L', 'ml', 'piece', 'bunch', 'dozen', 'quintal', 'ton'])
      .withMessage('Invalid unit'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('category')
      .isIn(['vegetables', 'fruits', 'grains', 'spices', 'oils', 'dairy', 'pulses', 'seeds', 'nuts', 'herbs'])
      .withMessage('Invalid category'),
    handleValidationErrors
  ],
  
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Product title must be between 2 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    handleValidationErrors
  ]
};

// Order validation rules
const orderValidation = {
  create: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
    body('deliveryAddress.name')
      .trim()
      .notEmpty()
      .withMessage('Delivery name is required'),
    body('deliveryAddress.phone')
      .isMobilePhone('en-IN')
      .withMessage('Valid phone number is required'),
    body('deliveryAddress.pinCode')
      .isPostalCode('IN')
      .withMessage('Valid pin code is required'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  userValidation,
  sellerValidation,
  productValidation,
  orderValidation,
  commonValidations
};