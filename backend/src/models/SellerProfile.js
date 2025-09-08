const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  sellerType: {
    type: String,
    required: true,
    enum: ['farmer', 'reseller', 'agritech_startup', 'service_provider']
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  kycDocuments: [{
    type: { type: String, enum: ['id_proof', 'address_proof', 'business_license', 'tax_document'] },
    url: String, // S3 URL
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],
  
  // Farmer-specific details
  farmerDetails: {
    acres: Number,
    soilType: {
      type: String,
      enum: ['sandy', 'loamy', 'clay', 'alluvial', 'black', 'laterite', 'red']
    },
    cropsGrown: [String],
    cropDetails: String,
    location: String,
    pinCode: String,
    language: String,
    farmImages: [String], // S3 URLs
    certifications: [{
      type: String, // organic, iso, etc.
      authority: String,
      validUntil: Date,
      documentUrl: String
    }]
  },
  
  // Reseller-specific details
  resellerDetails: {
    businessName: String,
    businessType: {
      type: String,
      enum: ['individual_reseller', 'retail_shop', 'online_seller', 'wholesale_distributor']
    },
    gstNumber: String,
    businessAddress: String,
    preferredCategories: [String],
    storeImages: [String], // S3 URLs
    operatingHours: {
      open: String,
      close: String,
      days: [String]
    }
  },
  
  // Startup-specific details
  startupDetails: {
    companyName: String,
    registrationNumber: String,
    companyAddress: String,
    natureOfBusiness: {
      type: String,
      enum: ['agri_saas', 'farm_equipment', 'agri_fintech', 'logistics', 'advisory', 'drone_services', 'iot_solutions']
    },
    yearsInOperation: Number,
    collaborationAreas: [String],
    fundingStage: String,
    teamSize: Number,
    previousProjects: [{
      name: String,
      description: String,
      duration: String,
      outcome: String
    }]
  },
  
  // Service Provider-specific details
  serviceDetails: {
    selectedServices: [String],
    serviceArea: String, // Geographic coverage
    
    // Equipment details for different services
    tractorServices: {
      vehicleNumber: String,
      model: String,
      rentPerDay: Number,
      availability: [String] // days of week
    },
    
    equipmentServices: {
      equipmentDetails: String,
      serviceCharges: String,
      equipmentList: [{
        name: String,
        model: String,
        condition: String,
        ratePerHour: Number
      }]
    },
    
    storageServices: {
      storageCapacity: String,
      storageType: {
        type: String,
        enum: ['grain', 'vegetables', 'fruits', 'mixed']
      },
      rentalModel: String,
      temperature: String,
      humidity: String
    }
  },
  
  // Common business metrics
  businessMetrics: {
    totalEarnings: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    customerRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    responseTime: { type: Number, default: 24 }, // in hours
    successRate: { type: Number, default: 100 } // percentage
  },
  
  // Verification and status
  isActive: { type: Boolean, default: true },
  verifiedAt: Date,
  suspendedAt: Date,
  suspensionReason: String
  
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
sellerProfileSchema.index({ userId: 1 });
sellerProfileSchema.index({ sellerType: 1 });
sellerProfileSchema.index({ kycStatus: 1 });
sellerProfileSchema.index({ isActive: 1 });
sellerProfileSchema.index({ 'farmerDetails.location': 1 });
sellerProfileSchema.index({ 'serviceDetails.serviceArea': 1 });

module.exports = mongoose.model('SellerProfile', sellerProfileSchema);