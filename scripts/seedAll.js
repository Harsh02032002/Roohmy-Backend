#!/usr/bin/env node
/**
 * Master Seeding Script
 * Seeds all database collections: Property Types, Cities, Areas, and Properties
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const path = require('path');

const scripts = [
  'seedPropertyTypes.js',
  'seedCitiesAreas.js',
  'seedProperties.js'
];

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📍 Running: ${scriptName}`);
    console.log(`${'='.repeat(60)}`);

    const script = spawn('node', [path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      shell: true
    });

    script.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} completed successfully\n`);
        resolve();
      } else {
        console.error(`❌ ${scriptName} failed with code ${code}\n`);
        reject(new Error(`Script ${scriptName} failed`));
      }
    });

    script.on('error', (err) => {
      console.error(`❌ Error running ${scriptName}:`, err.message);
      reject(err);
    });
  });
}

async function seedAll() {
  try {
    console.log('\n🌱 Starting Database Seeding...\n');
    console.log('This will seed:');
    console.log('  1. Property Types (PG, Hostel, Flat, Villa, etc.)');
    console.log('  2. Cities and Areas across India');
    console.log('  3. Sample Properties for each city\n');

    for (const script of scripts) {
      await runScript(script);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\nYour database now has:');
    console.log('  ✓ 6 Property Types');
    console.log('  ✓ 8 Cities with multiple Areas');
    console.log('  ✓ 15+ Sample Properties across all cities\n');
    console.log('You can now:');
    console.log('  1. Start your development server');
    console.log('  2. Access http://localhost:3000/website/ourproperty');
    console.log('  3. Search for properties by city, area, and type\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.log('\nPlease check:');
    console.log('  1. MongoDB URI in .env is correct');
    console.log('  2. Your internet connection is working');
    console.log('  3. MongoDB cluster network access is enabled\n');
    process.exit(1);
  }
}

seedAll();
