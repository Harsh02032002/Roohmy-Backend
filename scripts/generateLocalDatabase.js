#!/usr/bin/env node
/**
 * Local JSON Database Generator
 * Creates mockData folder with JSON files (no MongoDB needed!)
 */

const fs = require('fs');
const path = require('path');

console.log('\n📁 Creating Local JSON Database...\n');

const mockDataDir = path.join(__dirname, '../mockData');

// Create directory if not exists
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
  console.log(`✅ Created: ${mockDataDir}`);
}

// Property Types
const propertyTypes = [
  { _id: '1', title: 'PG', category: 'PG', description: 'Paying Guest' },
  { _id: '2', title: 'Hostel', category: 'Hostel', description: 'Student Hostel' },
  { _id: '3', title: 'Flat', category: 'Flat', description: 'Apartment' },
  { _id: '4', title: 'Villa', category: 'Villa', description: 'Villa' }
];

// Cities
const cities = [
  { _id: '1', name: 'Kota', state: 'Rajasthan', colleges: ['Allen', 'FIITJEE', 'Bansal', 'Resonance'] },
  { _id: '2', name: 'Indore', state: 'Madhya Pradesh', colleges: ['IIT-Indore', 'MITS', 'NRI'] },
  { _id: '3', name: 'Jaipur', state: 'Rajasthan', colleges: ['MNIT', 'RTU', 'BITS'] },
  { _id: '4', name: 'Delhi', state: 'Delhi', colleges: ['Delhi University', 'IIT-Delhi', 'NSIT'] }
];

// Areas
const areas = [
  { name: 'Dadabari', city: 'Kota', zone: 'North', landmarks: ['Railway Station', 'Main Road'] },
  { name: 'Nayapura', city: 'Kota', zone: 'Central', landmarks: ['Hospital', 'Market'] },
  { name: 'Rajwada', city: 'Indore', zone: 'Central', landmarks: ['Palace', 'Market'] },
  { name: 'Khajrana', city: 'Indore', zone: 'North', landmarks: ['Temple', 'Hospital'] },
  { name: 'C Scheme', city: 'Jaipur', zone: 'Central', landmarks: ['Market', 'Hospitals'] },
  { name: 'Tonk Road', city: 'Jaipur', zone: 'East', landmarks: ['University', 'Colleges'] },
  { name: 'North Campus', city: 'Delhi', zone: 'North', landmarks: ['Delhi University', 'Metro'] },
  { name: 'South Delhi', city: 'Delhi', zone: 'South', landmarks: ['Market', 'Metro'] }
];

// Properties
const properties = [
  {
    _id: 'KOTA-001',
    visitId: 'KOTA-001',
    property_name: 'Cozy PG North',
    propertyName: 'Cozy PG North',
    property_type: 'PG',
    propertyType: 'PG',
    city: 'Kota',
    area: 'Dadabari',
    rent: 8000,
    monthlyRent: 8000,
    owner_name: 'Rajesh Singh',
    ownerName: 'Rajesh Singh',
    owner_phone: '9876543210',
    contactPhone: '9876543210',
    gender: 'Co-ed',
    genderSuitability: 'Co-ed',
    beds: 15,
    status: 'approved',
    isVerified: true,
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'kota_pg_001', ownerName: 'Rajesh Singh' },
    image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    _id: 'KOTA-002',
    visitId: 'KOTA-002',
    property_name: 'Student Hostel Central',
    propertyName: 'Student Hostel Central',
    property_type: 'Hostel',
    propertyType: 'Hostel',
    city: 'Kota',
    area: 'Nayapura',
    rent: 6500,
    monthlyRent: 6500,
    owner_name: 'Priya Sharma',
    ownerName: 'Priya Sharma',
    owner_phone: '9765432109',
    contactPhone: '9765432109',
    gender: 'Male',
    genderSuitability: 'Male',
    beds: 30,
    status: 'approved',
    isVerified: true,
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'kota_hostel_001', ownerName: 'Priya Sharma' },
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    _id: 'INDORE-001',
    visitId: 'INDORE-001',
    property_name: 'Modern PG Indore',
    propertyName: 'Modern PG Indore',
    property_type: 'PG',
    propertyType: 'PG',
    city: 'Indore',
    area: 'Rajwada',
    rent: 7000,
    monthlyRent: 7000,
    owner_name: 'Anjali Patel',
    ownerName: 'Anjali Patel',
    owner_phone: '9654321098',
    contactPhone: '9654321098',
    gender: 'Female',
    genderSuitability: 'Female',
    beds: 20,
    status: 'approved',
    isVerified: true,
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'indore_pg_001', ownerName: 'Anjali Patel' },
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    _id: 'JAIPUR-001',
    visitId: 'JAIPUR-001',
    property_name: 'Pink City PG',
    propertyName: 'Pink City PG',
    property_type: 'PG',
    propertyType: 'PG',
    city: 'Jaipur',
    area: 'C Scheme',
    rent: 9000,
    monthlyRent: 9000,
    owner_name: 'Neha Singh',
    ownerName: 'Neha Singh',
    owner_phone: '9543210987',
    contactPhone: '9543210987',
    gender: 'Female',
    genderSuitability: 'Female',
    beds: 18,
    status: 'approved',
    isVerified: true,
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'jaipur_pg_001', ownerName: 'Neha Singh' },
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    _id: 'DELHI-001',
    visitId: 'DELHI-001',
    property_name: 'North Campus PG',
    propertyName: 'North Campus PG',
    property_type: 'PG',
    propertyType: 'PG',
    city: 'Delhi',
    area: 'North Campus',
    rent: 10000,
    monthlyRent: 10000,
    owner_name: 'Priya Gupta',
    ownerName: 'Priya Gupta',
    owner_phone: '9432109876',
    contactPhone: '9432109876',
    gender: 'Female',
    genderSuitability: 'Female',
    beds: 12,
    status: 'approved',
    isVerified: true,
    isLiveOnWebsite: true,
    generatedCredentials: { loginId: 'delhi_pg_001', ownerName: 'Priya Gupta' },
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

try {
  // Save files
  fs.writeFileSync(path.join(mockDataDir, 'propertyTypes.json'), JSON.stringify(propertyTypes, null, 2));
  console.log('✅ propertyTypes.json');

  fs.writeFileSync(path.join(mockDataDir, 'cities.json'), JSON.stringify(cities, null, 2));
  console.log('✅ cities.json');

  fs.writeFileSync(path.join(mockDataDir, 'areas.json'), JSON.stringify(areas, null, 2));
  console.log('✅ areas.json');

  fs.writeFileSync(path.join(mockDataDir, 'properties.json'), JSON.stringify(properties, null, 2));
  console.log('✅ properties.json');

  console.log(`\n✅ Local JSON Database created at: ${mockDataDir}\n`);
  console.log('📝 Files ready:');
  console.log('  - propertyTypes.json');
  console.log('  - cities.json');
  console.log('  - areas.json');
  console.log('  - properties.json\n');

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
