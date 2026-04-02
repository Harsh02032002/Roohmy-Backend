#!/usr/bin/env node
/**
 * Robust MongoDB Seeding with Retry Logic
 * Tries multiple connection options
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connection options to try
const connectionOptions = {
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000
};

// Property Type Schema
const PropertyTypeSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String
});

// City Schema
const CitySchema = new mongoose.Schema({
  name: String,
  state: String,
  colleges: [String]
});

// Area Schema
const AreaSchema = new mongoose.Schema({
  name: String,
  city: String,
  zone: String,
  landmarks: [String]
});

// Property Schema
const PropertySchema = new mongoose.Schema({
  visitId: String,
  propertyInfo: {
    name: String,
    propertyType: String,
    area: String,
    city: String,
    rent: Number,
    genderSuitability: String,
    totalSeats: Number
  },
  status: String,
  isLiveOnWebsite: Boolean,
  generatedCredentials: {
    loginId: String,
    ownerName: String
  },
  approvedBy: String
});

const PropertyType = mongoose.model('PropertyType', PropertyTypeSchema);
const City = mongoose.model('City', CitySchema);
const Area = mongoose.model('Area', AreaSchema);
const Property = mongoose.model('ApprovedProperty', PropertySchema);

const propertyTypes = [
  { title: 'PG', category: 'PG', description: 'Paying Guest' },
  { title: 'Hostel', category: 'Hostel', description: 'Student Hostel' },
  { title: 'Flat', category: 'Flat', description: 'Apartment' },
  { title: 'Villa', category: 'Villa', description: 'Villa' }
];

const cities = [
  { name: 'Kota', state: 'Rajasthan', colleges: ['Allen', 'FIITJEE', 'Bansal'] },
  { name: 'Indore', state: 'Madhya Pradesh', colleges: ['IIT-Indore', 'MITS'] },
  { name: 'Jaipur', state: 'Rajasthan', colleges: ['MNIT', 'RTU'] },
  { name: 'Delhi', state: 'Delhi', colleges: ['IIT-Delhi', 'Delhi Uni'] }
];

const areas = [
  { name: 'Dadabari', city: 'Kota', zone: 'North', landmarks: ['Station'] },
  { name: 'Nayapura', city: 'Kota', zone: 'Central', landmarks: ['Hospital'] },
  { name: 'Rajwada', city: 'Indore', zone: 'Central', landmarks: ['Market'] }
];

const properties = [
  {
    visitId: 'KOTA-001',
    propertyInfo: {
      name: 'Cozy PG',
      propertyType: 'PG',
      area: 'Dadabari',
      city: 'Kota',
      rent: 8000,
      genderSuitability: 'Co-ed',
      totalSeats: 15
    },
    status: 'approved',
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'kota_001', ownerName: 'Owner 1' }
  }
];

async function connectWithRetry(mongoUri, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔗 Connection attempt ${i + 1}/${maxRetries}...`);
      await mongoose.connect(mongoUri, connectionOptions);
      console.log('✅ Connected to MongoDB!');
      return true;
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed: ${error.message}`);
      if (i < maxRetries - 1) {
        console.log('⏳ Waiting 5 seconds before retry...\n');
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }
  return false;
}

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in .env');
    }

    console.log('\n🌱 Starting Database Seeding (With Retry Logic)\n');
    
    // Try to connect
    const connected = await connectWithRetry(mongoUri, 3);
    
    if (!connected) {
      console.error('\n❌ Could not connect to MongoDB after 3 attempts');
      console.log('\n💡 Troubleshooting:');
      console.log('  1. Check internet connection');
      console.log('  2. Go to MongoDB Atlas > Network Access');
      console.log('  3. Whitelist your IP: 0.0.0.0/0');
      console.log('  4. Restart computer/network\n');
      process.exit(1);
    }

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await PropertyType.deleteMany({});
    await City.deleteMany({});
    await Area.deleteMany({});
    await Property.deleteMany({});

    // Seed data
    console.log('📝 Seeding property types...');
    await PropertyType.insertMany(propertyTypes);
    console.log(`✅ Seeded ${propertyTypes.length} property types`);

    console.log('📍 Seeding cities...');
    await City.insertMany(cities);
    console.log(`✅ Seeded ${cities.length} cities`);

    console.log('🏘️  Seeding areas...');
    await Area.insertMany(areas);
    console.log(`✅ Seeded ${areas.length} areas`);

    console.log('🏠 Seeding properties...');
    await Property.insertMany(properties);
    console.log(`✅ Seeded ${properties.length} properties`);

    console.log('\n✅ All data seeded successfully!\n');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
