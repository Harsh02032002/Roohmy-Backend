require('dotenv').config();
const connectDB = require('./config/database');
const ApprovedProperty = require('./models/ApprovedProperty');

async function checkDynamicImages() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    // Check first 10 properties in detail
    const properties = await ApprovedProperty.find({}).limit(10);
    
    console.log('📊 Checking Dynamic Property Images:');
    properties.forEach((p, index) => {
      console.log(`\n${index + 1}. Property: ${p.visitId}`);
      console.log(`   Name: ${p.propertyInfo?.name}`);
      console.log(`   City: ${p.propertyInfo?.city}`);
      
      // Check propertyInfo.photos
      const photos = p.propertyInfo?.photos || [];
      console.log(`   propertyInfo.photos: ${photos.length} images`);
      photos.forEach((photo, i) => {
        console.log(`     ${i + 1}. ${photo}`);
      });
      
      // Check propertyViews
      const views = p.propertyViews || [];
      console.log(`   propertyViews: ${views.length} views`);
      views.forEach((view, i) => {
        console.log(`     View ${i + 1} (${view.label}): ${view.images?.length || 0} images`);
        view.images?.forEach((img, j) => {
          console.log(`       ${j + 1}. ${img}`);
        });
      });
      
      // Check photos array
      const mainPhotos = p.photos || [];
      console.log(`   photos array: ${mainPhotos.length} images`);
      mainPhotos.forEach((photo, i) => {
        console.log(`     ${i + 1}. ${photo}`);
      });
    });

    // Check for image patterns
    console.log('\n🔍 Analyzing Image Patterns:');
    const allImages = new Set();
    const imageUsage = {};
    
    properties.forEach(p => {
      // Collect all images from this property
      const propertyImages = [
        ...(p.propertyInfo?.photos || []),
        ...(p.photos || []),
        ...p.propertyViews?.flatMap(v => v.images || []) || []
      ];
      
      propertyImages.forEach(img => {
        allImages.add(img);
        imageUsage[img] = (imageUsage[img] || 0) + 1;
      });
    });
    
    console.log(`Total unique images: ${allImages.size}`);
    console.log('Image usage count:');
    Object.entries(imageUsage).forEach(([img, count]) => {
      if (count > 1) {
        console.log(`   "${img}" used ${count} times`);
      }
    });

    // Check API response format
    console.log('\n📡 Checking API Response Format:');
    const sampleProperty = properties[0];
    const apiFormat = {
      _id: sampleProperty.visitId,
      property_name: sampleProperty.propertyInfo?.name,
      photos: sampleProperty.propertyInfo?.photos || [],
      propertyViews: sampleProperty.propertyViews || [],
      images: sampleProperty.photos || []
    };
    
    console.log('Sample API format:');
    console.log(`  _id: ${apiFormat._id}`);
    console.log(`  property_name: ${apiFormat.property_name}`);
    console.log(`  photos count: ${apiFormat.photos.length}`);
    console.log(`  propertyViews count: ${apiFormat.propertyViews.length}`);
    console.log(`  images count: ${apiFormat.images.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDynamicImages();
