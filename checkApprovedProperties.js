require('dotenv').config();
const connectDB = require('./config/database');
const Property = require('./models/Property');
const ApprovedProperty = require('./models/ApprovedProperty');

async function checkBothCollections() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    // Check Property collection
    const propertyCount = await Property.countDocuments({});
    const liveProperties = await Property.countDocuments({ isLiveOnWebsite: true });
    console.log(`📊 Property Collection: ${propertyCount} total, ${liveProperties} live`);

    // Check ApprovedProperty collection
    const approvedPropertyCount = await ApprovedProperty.countDocuments({});
    const approvedLiveProperties = await ApprovedProperty.countDocuments({ isLiveOnWebsite: true });
    console.log(`📊 ApprovedProperty Collection: ${approvedPropertyCount} total, ${approvedLiveProperties} live`);

    // Show sample from ApprovedProperty
    const approvedProperties = await ApprovedProperty.find({}).limit(3);
    console.log('\n📋 Sample ApprovedProperties:');
    approvedProperties.forEach(p => {
      console.log(`- ${p.visitId}: status=${p.status}, live=${p.isLiveOnWebsite}`);
    });

    // The issue: API uses ApprovedProperty but we added to Property collection
    console.log('\n🔍 ISSUE IDENTIFIED:');
    console.log('API endpoint uses ApprovedProperty collection');
    console.log('But we added properties to Property collection');
    console.log('Need to copy properties from Property to ApprovedProperty collection');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBothCollections();
