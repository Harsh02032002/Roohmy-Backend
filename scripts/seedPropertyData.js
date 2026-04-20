const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();

// Sample property data with new fields
const sampleProperties = [
  {
    title: "Roomhy Boys PG - Kota",
    description: "Premium paying guest accommodation for boys near coaching centers with all modern amenities",
    address: "Talwandi, Kota, Rajasthan 324005",
    locationCode: "KOT",
    latitude: 25.2138,
    longitude: 75.8648,
    ownerLoginId: "KOT001",
    status: "active",
    isPublished: true,
    
    // Amenities
    amenities: [
      { name: "High-Speed WiFi", icon: "wifi", category: "basic" },
      { name: "Air Conditioning", icon: "wind", category: "comfort" },
      { name: "Attached Bathroom", icon: "droplet", category: "basic" },
      { name: "Study Table", icon: "check", category: "basic" },
      { name: "Wardrobe", icon: "check", category: "basic" },
      { name: "Power Backup", icon: "zap", category: "comfort" },
      { name: "Hot Water", icon: "droplet", category: "comfort" },
      { name: "Laundry Service", icon: "droplet", category: "luxury" },
      { name: "Gym Access", icon: "dumbbell", category: "luxury" },
      { name: "TV Lounge", icon: "tv", category: "comfort" }
    ],
    
    // Exclusive Direct Benefits
    exclusiveBenefits: [
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
        title: "Free Study Materials",
        description: "Access to free notes and study materials",
        icon: "gift"
      }
    ],
    
    // Property Views like OYO
    propertyViews: [
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
    ],
    
    // Legacy images
    images: [
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1642128/pexels-photo-1642128.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    
    featuredImage: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800",
    
    // Property details
    propertyType: "pg",
    gender: "male",
    monthlyRent: 8000,
    totalRooms: 20,
    bedsPerRoom: 2,
    
    // Facilities
    facilities: {
      wifi: true,
      ac: true,
      food: true,
      laundry: true,
      parking: true,
      gym: true,
      tv: true,
      powerBackup: true
    }
  },
  {
    title: "Roomhy Girls Hostel - Indore",
    description: "Safe and secure girls hostel with 24/7 security and homely atmosphere",
    address: "Vijay Nagar, Indore, Madhya Pradesh 452010",
    locationCode: "IND",
    latitude: 22.7196,
    longitude: 75.8577,
    ownerLoginId: "IND001",
    status: "active",
    isPublished: true,
    
    amenities: [
      { name: "High-Speed WiFi", icon: "wifi", category: "basic" },
      { name: "Air Conditioning", icon: "wind", category: "comfort" },
      { name: "Attached Bathroom", icon: "droplet", category: "basic" },
      { name: "Study Table", icon: "check", category: "basic" },
      { name: "Wardrobe", icon: "check", category: "basic" },
      { name: "Power Backup", icon: "zap", category: "comfort" },
      { name: "Hot Water", icon: "droplet", category: "comfort" },
      { name: "Laundry Service", icon: "droplet", category: "luxury" },
      { name: "RO Water", icon: "droplet", category: "basic" },
      { name: "CCTV Security", icon: "shield", category: "basic" }
    ],
    
    exclusiveBenefits: [
      {
        title: "Free Pick-up Service",
        description: "Complimentary pick-up from railway station or airport",
        icon: "gift"
      },
      {
        title: "Parent Lounge",
        description: "Dedicated lounge for visiting parents",
        icon: "heart"
      },
      {
        title: "Self-Defense Classes",
        description: "Free weekly self-defense and fitness classes",
        icon: "shield"
      },
      {
        title: "Career Counseling",
        description: "Monthly career guidance sessions",
        icon: "star"
      }
    ],
    
    propertyViews: [
      {
        label: "Facade",
        images: [
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        description: "Modern building with secure entrance"
      },
      {
        label: "Room",
        images: [
          "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        description: "Comfortable rooms with study area"
      },
      {
        label: "Dining Area",
        images: [
          "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        description: "Clean dining area with nutritious meals"
      },
      {
        label: "Recreation Room",
        images: [
          "https://images.pexels.com/photos/1199960/pexels-photo-1199960.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        description: "Indoor games and recreation area"
      }
    ],
    
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    
    featuredImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    
    propertyType: "hostel",
    gender: "female",
    monthlyRent: 10000,
    totalRooms: 15,
    bedsPerRoom: 3,
    
    facilities: {
      wifi: true,
      ac: true,
      food: true,
      laundry: true,
      parking: false,
      gym: false,
      tv: true,
      powerBackup: true
    }
  }
];

async function seedProperties() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    
    console.log('Connected to MongoDB Atlas');
    
    // Clear existing properties (optional)
    await Property.deleteMany({});
    console.log('Cleared existing properties');
    
    // Insert sample properties
    const insertedProperties = await Property.insertMany(sampleProperties);
    console.log(`Successfully inserted ${insertedProperties.length} properties`);
    
    // Display inserted properties
    insertedProperties.forEach((property, index) => {
      console.log(`\n${index + 1}. ${property.title}`);
      console.log(`   - Amenities: ${property.amenities.length}`);
      console.log(`   - Benefits: ${property.exclusiveBenefits.length}`);
      console.log(`   - Views: ${property.propertyViews.length}`);
      console.log(`   - Monthly Rent: ₹${property.monthlyRent}`);
    });
    
  } catch (error) {
    console.error('Error seeding properties:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedProperties();
}

module.exports = { seedProperties, sampleProperties };
