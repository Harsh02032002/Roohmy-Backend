require('dotenv').config();
const connectDB = require('./config/database');
const Property = require('./models/Property');

async function fixProperties() {
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
    const totalProperties = await Property.countDocuments({});
    const liveProperties = await Property.countDocuments({ isLiveOnWebsite: true });
    const activePublishedProperties = await Property.countDocuments({ 
      status: 'active', 
      isPublished: true,
      isLiveOnWebsite: true 
    });

    console.log(`📊 Total Properties: ${totalProperties}`);
    console.log(`📊 Live on Website: ${liveProperties}`);
    console.log(`📊 Active, Published & Live: ${activePublishedProperties}`);

    // Show sample properties
    const sampleProperties = await Property.find({ isLiveOnWebsite: true }).limit(3);
    console.log('\n📋 Sample Live Properties:');
    sampleProperties.forEach(p => {
      console.log(`- ${p.title}: status=${p.status}, published=${p.isPublished}, live=${p.isLiveOnWebsite}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing properties:', error);
    process.exit(1);
  }
}

fixProperties();
