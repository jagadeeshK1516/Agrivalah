const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('../src/utils/logger');

// Migration functions
const migrations = [
  {
    version: '1.0.0',
    description: 'Initial migration - create indexes',
    up: async () => {
      const db = mongoose.connection.db;
      
      // Create indexes for User collection
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ phone: 1 }, { sparse: true });
      await db.collection('users').createIndex({ role: 1 });
      await db.collection('users').createIndex({ verified: 1 });
      
      // Create indexes for SellerProfile collection
      await db.collection('sellerprofiles').createIndex({ userId: 1 }, { unique: true });
      await db.collection('sellerprofiles').createIndex({ sellerType: 1 });
      await db.collection('sellerprofiles').createIndex({ kycStatus: 1 });
      await db.collection('sellerprofiles').createIndex({ 'farmerDetails.location': 1 });
      
      // Create indexes for Product collection
      await db.collection('products').createIndex({ sellerId: 1 });
      await db.collection('products').createIndex({ category: 1 });
      await db.collection('products').createIndex({ status: 1 });
      await db.collection('products').createIndex({ organic: 1 });
      await db.collection('products').createIndex({ price: 1 });
      await db.collection('products').createIndex({ 'location.pinCode': 1 });
      await db.collection('products').createIndex({ 
        title: 'text', 
        description: 'text', 
        tags: 'text' 
      });
      
      // Create indexes for Order collection
      await db.collection('orders').createIndex({ buyerId: 1 });
      await db.collection('orders').createIndex({ sellerId: 1 });
      await db.collection('orders').createIndex({ status: 1 });
      await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
      await db.collection('orders').createIndex({ createdAt: -1 });
      
      // Create indexes for OTP collection
      await db.collection('otps').createIndex({ target: 1, purpose: 1 });
      await db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      
      // Create indexes for RefreshToken collection
      await db.collection('refreshtokens').createIndex({ userId: 1 });
      await db.collection('refreshtokens').createIndex({ token: 1 }, { unique: true });
      await db.collection('refreshtokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      
      logger.info('Created all database indexes');
    },
    down: async () => {
      // Drop indexes if needed
      logger.info('Migration rollback completed');
    }
  }
];

// Migration tracking collection
const MigrationSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  description: String,
  appliedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.model('Migration', MigrationSchema);

async function runMigrations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'agrivalah'
    });

    logger.info('Connected to MongoDB for migrations');

    // Get applied migrations
    const appliedMigrations = await Migration.find().sort({ appliedAt: 1 });
    const appliedVersions = appliedMigrations.map(m => m.version);

    logger.info(`Found ${appliedMigrations.length} applied migrations`);

    // Run pending migrations
    for (const migration of migrations) {
      if (!appliedVersions.includes(migration.version)) {
        logger.info(`Running migration ${migration.version}: ${migration.description}`);
        
        try {
          await migration.up();
          
          // Record migration as applied
          await Migration.create({
            version: migration.version,
            description: migration.description
          });
          
          logger.info(`✅ Migration ${migration.version} completed successfully`);
        } catch (error) {
          logger.error(`❌ Migration ${migration.version} failed:`, error);
          throw error;
        }
      } else {
        logger.info(`⏭️  Migration ${migration.version} already applied`);
      }
    }

    logger.info('✅ All migrations completed successfully');

  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
}

async function rollbackMigration(version) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'agrivalah'
    });

    const migration = migrations.find(m => m.version === version);
    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    logger.info(`Rolling back migration ${version}`);
    await migration.down();
    
    await Migration.deleteOne({ version });
    logger.info(`✅ Migration ${version} rolled back successfully`);

  } catch (error) {
    logger.error('❌ Migration rollback failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// CLI interface
const command = process.argv[2];
const version = process.argv[3];

if (command === 'up') {
  runMigrations();
} else if (command === 'down' && version) {
  rollbackMigration(version);
} else {
  console.log('Usage:');
  console.log('  node migrate.js up                 - Run all pending migrations');
  console.log('  node migrate.js down <version>     - Rollback specific migration');
  process.exit(1);
}

module.exports = { runMigrations, rollbackMigration };