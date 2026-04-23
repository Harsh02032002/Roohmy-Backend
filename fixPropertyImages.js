require('dotenv').config();
const connectDB = require('./config/database');
const ApprovedProperty = require('./models/ApprovedProperty');

// Generate unique images for each property
function generateUniqueImages(index, propertyType, city) {
  const baseImages = {
    pg: [
      `https://picsum.photos/800/600?random=${1000 + index}`,
      `https://picsum.photos/800/600?random=${2000 + index}`,
      `https://picsum.photos/800/600?random=${3000 + index}`,
      `https://picsum.photos/800/600?random=${4000 + index}`
    ],
    hostel: [
      `https://picsum.photos/800/600?random=${5000 + index}`,
      `https://picsum.photos/800/600?random=${6000 + index}`,
      `https://picsum.photos/800/600?random=${7000 + index}`,
      `https://picsum.photos/800/600?random=${8000 + index}`
    ],
    'co-living': [
      `https://picsum.photos/800/600?random=${9000 + index}`,
      `https://picsum.photos/800/600?random=${10000 + index}`,
      `https://picsum.photos/800/600?random=${11000 + index}`,
      `https://picsum.photos/800/600?random=${12000 + index}`
    ],
    apartment: [
      `https://picsum.photos/800/600?random=${13000 + index}`,
      `https://picsum.photos/800/600?random=${14000 + index}`,
      `https://picsum.photos/800/600?random=${15000 + index}`,
      `https://picsum.photos/800/600?random=${16000 + index}`
    ]
  };
  
  return baseImages[propertyType] || baseImages.pg;
}

function generatePropertyViews(images, index) {
  return [
    {
      label: "Facade",
      images: [images[0]],
      description: `Beautiful building exterior - Property ${index}`
    },
    {
      label: "Room",
      images: [images[1]],
      description: `Spacious and comfortable room - Property ${index}`
    },
    {
      label: "Kitchen",
      images: [images[2]],
      description: `Modern kitchen facilities - Property ${index}`
    },
    {
      label: "Lobby",
      images: [images[3]],
      description: `Welcoming lobby area - Property ${index}`
    }
  ];
}

async function fixPropertyImages() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    const properties = await ApprovedProperty.find({});
    console.log(`📊 Found ${properties.length} properties to fix`);

    let updatedCount = 0;

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const propertyType = property.propertyInfo?.propertyType || 'pg';
      
      // Generate unique images for this property
      const uniqueImages = generateUniqueImages(i, propertyType, property.propertyInfo?.city);
      const uniquePropertyViews = generatePropertyViews(uniqueImages, i);

      // Update the property with unique images
      await ApprovedProperty.findByIdAndUpdate(property._id, {
        'propertyInfo.photos': uniqueImages,
        'propertyViews': uniquePropertyViews,
        'photos': uniqueImages,
        updatedAt: new Date()
      });

      updatedCount++;

      if (updatedCount % 10 === 0) {
        console.log(`✅ Updated ${updatedCount} properties...`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} properties with unique images`);

    // Verify the updates
    const updatedProperties = await ApprovedProperty.find({}).limit(5);
    console.log('\n📋 Sample Updated Properties:');
    updatedProperties.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.visitId}: ${p.propertyInfo?.name}`);
      console.log(`   Photos: ${p.propertyInfo?.photos?.length || 0} images`);
      console.log(`   First photo: ${p.propertyInfo?.photos?.[0] || 'None'}`);
      console.log(`   PropertyViews: ${p.propertyViews?.length || 0} views`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing property images:', error);
    process.exit(1);
  }
}

fixPropertyImages();
