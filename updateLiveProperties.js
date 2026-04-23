require('dotenv').config();
const connectDB = require('./config/database');
const Property = require('./models/Property');

async function updateProperties() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    // Update all properties to set isLiveOnWebsite to true
    const result = await Property.updateMany(
      { isLiveOnWebsite: { $ne: true } },
      { isLiveOnWebsite: true }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} properties to set isLiveOnWebsite = true`);

    // Verify the update
    const liveCount = await Property.countDocuments({ isLiveOnWebsite: true });
    const activePublishedLiveCount = await Property.countDocuments({ 
      status: 'active', 
      isPublished: true,
      isLiveOnWebsite: true 
    });
    
    console.log(`📊 Total Live Properties: ${liveCount}`);
    console.log(`📊 Active, Published & Live: ${activePublishedLiveCount}`);

    // Show sample properties
    const sampleProperties = await Property.find({ isLiveOnWebsite: true }).limit(3);
    console.log('\n📋 Sample Live Properties:');
    sampleProperties.forEach(p => {
      console.log(`- ${p.title}: status=${p.status}, published=${p.isPublished}, live=${p.isLiveOnWebsite}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating properties:', error);
    process.exit(1);
  }
}

updateProperties();
