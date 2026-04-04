require('dotenv').config();
const connectDB = require('../config/database');
const mongoose = require('mongoose');

// 4 High-quality Pexels images per property type
const propertyImages = {
  pg: [
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  hostel: [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2029719/pexels-photo-2029719.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  flat: [
    'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/271660/pexels-photo-271660.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2459/pexels-photo-2459.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
};

// Define ApprovedProperty schema inline
const ApprovedPropertySchema = new mongoose.Schema({
  visitId: { type: String, required: true, unique: true },
  propertyInfo: {
    name: { type: String, required: true },
    propertyType: String,
    area: String,
    city: String,
    rent: Number,
    genderSuitability: String,
    photos: [String],
    totalSeats: Number,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  status: { type: String, enum: ['approved', 'live', 'offline'], default: 'approved' },
  isLiveOnWebsite: { type: Boolean, default: true },
  nearbyColleges: [String],
  professionalPhotos: [String],
  submittedAt: { type: Date },
  approvedAt: { type: Date, default: Date.now },
  generatedCredentials: {
    loginId: String,
    password: String,
    ownerName: String
  },
  approvedBy: String,
  createdAt: { type: Date, default: Date.now }
});

// Add geospatial index for location-based queries
ApprovedPropertySchema.index({ 'propertyInfo.location': '2dsphere' });

const ApprovedProperty = mongoose.model('ApprovedProperty', ApprovedPropertySchema);

const properties = [
  // Kota Properties
  { 
    visitId: 'KOTA-PG-001', 
    propertyInfo: { 
      name: 'Cozy PG North', 
      propertyType: 'PG', 
      area: 'Dadabari', 
      city: 'Kota', 
      rent: 8000, 
      genderSuitability: 'Co-ed',
      totalSeats: 15,
      photos: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8648, 25.2138] }
    },
    nearbyColleges: ['Allen Career Institute', 'Resonance Eduventures', 'Bansal Classes', 'Motion IIT-JEE', 'Vibrant Academy', 'Nucleus Education', 'Etoos India', 'Carrer Point', 'Allen Samanvaya'],
    generatedCredentials: { loginId: 'kota_pg_001', ownerName: 'Rajesh Singh' }
  },
  { 
    visitId: 'KOTA-HOSTEL-001', 
    propertyInfo: { 
      name: 'Student Hostel Central', 
      propertyType: 'Hostel', 
      area: 'Nayapura', 
      city: 'Kota', 
      rent: 6500, 
      genderSuitability: 'Male',
      totalSeats: 30,
      photos: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8396, 25.1825] }
    },
    nearbyColleges: ['Allen Career Institute', 'Resonance Eduventures', 'Vidyamandir Classes', 'Akash Institute', 'Carrer Point', 'Bansal Classes', 'Etoos India', 'Vibrant Academy'],
    generatedCredentials: { loginId: 'kota_hostel_001', ownerName: 'Priya Sharma' }
  },
  { 
    visitId: 'KOTA-FLAT-001', 
    propertyInfo: { 
      name: 'Premium Shared Room', 
      propertyType: 'Flat', 
      area: 'Mahavir Nagar', 
      city: 'Kota', 
      rent: 9500, 
      genderSuitability: 'Co-ed',
      totalSeats: 4,
      photos: ['https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8500, 25.2000] }
    },
    nearbyColleges: ['Bansal Classes', 'Motion IIT-JEE', 'Vidyamandir Classes', 'Allen Samanvaya', 'Resonance Eduventures', 'Etoos India'],
    generatedCredentials: { loginId: 'kota_flat_001', ownerName: 'Rohan Verma' }
  },

  // Indore Properties
  { 
    visitId: 'INDORE-PG-001', 
    propertyInfo: { 
      name: 'Modern PG Indore', 
      propertyType: 'PG', 
      area: 'Rajwada', 
      city: 'Indore', 
      rent: 7000, 
      genderSuitability: 'Female',
      totalSeats: 20,
      photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8577, 22.7196] }
    },
    nearbyColleges: ['IIT Indore', 'MITS Indore', 'Devi Ahilya University', 'Indian Institute of Management Indore', 'Maharaja Ranjit Singh College', 'Acropolis Institute'],
    generatedCredentials: { loginId: 'indore_pg_001', ownerName: 'Anjali Patel' }
  },
  { 
    visitId: 'INDORE-HOSTEL-001', 
    propertyInfo: { 
      name: 'Budget Hostel Indore', 
      propertyType: 'Hostel', 
      area: 'Khajrana', 
      city: 'Indore', 
      rent: 5500, 
      genderSuitability: 'Male',
      totalSeats: 25,
      photos: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.9013, 22.7545] }
    },
    nearbyColleges: ['MITS Indore', 'Prestige Institute of Management', 'Choithram School', 'Indore Institute of Science and Technology', 'Sushila Devi Bansal College'],
    generatedCredentials: { loginId: 'indore_hostel_001', ownerName: 'Vikram Singh' }
  },

  // Jaipur Properties
  { 
    visitId: 'JAIPUR-PG-001', 
    propertyInfo: { 
      name: 'Pink City PG', 
      propertyType: 'PG', 
      area: 'C Scheme', 
      city: 'Jaipur', 
      rent: 9000, 
      genderSuitability: 'Female',
      totalSeats: 18,
      photos: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.7873, 26.9124] }
    },
    nearbyColleges: ['MNIT Jaipur', 'Jaipur University', 'Manipal University', 'Amity University Jaipur', 'JECRC University', 'Poornima College'],
    generatedCredentials: { loginId: 'jaipur_pg_001', ownerName: 'Neha Singh' }
  },
  { 
    visitId: 'JAIPUR-FLAT-001', 
    propertyInfo: { 
      name: 'Studio Apartment Jaipur', 
      propertyType: 'Flat', 
      area: 'Tonk Road', 
      city: 'Jaipur', 
      rent: 12000, 
      genderSuitability: 'Co-ed',
      totalSeats: 2,
      photos: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8050, 26.8500] }
    },
    nearbyColleges: ['IIT Jodhpur', 'MNIT Jaipur', 'ICFAI Jaipur', 'Jaipur National University', 'Stani Memorial College'],
    generatedCredentials: { loginId: 'jaipur_flat_001', ownerName: 'Arun Kumar' }
  },

  // Delhi Properties
  { 
    visitId: 'DELHI-PG-001', 
    propertyInfo: { 
      name: 'North Campus PG', 
      propertyType: 'PG', 
      area: 'North Campus', 
      city: 'Delhi', 
      rent: 10000, 
      genderSuitability: 'Female',
      totalSeats: 12,
      photos: ['https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [77.2090, 28.6139] }
    },
    nearbyColleges: ['Delhi University', 'AIIMS Delhi', 'IIT Delhi', 'IIIT Delhi'],
    generatedCredentials: { loginId: 'delhi_pg_001', ownerName: 'Priya Gupt' }
  },
  { 
    visitId: 'DELHI-FLAT-001', 
    propertyInfo: { 
      name: 'South Delhi Flat', 
      propertyType: 'Flat', 
      area: 'South Delhi', 
      city: 'Delhi', 
      rent: 15000, 
      genderSuitability: 'Co-ed',
      totalSeats: 3,
      photos: ['https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [77.2274, 28.5700] }
    },
    nearbyColleges: ['Delhi Technological University', 'IIT Delhi', 'IIIT Delhi'],
    generatedCredentials: { loginId: 'delhi_flat_001', ownerName: 'Vikram Sharma' }
  },

  // Bhopal Properties
  { 
    visitId: 'BHOPAL-PG-001', 
    propertyInfo: { 
      name: 'Lake City PG', 
      propertyType: 'PG', 
      area: 'Hoshangabad Road', 
      city: 'Bhopal', 
      rent: 6500, 
      genderSuitability: 'Co-ed',
      totalSeats: 16,
      photos: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [77.4126, 23.2599] }
    },
    nearbyColleges: ['Bhopal University', 'IISER Bhopal', 'Barkatullah University'],
    generatedCredentials: { loginId: 'bhopal_pg_001', ownerName: 'Rajiv Jain' }
  },

  // Nagpur Properties
  { 
    visitId: 'NAGPUR-PG-001', 
    propertyInfo: { 
      name: 'Orange City PG', 
      propertyType: 'PG', 
      area: 'Sitabuldi', 
      city: 'Nagpur', 
      rent: 7500, 
      genderSuitability: 'Female',
      totalSeats: 14,
      photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [79.0821, 21.1458] }
    },
    nearbyColleges: ['VNIT Nagpur', 'RCOEM Nagpur', 'Nagpur University'],
    generatedCredentials: { loginId: 'nagpur_pg_001', ownerName: 'Sunita Desai' }
  },

  // Mumbai Properties
  { 
    visitId: 'MUMBAI-HOSTEL-001', 
    propertyInfo: { 
      name: 'Mumbai Hostel Fort', 
      propertyType: 'Hostel', 
      area: 'Fort', 
      city: 'Mumbai', 
      rent: 8500, 
      genderSuitability: 'Male',
      totalSeats: 20,
      photos: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [72.8258, 18.9322] }
    },
    nearbyColleges: ['IIT Bombay', 'IIMC Mumbai', 'Mumbai University', 'St. Xaviers College'],
    generatedCredentials: { loginId: 'mumbai_hostel_001', ownerName: 'Ashok Pillai' }
  },

  // Bangalore Properties
  { 
    visitId: 'BANGALORE-PG-001', 
    propertyInfo: { 
      name: 'Tech Park PG Bangalore', 
      propertyType: 'PG', 
      area: 'Whitefield', 
      city: 'Bangalore', 
      rent: 11000, 
      genderSuitability: 'Co-ed',
      totalSeats: 22,
      photos: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [77.7500, 12.9700] }
    },
    nearbyColleges: ['IIT Bangalore', 'IISC Bangalore', 'NIT Karnataka', 'Christ University'],
    generatedCredentials: { loginId: 'bangalore_pg_001', ownerName: 'Arjun Kumar' }
  },

  // Additional Kota Properties - Near Real Coaching Institutes
  { 
    visitId: 'KOTA-PG-002', 
    propertyInfo: { 
      name: 'Allen View PG', 
      propertyType: 'PG', 
      area: 'Nayapura', 
      city: 'Kota', 
      rent: 7500, 
      genderSuitability: 'Female',
      totalSeats: 18,
      photos: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8400, 25.1820] }
    },
    nearbyColleges: ['Allen Career Institute', 'Allen Samanvaya', 'Nayapura Market'],
    generatedCredentials: { loginId: 'kota_pg_002', ownerName: 'Suresh Kumar' }
  },
  { 
    visitId: 'KOTA-HOSTEL-002', 
    propertyInfo: { 
      name: 'Resonance Near Hostel', 
      propertyType: 'Hostel', 
      area: 'Indra Vihar', 
      city: 'Kota', 
      rent: 6000, 
      genderSuitability: 'Male',
      totalSeats: 35,
      photos: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8420, 25.1805] }
    },
    nearbyColleges: ['Resonance Eduventures', 'Bansal Classes', 'Vibrant Academy', 'Motion IIT-JEE'],
    generatedCredentials: { loginId: 'kota_hostel_002', ownerName: 'Ramesh Patel' }
  },
  { 
    visitId: 'KOTA-PG-003', 
    propertyInfo: { 
      name: 'Vibrant Stay PG', 
      propertyType: 'PG', 
      area: 'Rajiv Gandhi Nagar', 
      city: 'Kota', 
      rent: 8500, 
      genderSuitability: 'Co-ed',
      totalSeats: 20,
      photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [75.8380, 25.1780] }
    },
    nearbyColleges: ['Vibrant Academy', 'Nucleus Education', 'Etoos India', 'Carrer Point'],
    generatedCredentials: { loginId: 'kota_pg_003', ownerName: 'Meena Sharma' }
  },

  // Additional Delhi Properties - Near Delhi University
  { 
    visitId: 'DELHI-HOSTEL-002', 
    propertyInfo: { 
      name: 'DU North Campus Hostel', 
      propertyType: 'Hostel', 
      area: 'Kamla Nagar', 
      city: 'Delhi', 
      rent: 12000, 
      genderSuitability: 'Female',
      totalSeats: 25,
      photos: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [77.2100, 28.6800] }
    },
    nearbyColleges: ['Delhi University', 'Hindu College', 'Ramjas College', 'St. Stephen College'],
    generatedCredentials: { loginId: 'delhi_hostel_002', ownerName: 'Dr. Anita Gupta' }
  },
  { 
    visitId: 'DELHI-PG-002', 
    propertyInfo: { 
      name: 'IIT Delhi View PG', 
      propertyType: 'PG', 
      area: 'Hauz Khas', 
      city: 'Delhi', 
      rent: 14000, 
      genderSuitability: 'Male',
      totalSeats: 15,
      photos: ['https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=600'],
      location: { type: 'Point', coordinates: [77.1950, 28.5450] }
    },
    nearbyColleges: ['IIT Delhi', 'IIIT Delhi', 'AIIMS Delhi'],
    generatedCredentials: { loginId: 'delhi_pg_002', ownerName: 'Prof. Rajesh Kumar' }
  }
];

async function seedProperties() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await ApprovedProperty.deleteMany({});
    console.log('🗑️  Cleared existing properties');

    // Add professionalPhotos to each property based on type
    const propertiesWithImages = properties.map(p => {
      const type = p.propertyInfo.propertyType?.toLowerCase() || 'pg';
      return {
        ...p,
        professionalPhotos: propertyImages[type] || propertyImages.pg
      };
    });

    // Seed properties
    const createdProperties = await ApprovedProperty.insertMany(propertiesWithImages);
    console.log(`✅ Seeded ${createdProperties.length} properties with 4 images each:`);
    
    const grouped = {};
    createdProperties.forEach(p => {
      const city = p.propertyInfo.city;
      if (!grouped[city]) grouped[city] = 0;
      grouped[city]++;
    });
    
    Object.entries(grouped).forEach(([city, count]) => {
      console.log(`   - ${city}: ${count} properties`);
    });

    await mongoose.disconnect();
    console.log('✅ Property seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error.message);
    process.exit(1);
  }
}

seedProperties();
