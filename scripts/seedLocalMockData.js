#!/usr/bin/env node
/**
 * Local Mock Database Seeder
 * Uses local JSON files instead of MongoDB (for testing without Atlas connection)
 */

const fs = require('fs');
const path = require('path');

const mockDataDir = path.join(__dirname, '../mockData');
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
}

// Mock Data
const propertyTypes = [
  { _id: '1', title: 'PG', category: 'PG', description: 'Paying Guest' },
  { _id: '2', title: 'Hostel', category: 'Hostel', description: 'Student Hostel' },
  { _id: '3', title: 'Flat', category: 'Flat', description: 'Apartment' },
  { _id: '4', title: 'Villa', category: 'Villa', description: 'Villa' },
  { _id: '5', title: 'Shared Room', category: 'Shared', description: 'Shared Room' },
  { _id: '6', title: 'Private Room', category: 'Private', description: 'Private Room' }
];

const cities = [
  { _id: '1', name: 'Kota', state: 'Rajasthan', colleges: ['Allen', 'FIITJEE', 'Bansal', 'Resonance'] },
  { _id: '2', name: 'Indore', state: 'Madhya Pradesh', colleges: ['IIT-Indore', 'MITS', 'NRI'] },
  { _id: '3', name: 'Jaipur', state: 'Rajasthan', colleges: ['MNIT', 'RTU', 'BITS'] },
  { _id: '4', name: 'Delhi', state: 'Delhi', colleges: ['Delhi University', 'IIT-Delhi', 'NSIT'] },
  { _id: '5', name: 'Bhopal', state: 'Madhya Pradesh', colleges: ['IISER', 'MATS', 'Barkatullah'] },
  { _id: '6', name: 'Nagpur', state: 'Maharashtra', colleges: ['VNIT', 'RCOEM', 'Nagpur Uni'] },
  { _id: '7', name: 'Mumbai', state: 'Maharashtra', colleges: ['IIT-Mumbai', 'AISSMS', 'NMIMS'] },
  { _id: '8', name: 'Bangalore', state: 'Karnataka', colleges: ['IIT-Bangalore', 'VTU', 'RV Uni'] }
];

const areas = [
  { _id: '1', name: 'Dadabari', city: 'Kota', zone: 'North', landmarks: ['Railway Station'] },
  { _id: '2', name: 'Nayapura', city: 'Kota', zone: 'Central', landmarks: ['Hospital'] },
  { _id: '3', name: 'Rajwada', city: 'Indore', zone: 'Central', landmarks: ['Palace'] },
  { _id: '4', name: 'C Scheme', city: 'Jaipur', zone: 'Central', landmarks: ['Market'] },
  { _id: '5', name: 'North Campus', city: 'Delhi', zone: 'North', landmarks: ['University'] },
  { _id: '6', name: 'Sitabuldi', city: 'Nagpur', zone: 'Central', landmarks: ['Fort'] },
  { _id: '7', name: 'Whitefield', city: 'Bangalore', zone: 'East', landmarks: ['Tech Park'] }
];

const properties = [
  {
    _id: 'KOTA-001',
    visitId: 'KOTA-001',
    propertyInfo: {
      name: 'Cozy PG North',
      propertyType: 'PG',
      area: 'Dadabari',
      city: 'Kota',
      rent: 8000,
      genderSuitability: 'Co-ed',
      totalSeats: 15
    },
    status: 'approved',
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'kota_pg_001', ownerName: 'Rajesh Singh' }
  },
  {
    _id: 'INDORE-001',
    visitId: 'INDORE-001',
    propertyInfo: {
      name: 'Modern PG Indore',
      propertyType: 'PG',
      area: 'Rajwada',
      city: 'Indore',
      rent: 7000,
      genderSuitability: 'Female',
      totalSeats: 20
    },
    status: 'approved',
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'indore_pg_001', ownerName: 'Anjali Patel' }
  },
  {
    _id: 'JAIPUR-001',
    visitId: 'JAIPUR-001',
    propertyInfo: {
      name: 'Pink City PG',
      propertyType: 'PG',
      area: 'C Scheme',
      city: 'Jaipur',
      rent: 9000,
      genderSuitability: 'Female',
      totalSeats: 18
    },
    status: 'approved',
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'jaipur_pg_001', ownerName: 'Neha Singh' }
  }
];

async function seedLocalData() {
  try {
    console.log('🌱 Seeding Local Mock Database\n');

    // Save data to JSON files
    fs.writeFileSync(path.join(mockDataDir, 'propertyTypes.json'), JSON.stringify(propertyTypes, null, 2));
    console.log(`✅ Saved ${propertyTypes.length} property types`);

    fs.writeFileSync(path.join(mockDataDir, 'cities.json'), JSON.stringify(cities, null, 2));
    console.log(`✅ Saved ${cities.length} cities`);

    fs.writeFileSync(path.join(mockDataDir, 'areas.json'), JSON.stringify(areas, null, 2));
    console.log(`✅ Saved ${areas.length} areas`);

    fs.writeFileSync(path.join(mockDataDir, 'properties.json'), JSON.stringify(properties, null, 2));
    console.log(`✅ Saved ${properties.length} properties`);

    console.log(`\n✅ Mock data saved to: ${mockDataDir}`);
    console.log('\n💡 To use this local data:');
    console.log('  1. Update Frontend/src/utils/api.js to use local JSON files');
    console.log('  2. Change fetchJson() to read from mockData folder');
    console.log('  3. App will work without MongoDB connection\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedLocalData();
