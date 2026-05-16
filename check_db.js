const mongoose = require('mongoose');
require('dotenv').config();

const dbUri = "mongodb://localhost:27017/roomphy"; // Common default if not in env

async function checkProperty() {
  try {
    await mongoose.connect(dbUri);
    const ApprovedProperty = mongoose.model('ApprovedProperty', new mongoose.Schema({}, { strict: false }));
    const prop = await ApprovedProperty.findOne({ $or: [{ visitId: '6a07042f67a2a3c43a58ef45' }, { propertyId: '6a07042f67a2a3c43a58ef45' }, { _id: '6a07042f67a2a3c43a58ef45' }] });
    
    if (prop) {
      console.log('Property Found in ApprovedProperty:');
      console.log('ID:', prop._id);
      console.log('RoomTypes:', JSON.stringify(prop.roomTypes, null, 2));
      console.log('RoomVariants:', JSON.stringify(prop.roomVariants, null, 2));
    } else {
      console.log('Property not found in ApprovedProperty collection.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkProperty();
