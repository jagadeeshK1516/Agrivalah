const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  sellerId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  images: [{
    url: String, // S3 URL
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'L', 'ml', 'piece', 'bunch', 'dozen', 'quintal', 'ton']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'spices', 'oils', 'dairy', 'pulses', 'seeds', 'nuts', 'herbs']
  },
  subcategory: String,
  tags: [String],
  
  // Quality and certification
  organic: {
    type: Boolean,
    default: false
  },
  certifications: [{
    type: String, // organic, fair_trade, iso, etc.
    authority: String,
    certificateUrl: String // S3 URL
  }],
  
  // Farmer traceability
  farmerInfo: {
    name: String,
    location: String,
    farmingMethod: String,
    harvestDate: Date,
    qrCode: String // QR code data for traceability
  },
  
  // Location and availability
  location: {
    state: String,
    district: String,
    pinCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Nutritional information (optional)
  nutrition: {
    calories: Number, // per 100g
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    vitamins: [String]
  },
  
  // Availability and seasonality
  availability: {
    inSeason: Boolean,
    availableFrom: Date,
    availableUntil: Date,
    estimatedHarvest: Date
  },
  
  // Pricing and offers
  pricing: {
    originalPrice: Number,
    discountedPrice: Number,
    bulkPricing: [{
      minQuantity: Number,
      maxQuantity: Number,
      pricePerUnit: Number
    }],
    seasonalDiscount: {
      percentage: Number,
      validFrom: Date,
      validUntil: Date
    }
  },
  
  // Product metrics
  metrics: {
    viewCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
  },
  
  // Status and moderation
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock', 'under_review', 'rejected'],
    default: 'draft'
  },
  moderationNotes: String,
  
  // SEO and search
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  metaTitle: String,
  metaDescription: String,
  
  // Timestamps
  publishedAt: Date,
  featuredUntil: Date
  
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for efficient queries
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ organic: 1 });
productSchema.index({ 'location.pinCode': 1 });
productSchema.index({ 'location.state': 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'metrics.rating': -1 });
productSchema.index({ 'metrics.orderCount': -1 });
productSchema.index({ price: 1 });

// Text search index
productSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  'farmerInfo.name': 'text'
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + this._id.slice(-6);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);