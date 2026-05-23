const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();
require('dns').setServers(['8.8.8.8']);

const User = require('../models/user');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const Room = require('../models/Room');
const Rent = require('../models/Rent');
const generateTenantId = require('../utils/generateTenantId');

async function seed() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomhy';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    // 1. Find Owner User
    const ownerUser = await User.findOne({
      $or: [
        { loginId: 'ROOMHY9999' },
        { email: 'ROOMHY9999' }
      ]
    });
    console.log('Owner User:', ownerUser ? `${ownerUser.name} (${ownerUser._id})` : 'Not found');

    // 2. Find Properties
    const properties = await Property.find({
      $or: [
        { ownerLoginId: 'ROOMHY9999' },
        { owner_id: 'ROOMHY9999' }
      ]
    });

    if (properties.length === 0) {
      console.log('No properties found for ROOMHY9999. Exiting.');
      process.exit(0);
    }

    console.log(`Found ${properties.length} properties. Seeding tenants...`);

    const tenantData = [
      { name: "Aarav Sharma", phone: "9876543210", email: "aarav.sharma@example.com" },
      { name: "Kavya Patel", phone: "9876543211", email: "kavya.patel@example.com" },
      { name: "Rohan Gupta", phone: "9876543212", email: "rohan.gupta@example.com" }
    ];

    const results = [];

    for (let i = 0; i < Math.min(properties.length, tenantData.length); i++) {
      const property = properties[i];
      const data = tenantData[i];

      // Find first room
      const room = await Room.findOne({ property: property._id });
      if (!room) {
        console.log(`Warning: No rooms found for property ${property.title}. Skipping.`);
        continue;
      }

      // Generate credentials
      const loginId = await generateTenantId();
      const tempPassword = crypto.randomBytes(4).toString('hex').toUpperCase();

      // Create User record
      const user = await User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: tempPassword, // Encrypted by pre-save hook
        role: 'tenant',
        loginId,
        locationCode: property.locationCode || 'IND',
        status: 'active'
      });

      // Create Tenant record
      const tenant = await Tenant.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        property: property._id,
        room: room._id,
        roomNo: room.title || room.number || 'Room 101',
        bedNo: '1',
        moveInDate: new Date(),
        agreedRent: room.price || 7500,
        loginId,
        tempPassword,
        user: user._id,
        securityDepositTotal: room.price || 7500,
        securityDepositPaid: 0,
        securityDepositBalance: room.price || 7500,
        ownerLoginId: 'ROOMHY9999',
        propertyTitle: property.title,
        assignedBy: ownerUser ? ownerUser._id : undefined,
        status: 'active',
        kycStatus: 'verified' // Pre-verified so they can log in right away
      });

      // Create Rent record
      const rent = await Rent.create({
        propertyId: property._id,
        propertyName: property.title,
        ownerLoginId: 'ROOMHY9999',
        ownerName: ownerUser ? ownerUser.name : 'ROOMHY9999',
        tenantId: tenant._id,
        tenantLoginId: loginId,
        tenantName: data.name,
        tenantEmail: data.email,
        tenantPhone: data.phone,
        roomNumber: room.title || room.number || 'Room 101',
        rentAmount: room.price || 7500,
        totalDue: room.price || 7500,
        paidAmount: 0,
        paymentStatus: 'pending',
        collectionMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
        moveInDate: new Date(),
        dueDate: new Date(),
        createdAt: new Date()
      });

      results.push({
        propertyName: property.title,
        roomNo: tenant.roomNo,
        tenantName: tenant.name,
        loginId: tenant.loginId,
        password: tempPassword,
        phone: tenant.phone,
        email: tenant.email
      });
    }

    console.log('\n=== SEEDING SUCCESSFUL ===');
    console.log(JSON.stringify(results, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error seeding tenants:', err);
    process.exit(1);
  }
}

seed();
