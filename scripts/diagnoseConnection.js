#!/usr/bin/env node
/**
 * MongoDB Connection Diagnostic & Fixer
 */

require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;

async function diagnose() {
  console.log('\n🔍 MongoDB Connection Diagnostic\n');
  
  const mongoUri = process.env.MONGO_URI;
  console.log('📋 Connection String (hidden password):');
  console.log(mongoUri.replace(/:[^:]+@/, ':****@'));
  
  if (!mongoUri) {
    console.error('❌ MONGO_URI not found in .env');
    process.exit(1);
  }

  // Extract hostname
  const match = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)/);
  if (!match) {
    console.error('❌ Invalid MongoDB URI format');
    process.exit(1);
  }

  const [, user, password, host] = match;
  console.log(`\n📍 Host: ${host}`);
  console.log(`👤 User: ${user}\n`);

  // Test DNS resolution
  try {
    console.log('🌐 Testing DNS resolution...');
    const addresses = await dns.resolve4(host);
    console.log(`✅ DNS resolved to: ${addresses.join(', ')}`);
  } catch (error) {
    console.error(`❌ DNS resolution failed: ${error.message}`);
    console.log('\n💡 Solutions:');
    console.log('  1. Check your internet connection');
    console.log('  2. Check if VPN is connected (may block MongoDB)');
    console.log('  3. Check firewall settings');
    console.log('  4. Restart your router/network\n');
    process.exit(1);
  }

  // Test MongoDB connection
  try {
    console.log('\n🔗 Attempting MongoDB connection...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5
    });
    console.log('✅ Connected to MongoDB successfully!');
    await mongoose.disconnect();
    console.log('✅ Disconnected\n');
    
    console.log('🎉 All checks passed! Database is ready for seeding.\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Connection failed: ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Solutions:');
      console.log('  1. Ensure MongoDB Atlas cluster is running');
      console.log('  2. Add your IP to MongoDB Atlas IP Whitelist:');
      console.log('     - Go to: https://cloud.mongodb.com');
      console.log('     - Project → Network Access');
      console.log('     - Add IP Address: 0.0.0.0/0 (for development)');
      console.log('  3. Check credentials in .env file');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Solutions:');
      console.log('  1. Verify username and password in .env');
      console.log('  2. Check special characters are URL encoded');
      console.log('  3. @ symbol in password? Use %40 instead');
    }
    
    console.log('\n');
    process.exit(1);
  }
}

diagnose();
