const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config({ path: '../.env' });

// Ensure DNS resolution for SRV works correctly
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Property = require('../models/Property');
const Tenant = require('../models/Tenant');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomhy')
  .then(async () => {
    console.log('--- MongoDB Connected ---');
    
    // Find all properties owned by ROOMHY9999
    const properties = await Property.find({ ownerLoginId: 'ROOMHY9999' });
    console.log(`\nProperties owned by ROOMHY9999 (${properties.length}):`);
    properties.forEach(p => {
      console.log(`- Title: ${p.title}\n  ID: ${p._id}\n  Location: ${p.locationCode}\n  Owner: ${p.ownerLoginId}`);
    });
    
    const propIds = properties.map(p => p._id);
    
    // Find all tenants assigned to these properties
    const tenants = await Tenant.find({ property: { $in: propIds } }).populate('property');
    console.log(`\nTenants assigned to ROOMHY9999 properties (${tenants.length}):`);
    tenants.forEach(t => {
      console.log(`- Name: ${t.name}\n  Phone: ${t.phone}\n  Email: ${t.email}\n  Login ID: ${t.loginId}\n  Temp Password: ${t.tempPassword}\n  Property: ${t.property?.title}\n  Room No: ${t.roomNo}\n  Bed: ${t.bedNo}\n  Status: ${t.status}\n  KYC Status: ${t.kycStatus}\n  Moveout Request Status: ${t.moveoutRequest?.status}\n  Police Status: ${t.policeVerification?.status}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting or querying MongoDB:', err);
    process.exit(1);
  });
