require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/database');
const mongoose = require('mongoose');

const Property = require('../models/Property');
const WebsitePropertyData = require('../models/WebsitePropertyData');
const City = require('../models/City');
const Area = require('../models/Area');

// Sample property data templates
const propertyTypes = ['PG', 'Flat', 'Hostel', 'Room'];
const genders = ['Male', 'Female', 'Both'];
const furnishingTypes = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'];

// Sample property names
const propertyNames = [
  'Cozy Stay', 'Dream Home', 'Peaceful Living', 'Modern Apartment', 'Luxury Residence',
  'Comfort Zone', 'Green Valley', 'Sunshine Apartments', 'Royal Residency', 'Elite Homes',
  'Paradise Place', 'Golden Gate', 'Silver Springs', 'Blue Moon', 'Red Rose',
  'White House', 'Black Pearl', 'Pink Palace', 'Purple Hills', 'Orange Grove'
];

// Sample descriptions
const descriptions = [
  'Well-maintained property with all modern amenities',
  'Spacious and airy rooms with natural lighting',
  'Prime location with easy access to transportation',
  'Clean and hygienic environment with regular maintenance',
  'Secure property with 24/7 surveillance',
  'Peaceful neighborhood perfect for students',
  'Modern facilities with high-speed internet',
  'Comfortable living space with friendly atmosphere',
  'Affordable accommodation with quality services',
  'Premium property with luxury amenities'
];

// Sample amenities
const amenities = [
  'WiFi', 'Parking', 'Security', 'Power Backup', 'Water Supply',
  'Housekeeping', 'Laundry', 'Gym', 'CCTV', 'Fire Safety'
];

// Generate random properties for areas
function generatePropertiesForArea(area, city, count = 10) {
  const properties = [];
  
  for (let i = 0; i < count; i++) {
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const furnishing = furnishingTypes[Math.floor(Math.random() * furnishingTypes.length)];
    const propertyName = `${propertyNames[Math.floor(Math.random() * propertyNames.length)]} ${area.name}`;
    
    // Generate random price based on property type
    let basePrice;
    switch (propertyType) {
      case 'PG':
        basePrice = Math.floor(Math.random() * 10000) + 5000; // 5000-15000
        break;
      case 'Flat':
        basePrice = Math.floor(Math.random() * 20000) + 10000; // 10000-30000
        break;
      case 'Hostel':
        basePrice = Math.floor(Math.random() * 8000) + 4000; // 4000-12000
        break;
      case 'Room':
        basePrice = Math.floor(Math.random() * 12000) + 6000; // 6000-18000
        break;
    }
    
    // Generate random amenities (3-7 amenities)
    const selectedAmenities = [];
    const amenitiesCount = Math.floor(Math.random() * 5) + 3;
    const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
    for (let j = 0; j < amenitiesCount; j++) {
      selectedAmenities.push(shuffledAmenities[j]);
    }
    
    properties.push({
      title: propertyName,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      address: `${area.name}, ${city.name}, ${city.state}`,
      locationCode: `${city.name.substring(0, 3).toUpperCase()}-${area.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 999)}`,
      latitude: area.cityName === 'Kota' ? 25.2138 + (Math.random() - 0.5) * 0.1 :
                area.cityName === 'Indore' ? 22.7196 + (Math.random() - 0.5) * 0.1 :
                area.cityName === 'Jaipur' ? 26.9124 + (Math.random() - 0.5) * 0.1 :
                area.cityName === 'Delhi' ? 28.6139 + (Math.random() - 0.5) * 0.1 :
                area.cityName === 'Bhopal' ? 23.2599 + (Math.random() - 0.5) * 0.1 :
                area.cityName === 'Nagpur' ? 21.1458 + (Math.random() - 0.5) * 0.1 :
                area.cityName === 'Jodhpur' ? 26.2389 + (Math.random() - 0.5) * 0.1 :
                19.0760 + (Math.random() - 0.5) * 0.1,
      longitude: area.cityName === 'Kota' ? 75.8648 + (Math.random() - 0.5) * 0.1 :
                 area.cityName === 'Indore' ? 75.8577 + (Math.random() - 0.5) * 0.1 :
                 area.cityName === 'Jaipur' ? 75.7873 + (Math.random() - 0.5) * 0.1 :
                 area.cityName === 'Delhi' ? 77.2090 + (Math.random() - 0.5) * 0.1 :
                 area.cityName === 'Bhopal' ? 77.4126 + (Math.random() - 0.5) * 0.1 :
                 area.cityName === 'Nagpur' ? 79.0882 + (Math.random() - 0.5) * 0.1 :
                 area.cityName === 'Jodhpur' ? 73.0243 + (Math.random() - 0.5) * 0.1 :
                 72.8777 + (Math.random() - 0.5) * 0.1,
      owner: null,
      ownerLoginId: `owner${Math.floor(Math.random() * 10000)}`,
      status: 'active',
      isPublished: true,
      createdAt: new Date()
    });
  }
  
  return properties;
}

