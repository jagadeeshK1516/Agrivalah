const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  revokedAt: Date,
  revokedBy: String, // user ID who revoked it
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceId: String,
    lastUsed: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
refreshTokenSchema.index({ userId: 1, revoked: 1 });
refreshTokenSchema.index({ token: 1, revoked: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

// Method to revoke token
refreshTokenSchema.methods.revoke = function(revokedBy) {
  this.revoked = true;
  this.revokedAt = new Date();
  this.revokedBy = revokedBy;
  return this.save();
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllForUser = async function(userId) {
  const result = await this.updateMany(
    { userId: userId, revoked: false },
    { 
      revoked: true, 
      revokedAt: new Date(),
      revokedBy: userId 
    }
  );
  return result.modifiedCount;
};

// Static method to cleanup expired tokens
refreshTokenSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { revoked: true, revokedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // 7 days old revoked tokens
    ]
  });
  return result.deletedCount;
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);