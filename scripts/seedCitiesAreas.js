require('dotenv').config();
const connectDB = require('../config/database');
const mongoose = require('mongoose');

// Define schemas inline
const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: String,
  country: { type: String, default: 'India' },
  population: Number,
  colleges: [String],
  createdAt: { type: Date, default: Date.now }
});

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  zone: String,
  landmarks: [String],
  createdAt: { type: Date, default: Date.now }
});

const City = mongoose.model('City', CitySchema);
const Area = mongoose.model('Area', AreaSchema);

const citiesData = [
  {
    name: 'Kota',
    state: 'Rajasthan',
    colleges: ['Allen', 'FIITJEE', 'Bansal Classes', 'Resonance'],
    population: 1200000
  },
  {
    name: 'Indore',
    state: 'Madhya Pradesh',
    colleges: ['IIT-Indore', 'MITS', 'NRI Institute', 'Devi Ahilya University'],
    population: 2100000
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    colleges: ['IIT-JRX', 'BITS-Pilani', 'MNIT', 'RTU'],
    population: 3046000
  },
  {
    name: 'Delhi',
    state: 'Delhi',
    colleges: ['Delhi University', 'IIT-Delhi', 'NSIT', 'Jamia'],
    population: 30927000
  },
  {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    colleges: ['IISER-Bhopal', 'MATS University', 'Barkatullah University'],
    population: 1782000
  },
  {
    name: 'Nagpur',
    state: 'Maharashtra',
    colleges: ['Nagpur University', 'VNIT', 'RCOEM', 'NIT Nagpur'],
    population: 2405000
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    colleges: ['IIT-Mumbai', 'Mumbai University', 'NMIMS', 'AISSMS'],
    population: 20411000
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    colleges: ['IIT-Bangalore', 'VTU', 'RV University', 'BMSCE'],
    population: 8400000
  }
];

const areasData = [
  // Kota areas
  { city: 'Kota', name: 'Dadabari', zone: 'North', landmarks: ['Railway Station', 'Main Road'] },
  { city: 'Kota', name: 'Nayapura', zone: 'Central', landmarks: ['Hospital', 'Market'] },
  { city: 'Kota', name: 'Mahavir Nagar', zone: 'East', landmarks: ['Park', 'School'] },
  { city: 'Kota', name: 'Shreenath Puram', zone: 'West', landmarks: ['Temple', 'Bus Stand'] },
  { city: 'Kota', name: 'Rajeev Nagar', zone: 'South', landmarks: ['College', 'PG Area'] },
  
  // Indore areas
  { city: 'Indore', name: 'Rajwada', zone: 'Central', landmarks: ['Palace', 'Market'] },
  { city: 'Indore', name: 'Khajrana', zone: 'North', landmarks: ['Temple', 'Hospital'] },
  { city: 'Indore', name: 'Vijayanagar', zone: 'East', landmarks: ['Market', 'Bus Stand'] },
  { city: 'Indore', name: 'Palasia', zone: 'Central', landmarks: ['Shopping', 'Restaurants'] },
  { city: 'Indore', name: 'Rau', zone: 'West', landmarks: ['Station', 'Market'] },
  
  // Jaipur areas
  { city: 'Jaipur', name: 'C Scheme', zone: 'Central', landmarks: ['Market', 'Hospitals'] },
  { city: 'Jaipur', name: 'Tonk Road', zone: 'East', landmarks: ['University', 'Colleges'] },
  { city: 'Jaipur', name: 'Vaishali Nagar', zone: 'North', landmarks: ['Park', 'Market'] },
  { city: 'Jaipur', name: 'Tilak Nagar', zone: 'South', landmarks: ['Market', 'Schools'] },
  { city: 'Jaipur', name: 'JP Road', zone: 'West', landmarks: ['Hospital', 'Station'] },
  
  // Delhi areas
  { city: 'Delhi', name: 'North Campus', zone: 'North', landmarks: ['Delhi University', 'Metro'] },
  { city: 'Delhi', name: 'South Delhi', zone: 'South', landmarks: ['Market', 'Metro'] },
  { city: 'Delhi', name: 'East Delhi', zone: 'East', landmarks: ['Hospital', 'Market'] },
  { city: 'Delhi', name: 'West Delhi', zone: 'West', landmarks: ['Metro', 'Station'] },
  { city: 'Delhi', name: 'Central Delhi', zone: 'Central', landmarks: ['Market', 'Offices'] },
  
  // Bhopal areas
  { city: 'Bhopal', name: 'Hoshangabad Road', zone: 'Central', landmarks: ['Market', 'Hospital'] },
  { city: 'Bhopal', name: 'New Market', zone: 'Central', landmarks: ['Shopping', 'Restaurants'] },
  { city: 'Bhopal', name: 'Arera Colony', zone: 'South', landmarks: ['Park', 'School'] },
  
  // Nagpur areas
  { city: 'Nagpur', name: 'Sitabuldi', zone: 'Central', landmarks: ['Fort', 'Market'] },
  { city: 'Nagpur', name: 'South Nagpur', zone: 'South', landmarks: ['University', 'Market'] },
  
  // Mumbai areas
  { city: 'Mumbai', name: 'Fort', zone: 'Central', landmarks: ['Market', 'Station'] },
  { city: 'Mumbai', name: 'Bandra', zone: 'North', landmarks: ['Station', 'Market'] },
  
  // Bangalore areas
  { city: 'Bangalore', name: 'Indiranagar', zone: 'East', landmarks: ['Market', 'Tech Park'] },
  { city: 'Bangalore', name: 'Whitefield', zone: 'East', landmarks: ['Tech Park', 'Station'] }
];

async function seedCitiesAndAreas() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await City.deleteMany({});
    await Area.deleteMany({});
    console.log('🗑️  Cleared existing cities and areas');

    // Seed cities
    const cities = await City.insertMany(citiesData);
    console.log(`✅ Seeded ${cities.length} cities`);

    // Seed areas
    const areas = await Area.insertMany(areasData);
    console.log(`✅ Seeded ${areas.length} areas`);

    await mongoose.disconnect();
    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedCitiesAndAreas();
