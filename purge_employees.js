require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

async function purge() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete employees with loginId ENP001, ENP002, ENP003, ENP004 or similar
    // The user wants to start fresh.
    const result = await Employee.deleteMany({ loginId: { $regex: /^ENP/ } });
    console.log(`Purged ${result.deletedCount} employees`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error purging employees:', err);
    process.exit(1);
  }
}

purge();
