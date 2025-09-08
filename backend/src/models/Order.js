const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyerId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  sellerId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: String,
      ref: 'Product',
      required: true
    },
    productName: String, // Snapshot at time of order
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unit: String,
    pricePerUnit: Number,
    totalPrice: Number,
    productImage: String // Primary image URL
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  deliveryAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pinCode: String,
    landmark: String,
    addressType: { type: String, enum: ['home', 'work', 'other'], default: 'home' }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned',
      'refunded'
    ],
    default: 'pending'
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cod', 'online', 'wallet', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentGateway: String, // razorpay, stripe, etc.
    paidAt: Date,
    refundId: String,
    refundedAt: Date
  },
  delivery: {
    method: {
      type: String,
      enum: ['self_pickup', 'home_delivery', 'courier'],
      default: 'home_delivery'
    },
    partner: String, // delivery partner name
    trackingId: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    deliveryInstructions: String
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: String // user ID who updated
  }],
  cancellation: {
    reason: String,
    requestedBy: { type: String, enum: ['buyer', 'seller', 'admin'] },
    requestedAt: Date,
    approvedAt: Date,
    refundAmount: Number
  },
  rating: {
    productRating: { type: Number, min: 1, max: 5 },
    deliveryRating: { type: Number, min: 1, max: 5 },
    overallRating: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  notes: {
    buyerNotes: String,
    sellerNotes: String,
    adminNotes: String
  }
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
orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp.slice(-6)}${random}`;
    
    // Add initial timeline entry
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status updated to ${newStatus}`,
    updatedBy: updatedBy
  });
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);