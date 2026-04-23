require('dotenv').config();
const connectDB = require('./config/database');
const ApprovedProperty = require('./models/ApprovedProperty');

// Most Popular For amenities
const mostPopularFor = [
    { name: 'Near Coaching Centers', icon: 'graduation-cap', category: 'popular' },
    { name: 'Walking Distance to Metro', icon: 'map-pin', category: 'popular' },
    { name: 'IT Professionals Hub', icon: 'briefcase', category: 'popular' },
    { name: 'Student Friendly', icon: 'users', category: 'popular' },
    { name: 'Girls Safe Area', icon: 'shield', category: 'popular' },
    { name: '24/7 Food Court', icon: 'coffee', category: 'popular' },
    { name: 'Premium Location', icon: 'star', category: 'popular' },
    { name: 'Budget Friendly', icon: 'dollar-sign', category: 'popular' }
];

// Basic Amenities
const basicAmenities = [
    { name: 'High-Speed WiFi', icon: 'wifi', category: 'basic' },
    { name: 'Power Backup', icon: 'zap', category: 'basic' },
    { name: 'Security', icon: 'shield', category: 'basic' },
    { name: 'Water Supply', icon: 'droplet', category: 'basic' },
    { name: 'Parking', icon: 'car', category: 'basic' },
    { name: 'Housekeeping', icon: 'home', category: 'basic' },
    { name: 'Laundry Service', icon: 'shirt', category: 'basic' },
    { name: 'Gym', icon: 'dumbbell', category: 'basic' },
    { name: 'CCTV Surveillance', icon: 'camera', category: 'basic' },
    { name: 'Fire Safety', icon: 'alert-triangle', category: 'basic' },
    { name: 'Air Conditioning', icon: 'wind', category: 'basic' },
    { name: 'TV Common Room', icon: 'tv', category: 'basic' },
    { name: 'Refrigerator', icon: 'fridge', category: 'basic' },
    { name: 'Washing Machine', icon: 'shirt', category: 'basic' },
    { name: 'Microwave', icon: 'microwave', category: 'basic' }
];

async function updateApprovedProperties() {
    try {
        await connectDB();
        console.log('🔄 Connected to MongoDB Atlas');

        const properties = await ApprovedProperty.find({});
        console.log(`📊 Found ${properties.length} properties to update`);

        let updatedCount = 0;

        for (const property of properties) {
            // Generate random amenities for this property
            const selectedAmenities = [];
            
            // Select 2-3 Most Popular For items
            const popularCount = Math.floor(Math.random() * 2) + 2;
            const shuffledPopular = [...mostPopularFor].sort(() => 0.5 - Math.random());
            for (let j = 0; j < popularCount; j++) {
                selectedAmenities.push(shuffledPopular[j]);
            }
            
            // Select 4-6 Basic Amenities
            const basicCount = Math.floor(Math.random() * 3) + 4;
            const shuffledBasic = [...basicAmenities].sort(() => 0.5 - Math.random());
            for (let j = 0; j < basicCount; j++) {
                selectedAmenities.push(shuffledBasic[j]);
            }

            // Update the property
            await ApprovedProperty.updateOne(
                { _id: property._id },
                { 
                    $set: { 
                        amenities: selectedAmenities,
                        updatedAt: new Date()
                    }
                }
            );

            updatedCount++;
            
            if (updatedCount % 10 === 0) {
                console.log(`✅ Updated ${updatedCount} properties...`);
            }
        }

        console.log(`\n🎉 Successfully updated ${updatedCount} properties with new amenities!`);

        // Show sample updated property
        const sampleProperty = await ApprovedProperty.findOne({});
        console.log('\n📋 Sample Updated Property:');
        console.log(`Property: ${sampleProperty.propertyInfo?.name}`);
        console.log('Amenities:', sampleProperty.amenities.slice(0, 3));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating properties:', error);
        process.exit(1);
    }
}

updateApprovedProperties();
