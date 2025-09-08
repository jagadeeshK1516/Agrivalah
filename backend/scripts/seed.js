const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const SellerProfile = require('../src/models/SellerProfile');
const Product = require('../src/models/Product');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@agrivalah.com',
    passwordHash: 'Admin@123',
    role: 'admin',
    verified: true
  },
  {
    name: 'John Customer',
    email: 'customer@test.com',
    passwordHash: 'Test@123',
    role: 'customer',
    verified: true
  },
  {
    name: 'Jane Mitra',
    email: 'mitra@test.com',
    passwordHash: 'Test@123',
    role: 'mitra',
    verified: true,
    mitraDetails: {
      investmentAmount: 42000,
      expectedValue: 54000,
      joinedDate: new Date(),
      currentROI: 12000
    }
  },
  {
    name: 'Ramesh Farmer',
    email: 'farmer@test.com',
    passwordHash: 'Test@123',
    role: 'farmer',
    verified: true,
    address: {
      street: 'Village Kothapally',
      city: 'Nalgonda',
      state: 'Telangana',
      pinCode: '508001',
      country: 'India'
    }
  },
  {
    name: 'Sunita Reseller',
    email: 'reseller@test.com',
    passwordHash: 'Test@123',
    role: 'reseller',
    verified: true
  }
];

const sampleProducts = [
  {
    title: 'Organic Tomatoes',
    description: 'Fresh organic tomatoes grown without pesticides. Rich in vitamins and perfect for daily cooking.',
    price: 60,
    unit: 'kg',
    stock: 100,
    category: 'vegetables',
    organic: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f6d20?w=400',
      alt: 'Fresh organic tomatoes',
      isPrimary: true
    }],
    farmerInfo: {
      name: 'Ramesh Farmer',
      location: 'Nalgonda, Telangana',
      farmingMethod: 'Organic',
      harvestDate: new Date()
    },
    location: {
      state: 'Telangana',
      district: 'Nalgonda',
      pinCode: '508001'
    },
    status: 'active'
  },
  {
    title: 'Organic Spinach',
    description: 'Fresh green spinach leaves packed with iron and nutrients. Grown organically without chemicals.',
    price: 40,
    unit: 'bunch',
    stock: 50,
    category: 'vegetables',
    organic: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1576045057995-568f588f21fb?w=400',
      alt: 'Fresh organic spinach',
      isPrimary: true
    }],
    farmerInfo: {
      name: 'Ramesh Farmer',
      location: 'Nalgonda, Telangana',
      farmingMethod: 'Organic',
      harvestDate: new Date()
    },
    location: {
      state: 'Telangana',
      district: 'Nalgonda',
      pinCode: '508001'
    },
    status: 'active'
  },
  {
    title: 'Basmati Rice',
    description: 'Premium quality aged Basmati rice with long grains and aromatic fragrance. Perfect for biryanis.',
    price: 150,
    unit: 'kg',
    stock: 200,
    category: 'grains',
    organic: false,
    images: [{
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      alt: 'Premium Basmati rice',
      isPrimary: true
    }],
    location: {
      state: 'Punjab',
      district: 'Amritsar',
      pinCode: '143001'
    },
    status: 'active'
  },
  {
    title: 'Cold Pressed Mustard Oil',
    description: 'Pure cold pressed mustard oil extracted using traditional methods. Rich in nutrients and flavor.',
    price: 220,
    unit: 'L',
    stock: 30,
    category: 'oils',
    organic: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1626380126294-a7b5a884489b?w=400',
      alt: 'Cold pressed mustard oil',
      isPrimary: true
    }],
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      pinCode: '302001'
    },
    status: 'active'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'agrivalah'
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await SellerProfile.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.role})`);
    }

    // Create seller profile for farmer
    const farmer = createdUsers.find(u => u.role === 'farmer');
    if (farmer) {
      const farmerProfile = new SellerProfile({
        userId: farmer._id,
        sellerType: 'farmer',
        kycStatus: 'approved',
        farmerDetails: {
          acres: 5.5,
          soilType: 'alluvial',
          cropsGrown: ['Vegetables', 'Grains'],
          cropDetails: 'Growing organic tomatoes, spinach, and other seasonal vegetables',
          location: 'Nalgonda, Telangana',
          pinCode: '508001',
          language: 'Telugu'
        },
        isActive: true,
        verifiedAt: new Date()
      });
      await farmerProfile.save();
      console.log('Created farmer profile');
    }

    // Create seller profile for reseller
    const reseller = createdUsers.find(u => u.role === 'reseller');
    if (reseller) {
      const resellerProfile = new SellerProfile({
        userId: reseller._id,
        sellerType: 'reseller',
        kycStatus: 'approved',
        resellerDetails: {
          businessName: 'Sunita Organic Store',
          businessType: 'retail_shop',
          gstNumber: '07AABCU9603R1ZM',
          businessAddress: 'Shop No. 15, Market Road, Hyderabad, Telangana - 500001',
          preferredCategories: ['Vegetables', 'Fruits', 'Grains']
        },
        isActive: true,
        verifiedAt: new Date()
      });
      await resellerProfile.save();
      console.log('Created reseller profile');
    }

    // Create products
    for (const productData of sampleProducts) {
      // Assign farmer as seller for organic products
      if (productData.organic && farmer) {
        productData.sellerId = farmer._id;
      } else if (reseller) {
        productData.sellerId = reseller._id;
      }

      const product = new Product(productData);
      await product.save();
      console.log(`Created product: ${product.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@agrivalah.com / Admin@123');
    console.log('Customer: customer@test.com / Test@123');
    console.log('Mitra: mitra@test.com / Test@123');
    console.log('Farmer: farmer@test.com / Test@123');
    console.log('Reseller: reseller@test.com / Test@123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };