require('dotenv').config();
const connectDB = require('../config/database');
const mongoose = require('mongoose');
const Property = require('../models/Property');

// Sample property data for different cities
const sampleProperties = [
  {
    title: "Luxury PG - Sector 15, Noida",
    property_name: "Luxury PG - Sector 15, Noida",
    property_type: "pg",
    city: "Noida",
    locality: "Sector 15",
    rent: 12000,
    monthlyRent: 12000,
    gender: "male",
    description: "Premium PG with modern amenities near metro station",
    propertyInfo: {
      name: "Luxury PG - Sector 15, Noida",
      address: "Sector 15, Noida",
      city: "Noida",
      area: "Sector 15",
      ownerName: "Property Owner",
      ownerPhone: "9876543210",
      rent: 12000,
      description: "Premium PG with modern amenities near metro station",
      genderSuitability: "male",
      propertyType: "pg"
    },
    photos: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    propertyViews: [
      {
        label: "Facade",
        images: ["https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Modern building exterior"
      },
      {
        label: "Room",
        images: ["https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Spacious rooms with study tables"
      },
      {
        label: "Kitchen",
        images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Modern kitchen facilities"
      }
    ],
    status: "live",
    isLiveOnWebsite: true,
    isVerified: true,
    rating: 4.5,
    reviewsCount: 12
  },
  {
    title: "Girls Hostel - Koramangala, Bangalore",
    property_name: "Girls Hostel - Koramangala, Bangalore",
    property_type: "hostel",
    city: "Bangalore",
    locality: "Koramangala",
    rent: 15000,
    monthlyRent: 15000,
    gender: "female",
    description: "Safe and secure hostel for women in prime location",
    propertyInfo: {
      name: "Girls Hostel - Koramangala, Bangalore",
      address: "Koramangala, Bangalore",
      city: "Bangalore",
      area: "Koramangala",
      ownerName: "Property Owner",
      ownerPhone: "9876543211",
      rent: 15000,
      description: "Safe and secure hostel for women in prime location",
      genderSuitability: "female",
      propertyType: "hostel"
    },
    photos: [
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    propertyViews: [
      {
        label: "Facade",
        images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Beautiful building exterior"
      },
      {
        label: "Reception",
        images: ["https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "24/7 security reception"
      },
      {
        label: "Room",
        images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Comfortable sharing rooms"
      }
    ],
    status: "live",
    isLiveOnWebsite: true,
    isVerified: true,
    rating: 4.7,
    reviewsCount: 18
  },
  {
    title: "Co-living Space - Indiranagar, Bangalore",
    property_name: "Co-living Space - Indiranagar, Bangalore",
    property_type: "co-living",
    city: "Bangalore",
    locality: "Indiranagar",
    rent: 18000,
    monthlyRent: 18000,
    gender: "any",
    description: "Modern co-living space with community amenities",
    propertyInfo: {
      name: "Co-living Space - Indiranagar, Bangalore",
      address: "Indiranagar, Bangalore",
      city: "Bangalore",
      area: "Indiranagar",
      ownerName: "Property Owner",
      ownerPhone: "9876543212",
      rent: 18000,
      description: "Modern co-living space with community amenities",
      genderSuitability: "any",
      propertyType: "co-living"
    },
    photos: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    propertyViews: [
      {
        label: "Facade",
        images: ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Modern co-living exterior"
      },
      {
        label: "Lobby",
        images: ["https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Community lounge area"
      },
      {
        label: "Room",
        images: ["https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Private rooms with modern amenities"
      }
    ],
    status: "live",
    isLiveOnWebsite: true,
    isVerified: true,
    rating: 4.6,
    reviewsCount: 15
  },
  {
    title: "Student PG - near JNU, Delhi",
    property_name: "Student PG - near JNU, Delhi",
    property_type: "pg",
    city: "Delhi",
    locality: "JNU",
    rent: 10000,
    monthlyRent: 10000,
    gender: "male",
    description: "Affordable PG for students near JNU campus",
    propertyInfo: {
      name: "Student PG - near JNU, Delhi",
      address: "JNU, Delhi",
      city: "Delhi",
      area: "JNU",
      ownerName: "Property Owner",
      ownerPhone: "9876543213",
      rent: 10000,
      description: "Affordable PG for students near JNU campus",
      genderSuitability: "male",
      propertyType: "pg"
    },
    photos: [
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    propertyViews: [
      {
        label: "Building",
        images: ["https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Student-friendly building"
      },
      {
        label: "Study Room",
        images: ["https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Dedicated study area"
      },
      {
        label: "Room",
        images: ["https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Budget-friendly rooms"
      }
    ],
    status: "live",
    isLiveOnWebsite: true,
    isVerified: true,
    rating: 4.3,
    reviewsCount: 20
  },
  {
    title: "Luxury Apartment - Gurgaon",
    property_name: "Luxury Apartment - Gurgaon",
    property_type: "apartment",
    city: "Gurgaon",
    locality: "Sector 56",
    rent: 25000,
    monthlyRent: 25000,
    gender: "any",
    description: "Premium 2BHK apartment with all modern amenities",
    propertyInfo: {
      name: "Luxury Apartment - Gurgaon",
      address: "Sector 56, Gurgaon",
      city: "Gurgaon",
      area: "Sector 56",
      ownerName: "Property Owner",
      ownerPhone: "9876543214",
      rent: 25000,
      description: "Premium 2BHK apartment with all modern amenities",
      genderSuitability: "any",
      propertyType: "apartment"
    },
    photos: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    propertyViews: [
      {
        label: "Building",
        images: ["https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Luxury apartment building"
      },
      {
        label: "Living Room",
        images: ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Spacious living area"
      },
      {
        label: "Bedroom",
        images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Master bedroom with attached bath"
      }
    ],
    status: "live",
    isLiveOnWebsite: true,
    isVerified: true,
    rating: 4.8,
    reviewsCount: 8
  }
];

// Generate more properties to reach 30 total
function generateAdditionalProperties() {
  const cities = ['Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Bhopal', 'Nagpur'];
  const localities = {
    'Pune': ['Koregaon Park', 'Hinjewadi', 'Kothrud', 'Shivaji Nagar'],
    'Hyderabad': ['Gachibowli', 'Madhapur', 'Banjara Hills', 'Jubilee Hills'],
    'Chennai': ['T Nagar', 'Adyar', 'Velachery', 'OMR'],
    'Kolkata': ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge'],
    'Ahmedabad': ['Satellite', 'Bodakdev', 'Vastrapur', 'Prahlad Nagar'],
    'Jaipur': ['Malviya Nagar', 'Tonk Road', 'Civil Lines', 'Raja Park'],
    'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar'],
    'Indore': ['Vijay Nagar', 'Palasia', 'AB Road', 'Bhawarkua'],
    'Bhopal': ['MP Nagar', 'Arera Colony', 'Shahpura', 'Kolar'],
    'Nagpur': ['Civil Lines', 'Dharampeth', 'Ramdaspeth', 'Sadar']
  };
  
  const propertyTypes = ['pg', 'hostel', 'co-living', 'apartment'];
  const genders = ['male', 'female', 'any'];
  
  const additionalProperties = [];
  
  for (let i = 0; i < 25; i++) {
    const city = cities[i % cities.length];
    const cityLocalities = localities[city];
    const locality = cityLocalities[Math.floor(Math.random() * cityLocalities.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const rent = Math.floor(Math.random() * 20000) + 6000;
    
    const property = {
      title: `${propertyType.toUpperCase()} - ${locality}, ${city}`,
      property_name: `${propertyType.toUpperCase()} - ${locality}, ${city}`,
      property_type: propertyType,
      city: city,
      locality: locality,
      rent: rent,
      monthlyRent: rent,
      gender: gender,
      description: `Modern ${propertyType} in ${locality}, ${city} with all amenities`,
      propertyInfo: {
        name: `${propertyType.toUpperCase()} - ${locality}, ${city}`,
        address: `${locality}, ${city}`,
        city: city,
        area: locality,
        ownerName: "Property Owner",
        ownerPhone: `9876543${String(1000 + i).slice(-4)}`,
        rent: rent,
        description: `Modern ${propertyType} in ${locality}, ${city} with all amenities`,
        genderSuitability: gender,
        propertyType: propertyType
      },
      photos: [
        `https://picsum.photos/800/600?random=${100 + i}`,
        `https://picsum.photos/800/600?random=${200 + i}`,
        `https://picsum.photos/800/600?random=${300 + i}`
      ],
      propertyViews: [
        {
          label: "Facade",
          images: [`https://picsum.photos/800/600?random=${100 + i}`],
          description: "Building exterior"
        },
        {
          label: "Room",
          images: [`https://picsum.photos/800/600?random=${200 + i}`],
          description: "Room interior"
        },
        {
          label: "Amenities",
          images: [`https://picsum.photos/800/600?random=${300 + i}`],
          description: "Available amenities"
        }
      ],
      status: "live",
      isLiveOnWebsite: true,
      isVerified: true,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewsCount: Math.floor(Math.random() * 30) + 5
    };
    
    additionalProperties.push(property);
  }
  
  return additionalProperties;
}

async function addSampleProperties() {
  try {
    await connectDB();
    console.log('🔄 Connected to MongoDB Atlas');

    // Get current property count
    const currentCount = await Property.countDocuments({});
    console.log(`📊 Current property count: ${currentCount}`);

    // Generate additional properties
    const additionalProperties = generateAdditionalProperties();
    const allProperties = [...sampleProperties, ...additionalProperties];
    
    console.log(`📝 Adding ${allProperties.length} new properties...`);

    let addedCount = 0;
    
    for (const propertyData of allProperties) {
      // Generate unique IDs
      const propertyId = `${propertyData.city.toUpperCase()}-${propertyData.property_type.toUpperCase()}-${String(1000 + addedCount).slice(-4)}`;
      
      const newProperty = new Property({
        ...propertyData,
        locationCode: propertyData.city.toUpperCase().slice(0, 3),
        status: "active",
        isPublished: true,
        submittedAt: new Date(),
        approvedAt: new Date(),
        createdBy: "superadmin",
        generatedCredentials: {},
        amenities: [
          { name: "High-Speed WiFi", icon: "wifi", category: "basic" },
          { name: "Power Backup", icon: "zap", category: "comfort" },
          { name: "Security", icon: "shield", category: "basic" }
        ],
        exclusiveBenefits: [
          {
            title: "Free First Month Maintenance",
            description: "No maintenance charges for the first month",
            icon: "gift"
          }
        ],
        facilities: {
          wifi: true,
          ac: Math.random() > 0.5,
          food: Math.random() > 0.5,
          laundry: Math.random() > 0.5,
          parking: Math.random() > 0.5,
          gym: Math.random() > 0.7,
          tv: Math.random() > 0.5,
          powerBackup: true
        },
        totalRooms: Math.floor(Math.random() * 20) + 5,
        bedsPerRoom: Math.floor(Math.random() * 3) + 1
      });
      
      await newProperty.save();
      addedCount++;
      
      if (addedCount % 10 === 0) {
        console.log(`✅ Added ${addedCount} properties...`);
      }
    }

    const finalCount = await Property.countDocuments({});
    console.log(`🎉 Successfully added ${addedCount} new properties!`);
    console.log(`📊 Total properties in database: ${finalCount}`);
    
    // Show sample properties by city
    const propertiesByCity = await Property.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🏙️ Properties by city:');
    propertiesByCity.forEach(city => {
      console.log(`- ${city._id}: ${city.count} properties`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding properties:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addSampleProperties();
}

module.exports = addSampleProperties;
