const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  target: {
    type: String, // email or phone number
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    minlength: [6, 'OTP must be 6 digits'],
    maxlength: [6, 'OTP must be 6 digits']
  },
  purpose: {
    type: String,
    required: true,
    enum: ['signup', 'login', 'password_reset', 'phone_verification', 'email_verification', 'transaction']
  },
  attempts: {
    type: Number,
    default: 0,
    max: [3, 'Maximum 3 attempts allowed']
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    userId: String // if associated with existing user
  }
}, {
  timestamps: true
});

// Index for efficient cleanup
otpSchema.index({ target: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Method to verify OTP
otpSchema.methods.verify = function(inputCode) {
  if (this.isUsed) {
    throw new Error('OTP already used');
  }
  
  if (this.expiresAt < new Date()) {
    throw new Error('OTP expired');
  }
  
  if (this.attempts >= 3) {
    throw new Error('Maximum attempts exceeded');
  }
  
  this.attempts += 1;
  
  if (this.code !== inputCode) {
    this.save();
    throw new Error('Invalid OTP');
  }
  
  this.isUsed = true;
  this.save();
  return true;
};

// Clean up expired OTPs (runs automatically via TTL index)
// Additional cleanup method for manual triggers
otpSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return result.deletedCount;
};

module.exports = mongoose.model('OTP', otpSchema);