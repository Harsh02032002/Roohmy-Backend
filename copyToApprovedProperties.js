require('dotenv').config();
const connectDB = require('./config/database');
const Property = require('./models/Property');
const ApprovedProperty = require('./models/ApprovedProperty');

async function copyToApprovedProperties() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    // Get all properties from Property collection that are not in ApprovedProperty
    const allProperties = await Property.find({ isLiveOnWebsite: true });
    console.log(`📊 Found ${allProperties.length} properties in Property collection`);

    // Get existing visitIds in ApprovedProperty to avoid duplicates
    const existingApprovedProperties = await ApprovedProperty.find({});
    const existingVisitIds = new Set(existingApprovedProperties.map(p => p.visitId));
    console.log(`📊 Found ${existingVisitIds.size} existing properties in ApprovedProperty collection`);

    let copiedCount = 0;
    let skippedCount = 0;

    for (const property of allProperties) {
      const visitId = property._id.toString();
      
      // Skip if already exists
      if (existingVisitIds.has(visitId)) {
        skippedCount++;
        continue;
      }

      // Transform Property to ApprovedProperty format
      const approvedPropertyData = {
        visitId: visitId,
        propertyInfo: {
          name: property.title || property.property_name,
          address: property.address,
          city: property.city,
          area: property.locality || property.address,
          photos: property.photos || property.images || [],
          ownerName: property.owner_name || 'Property Owner',
          ownerPhone: property.owner_phone || '9000000000',
          rent: property.monthlyRent || property.rent,
          description: property.description,
          genderSuitability: property.gender,
          propertyType: property.propertyType,
          amenities: property.amenities || [],
          latitude: property.latitude,
          longitude: property.longitude,
          location: property.longitude && property.latitude ? {
            type: "Point",
            coordinates: [property.longitude, property.latitude]
          } : null
        },
        propertyViews: property.propertyViews || [],
        amenities: property.amenities || [],
        exclusiveBenefits: property.exclusiveBenefits || [],
        isLiveOnWebsite: property.isLiveOnWebsite || true,
        status: property.isLiveOnWebsite ? 'live' : 'approved',
        approvedBy: 'superadmin',
        submittedAt: property.createdAt || new Date(),
        approvedAt: property.updatedAt || new Date(),
        generatedCredentials: property.generatedCredentials || {},
        professionalPhotos: property.professionalPhotos || []
      };

      // Create new ApprovedProperty
      const newApprovedProperty = new ApprovedProperty(approvedPropertyData);
      await newApprovedProperty.save();
      copiedCount++;

      if (copiedCount % 10 === 0) {
        console.log(`✅ Copied ${copiedCount} properties...`);
      }
    }

    console.log(`\n🎉 Successfully copied ${copiedCount} properties to ApprovedProperty collection`);
    console.log(`⏭️ Skipped ${skippedCount} existing properties`);

    // Verify the final count
    const finalApprovedCount = await ApprovedProperty.countDocuments({});
    const finalLiveCount = await ApprovedProperty.countDocuments({ isLiveOnWebsite: true });

    console.log(`\n📊 Final ApprovedProperty Collection: ${finalApprovedCount} total, ${finalLiveCount} live`);

    // Show sample properties
    const sampleProperties = await ApprovedProperty.find({}).limit(5);
    console.log('\n📋 Sample Properties in ApprovedProperty:');
    sampleProperties.forEach(p => {
      console.log(`- ${p.visitId}: ${p.propertyInfo?.name} (${p.propertyInfo?.city}) - status=${p.status}, live=${p.isLiveOnWebsite}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error copying properties:', error);
    process.exit(1);
  }
}

copyToApprovedProperties();
