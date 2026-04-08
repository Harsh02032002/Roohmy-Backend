#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Starting database seeding...');

const seedPath = path.join(__dirname, '../seeds/cityAreaSeed.js');
const seedProcess = spawn('node', [seedPath], {
  stdio: 'inherit',
  shell: true
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Database seeding completed successfully!');
  } else {
    console.error('❌ Database seeding failed!');
    process.exit(code);
  }
});

seedProcess.on('error', (error) => {
  console.error('❌ Error running seed script:', error);
  process.exit(1);
});
