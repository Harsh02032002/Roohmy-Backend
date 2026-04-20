require('dotenv').config();
const connectDB = require('../config/database');
const mongoose = require('mongoose');
const Property = require('../models/Property');

// Sample data to add to existing properties
const sampleAmenities = [
  { name: "High-Speed WiFi", icon: "wifi", category: "basic" },
  { name: "Air Conditioning", icon: "wind", category: "comfort" },
  { name: "Attached Bathroom", icon: "droplet", category: "basic" },
  { name: "Study Table", icon: "check", category: "basic" },
  { name: "Power Backup", icon: "zap", category: "comfort" },
  { name: "Hot Water", icon: "droplet", category: "comfort" },
  { name: "Laundry Service", icon: "droplet", category: "luxury" },
  { name: "Gym Access", icon: "dumbbell", category: "luxury" },
  { name: "TV Lounge", icon: "tv", category: "comfort" },
  { name: "Parking", icon: "car", category: "basic" }
];

const sampleBenefits = [
  {
    title: "Free First Month Maintenance",
    description: "No maintenance charges for the first month of stay",
    icon: "gift"
  },
  {
    title: "Discounted Coaching Center Fees",
    description: "Get 10% discount on partner coaching centers",
    icon: "star"
  },
  {
    title: "24/7 Medical Support",
    description: "On-call doctor assistance for medical emergencies",
    icon: "shield"
  },
  {
    title: "Free Cancellation up to 24 hours",
    description: "Cancel booking up to 24 hours before check-in",
    icon: "clock"
  }
];

const sampleViews = [
  {
    label: "Facade",
    images: [
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Beautiful exterior of the property with modern architecture"
  },
  {
    label: "Room",
    images: [
      "https://images.pexels.com/photos/1642128/pexels-photo-1642128.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Spacious and well-ventilated rooms with modern furniture"
  },
  {
    label: "Kitchen",
    images: [
      "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Clean and hygienic kitchen with modern appliances"
  },
  {
    label: "Lobby",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    description: "Welcoming lobby with seating area and reception"
  }
];

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * count) + 1);
}

function getRandomFacilities() {
  return {
    wifi: Math.random() > 0.2,
    ac: Math.random() > 0.3,
    food: Math.random() > 0.4,
    laundry: Math.random() > 0.5,
    parking: Math.random() > 0.3,
    gym: Math.random() > 0.6,
    tv: Math.random() > 0.4,
    powerBackup: Math.random() > 0.2
  };
}

function getRandomPropertyType() {
  const types = ['pg', 'hostel', 'co-living', 'apartment'];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomGender() {
  const genders = ['male', 'female', 'any'];
  return genders[Math.floor(Math.random() * genders.length)];
}

async function updateExistingProperties() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    // Get all existing properties
    const properties = await Property.find({});
    console.log(`Found ${properties.length} existing properties to update`);

    let updatedCount = 0;
    
    for (const property of properties) {
      // Generate sample data for each property
      const amenities = getRandomItems(sampleAmenities, 8);
      const exclusiveBenefits = getRandomItems(sampleBenefits, 3);
      const propertyViews = getRandomItems(sampleViews, 4);
      const facilities = getRandomFacilities();
      
      // Extract rent from title or generate random
      const rentMatch = property.title.match(/\d+/);
      const monthlyRent = rentMatch ? parseInt(rentMatch[0]) * 100 : Math.floor(Math.random() * 15000) + 5000;
      
      // Update property with new fields
      await Property.findByIdAndUpdate(property._id, {
        amenities,
        exclusiveBenefits,
        propertyViews,
        facilities,
        propertyType: getRandomPropertyType(),
        gender: getRandomGender(),
        monthlyRent,
        totalRooms: Math.floor(Math.random() * 20) + 5,
        bedsPerRoom: Math.floor(Math.random() * 3) + 1,
        images: propertyViews[0]?.images || [],
        featuredImage: propertyViews[0]?.images?.[0] || null,
        updatedAt: new Date()
      });
      
      updatedCount++;
      
      if (updatedCount % 50 === 0) {
        console.log(`✅ Updated ${updatedCount} properties...`);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} properties with new fields!`);
    
    // Show sample of updated property
    const sampleProperty = await Property.findOne({});
    console.log('\n📋 Sample Updated Property:');
    console.log(`- Title: ${sampleProperty.title}`);
    console.log(`- Amenities: ${sampleProperty.amenities?.length || 0}`);
    console.log(`- Benefits: ${sampleProperty.exclusiveBenefits?.length || 0}`);
    console.log(`- Views: ${sampleProperty.propertyViews?.length || 0}`);
    console.log(`- Monthly Rent: ₹${sampleProperty.monthlyRent}`);
    console.log(`- Property Type: ${sampleProperty.propertyType}`);
    console.log(`- Gender: ${sampleProperty.gender}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating properties:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateExistingProperties();
}

module.exports = updateExistingProperties;