async function seedProperties() {
    try {
        await connectDB();

        console.log('🌱 Starting properties seeding...');

        // Get all cities and areas
        const cities = await City.find({});
        const areas = await Area.find({}).populate('city');
        
        console.log(`Found ${cities.length} cities and ${areas.length} areas`);

        // Clear existing properties
        await Property.deleteMany({});
        console.log('Cleared existing properties');

        // Generate properties for each area
        let allProperties = [];
        
        console.log('Debugging area-city mapping...');
        console.log('First area object:', JSON.stringify(areas[0], null, 2));
        
        for (const area of areas) {
            // Handle both populated city object and city ID reference
            let cityId;
            if (area.city && typeof area.city === 'object' && area.city._id) {
                cityId = area.city._id.toString();
            } else if (area.city) {
                cityId = area.city.toString();
            } else {
                console.log(`Area ${area.name} has no city reference`);
                continue;
            }
            
            const city = cities.find(c => c._id.toString() === cityId);
            if (city) {
                const areaProperties = generatePropertiesForArea(area, city, 10);
                allProperties = allProperties.concat(areaProperties);
                console.log(`✅ Generated 10 properties for ${area.name}, ${city.name}`);
            } else {
                console.log(`❌ City not found for area: ${area.name}, cityId: ${cityId}`);
                console.log(`   Available city IDs: ${cities.map(c => c._id.toString()).join(', ')}`);
            }
        }
        
        console.log(`Total properties generated: ${allProperties.length}`);

        // Insert all properties in batches
        const batchSize = 100;
        let insertedCount = 0;
        
        for (let i = 0; i < allProperties.length; i += batchSize) {
            const batch = allProperties.slice(i, i + batchSize);
            await Property.insertMany(batch);
            insertedCount += batch.length;
            console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} properties`);
        }

        console.log(`🎉 Successfully inserted ${insertedCount} base properties!`);
        
        // Now create WebsitePropertyData with full details
        console.log('🏠 Creating detailed property data for website...');
        
        const allBaseProperties = await Property.find({});
        let websiteDataCount = 0;
        
        // Create a map of area names to area/city data for quick lookup
        const areaMap = {};
        areas.forEach(area => {
            areaMap[area.name.toLowerCase()] = {
                area: area,
                city: cities.find(c => c._id.toString() === (area.city?._id?.toString() || area.city.toString()))
            };
        });
        
        console.log(`Found ${allBaseProperties.length} base properties to process`);
        console.log(`Area map has ${Object.keys(areaMap).length} areas`);
        
        for (const baseProp of allBaseProperties) {
            // Extract area name from address (format: "AreaName, CityName, State")
            const addressParts = baseProp.address.split(',');
            const areaName = addressParts[0]?.trim().toLowerCase();
            const cityName = addressParts[1]?.trim();
            
            const areaData = areaMap[areaName];
            const area = areaData?.area;
            const city = areaData?.city || cities.find(c => c.name === cityName);
            
            if (area && city) {
                const rent = Math.floor(Math.random() * 15000) + 5000; // 5000-20000
                const deposit = Math.floor(rent * 1.5); // 1.5 months rent
                const genderType = ['Male', 'Female', 'Both'][Math.floor(Math.random() * 3)];
                const furnishingType = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'][Math.floor(Math.random() * 3)];
                
                // Generate random amenities (5-8 amenities)
                const selectedAmenities = [];
                const amenitiesList = ['WiFi', 'Parking', 'Security', 'Power Backup', 'Water Supply', 
                                      'Housekeeping', 'Laundry', 'Gym', 'CCTV', 'Fire Safety', 
                                      'AC', 'TV', 'Fridge', 'Washing Machine', 'Microwave'];
                const amenityCount = Math.floor(Math.random() * 4) + 5;
                const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
                for (let j = 0; j < amenityCount; j++) {
                    selectedAmenities.push(shuffled[j]);
                }
                
                // Generate photo URLs
                const photoIds = [
                    '1502672260266-1c1ef2d93688', '1512917774080-9991f1c4c750', '1494203484021-3c454daf695d',
                    '1522708323590-24a02f675e7b', '1502005229766-528631992609', '1560448204-e02f11c3d0e2',
                    '1554995207-c18c203602cb', '1600596542815-6ad4c7c4f1c9', '1584622651720-4b3b5d2e8b9c'
                ];
                const photos = photoIds.slice(0, Math.floor(Math.random() * 3) + 3).map(
                    id => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop`
                );
                
                await WebsitePropertyData.create({
                    propertyId: baseProp._id.toString(),
                    propertyInfo: {
                        name: baseProp.title,
                        address: baseProp.address,
                        city: city.name,
                        area: area.name,
                        photos: photos,
                        ownerName: `Owner of ${baseProp.title}`,
                        ownerPhone: `+91 9${Math.floor(Math.random() * 900000000 + 100000000)}`,
                        rent: rent,
                        deposit: `₹${deposit}`,
                        description: `${baseProp.title} is a ${furnishingType} ${genderType} accommodation located in ${area.name}, ${city.name}. Ideal for students and working professionals.`,
                        amenities: selectedAmenities,
                        genderSuitability: genderType
                    },
                    gender: genderType,
                    status: 'active',
                    isLiveOnWebsite: true,
                    photos: photos,
                    monthlyRent: rent,
                    notes: `Property Type: ${['PG', 'Hostel', 'Flat', 'Room'][Math.floor(Math.random() * 4)]}, Furnishing: ${furnishingType}`,
                    submittedAt: new Date(),
                    updatedAt: new Date(),
                    createdAt: new Date()
                });
                
                websiteDataCount++;
            }
        }
        
        console.log(`✅ Created ${websiteDataCount} detailed property records!`);
        console.log(`📊 Summary: ${insertedCount} base properties + ${websiteDataCount} detailed records`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding properties:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedProperties();
}

module.exports = seedProperties;
