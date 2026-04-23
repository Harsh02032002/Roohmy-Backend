require('dotenv').config();
const connectDB = require('./config/database');
const Property = require('./models/Property');

async function checkAgain() {
  try {
    await connectDB();
    
    // Check all properties and their isLiveOnWebsite status
    const properties = await Property.find({});
    console.log('Total Properties:', properties.length);
    
    let undefinedCount = 0;
    let trueCount = 0;
    let falseCount = 0;
    
    properties.forEach(p => {
      if (p.isLiveOnWebsite === true) trueCount++;
      else if (p.isLiveOnWebsite === false) falseCount++;
      else undefinedCount++;
    });
    
    console.log(`isLiveOnWebsite = true: ${trueCount}`);
    console.log(`isLiveOnWebsite = false: ${falseCount}`);
    console.log(`isLiveOnWebsite = undefined: ${undefinedCount}`);
    
    // Try to update one property manually
    const testUpdate = await Property.updateOne(
      { title: /Modern PG/ },
      { $set: { isLiveOnWebsite: true } }
    );
    
    console.log(`Test update result: ${testUpdate.modifiedCount} properties modified`);
    
    // Check if the update worked
    const updatedProperty = await Property.findOne({ title: /Modern PG/ });
    if (updatedProperty) {
      console.log(`Updated property isLiveOnWebsite: ${updatedProperty.isLiveOnWebsite}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAgain();
