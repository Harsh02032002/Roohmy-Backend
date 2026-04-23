require('dotenv').config();
const connectDB = require('./config/database');
const ApprovedProperty = require('./models/ApprovedProperty');

async function checkPropertyImages() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    const properties = await ApprovedProperty.find({}).limit(10);
    
    console.log('📊 Checking property images:');
    properties.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.visitId}: ${p.propertyInfo?.name}`);
      console.log(`   City: ${p.propertyInfo?.city}`);
      console.log(`   Photos: ${p.propertyInfo?.photos?.length || 0} images`);
      console.log(`   PropertyViews: ${p.propertyViews?.length || 0} views`);
      
      if (p.propertyInfo?.photos?.length > 0) {
        console.log(`   First photo: ${p.propertyInfo.photos[0]}`);
      }
      
      if (p.propertyViews?.length > 0) {
        p.propertyViews.forEach((view, vIndex) => {
          console.log(`   View ${vIndex + 1} (${view.label}): ${view.images?.length || 0} images`);
          if (view.images?.length > 0) {
            console.log(`     First image: ${view.images[0]}`);
          }
        });
      }
    });

    // Check for duplicate images
    const allImages = new Set();
    const duplicateImages = new Set();
    
    properties.forEach(p => {
      if (p.propertyInfo?.photos) {
        p.propertyInfo.photos.forEach(img => {
          if (allImages.has(img)) {
            duplicateImages.add(img);
          } else {
            allImages.add(img);
          }
        });
      }
    });
    
    console.log(`\n🔍 Image Analysis:`);
    console.log(`   Total unique images: ${allImages.size}`);
    console.log(`   Duplicate images: ${duplicateImages.size}`);
    
    if (duplicateImages.size > 0) {
      console.log(`   Duplicate image URLs:`);
      Array.from(duplicateImages).forEach(img => {
        console.log(`     - ${img}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPropertyImages();
