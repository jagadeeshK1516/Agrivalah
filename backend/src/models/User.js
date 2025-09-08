const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email or phone is required'],
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'mitra', 'farmer', 'reseller', 'agritech_startup', 'service_provider', 'admin'],
    default: 'customer'
  },
  // Mitra specific fields
  subscriptionType: {
    type: String,
    enum: ['subscription', 'donation'],
    default: null
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  creditsEarned: {
    type: Number,
    default: 0
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: null
  },
  subscriptionDate: {
    type: Date,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  profilePic: {
    type: String, // S3 URL
    default: null
  },
  videoUrl: {
    type: String, // S3 URL for video introduction
    default: null
  },
  meta: {
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    preferredLanguage: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pinCode: String,
    country: { type: String, default: 'India' }
  },
  // Mitra-specific fields
  mitraDetails: {
    investmentAmount: { type: Number, default: 42000 },
    expectedValue: { type: Number, default: 54000 },
    joinedDate: Date,
    currentROI: { type: Number, default: 0 },
    monthlyKitStatus: { type: String, enum: ['pending', 'delivered', 'scheduled'], default: 'pending' }
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for efficient queries
userSchema.index({ email: 1, phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ verified: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to update login metadata
userSchema.methods.updateLoginMeta = function() {
  this.meta.lastLogin = new Date();
  this.meta.loginCount += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);