const mongoose = require('mongoose');
const City = require('../models/City');
const Area = require('../models/Area');
require('dotenv').config({ path: '../.env' });

const citiesData = [
  {
    name: 'Kota',
    state: 'Rajasthan',
    country: 'India',
    colleges: ['Allen Career Institute', 'Resonance', 'Bansal Classes', 'Vibrant Academy'],
    population: 1200000,
    imageUrl: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/kota_466685',
    propertyCount: 2500,
    description: 'Education hub of India, famous for coaching institutes',
    coordinates: { latitude: 25.2138, longitude: 75.8648 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    colleges: ['IIM Indore', 'IIT Indore', 'DAVV', 'Medi-Caps University'],
    population: 2100000,
    imageUrl: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/indore_1370704',
    propertyCount: 1800,
    description: 'Cleanest city of India, major educational and commercial center',
    coordinates: { latitude: 22.7196, longitude: 75.8577 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    colleges: ['Malaviya National Institute of Technology', 'Rajasthan University', 'Jaipur National University'],
    population: 3200000,
    imageUrl: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/jaipur_1603650',
    propertyCount: 3200,
    description: 'Pink City of India, major tourist and educational destination',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Delhi',
    state: 'Delhi',
    country: 'India',
    colleges: ['IIT Delhi', 'Delhi University', 'JNU', 'AIIMS Delhi'],
    population: 32000000,
    imageUrl: 'https://images.pexels.com/photos/789380/pexels-photo-789380.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/delhi_789380',
    propertyCount: 5000,
    description: 'Capital of India, major educational and commercial hub',
    coordinates: { latitude: 28.6139, longitude: 77.2090 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    colleges: ['IIT Bhopal', 'MANIT', 'Barkatullah University'],
    population: 1800000,
    imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/bhopal_1134176',
    propertyCount: 1200,
    description: 'City of Lakes, emerging educational center',
    coordinates: { latitude: 23.2599, longitude: 77.4126 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    colleges: ['IIM Nagpur', 'NIT Nagpur', 'Nagpur University'],
    population: 2400000,
    imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/nagpur_1181406',
    propertyCount: 980,
    description: 'Orange City, major educational hub in central India',
    coordinates: { latitude: 21.1458, longitude: 79.0882 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    colleges: ['IIT Jodhpur', 'JNV University', 'MBM Engineering College'],
    population: 1400000,
    imageUrl: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/jodhpur_1007426',
    propertyCount: 850,
    description: 'Sun City, emerging educational destination',
    coordinates: { latitude: 26.2389, longitude: 73.0243 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    colleges: ['IIT Bombay', 'Mumbai University', 'SP Jain', 'NMIMS'],
    population: 20000000,
    imageUrl: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=400',
    imagePublicId: 'roomhy/cities/mumbai_189349',
    propertyCount: 4500,
    description: 'Financial capital of India, major educational and commercial hub',
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    status: 'Active',
    createdBy: 'superadmin',
    lastModifiedBy: 'superadmin'
  }
];

const areasData = [
  // Kota Areas
  { name: 'Talwandi', city: null, cityName: 'Kota', zone: 'Central', landmarks: ['Allen Career Institute', 'Kota Junction'], imageUrl: 'https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/talwandi_kota_1571469', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Mahaveer Nagar', city: null, cityName: 'Kota', zone: 'South', landmarks: ['Resonance Institute', 'Mahaveer Nagar Market'], imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/mahaveernagar_kota_323780', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Vigyan Nagar', city: null, cityName: 'Kota', zone: 'North', landmarks: ['Bansal Classes', 'Vigyan Nagar Park'], imageUrl: 'https://images.pexels.com/photos/1108571/pexels-photo-1108571.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/vigyannagar_kota_1108571', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Rangbari', city: null, cityName: 'Kota', zone: 'East', landmarks: ['Rangbari Garden', 'Kota Railway Station'], imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/rangbari_kota_3861969', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Gumanpura', city: null, cityName: 'Kota', zone: 'West', landmarks: ['Gumanpura Market', 'Kota Bus Stand'], imageUrl: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/gumanpura_kota_70497', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Indore Areas
  { name: 'Vijay Nagar', city: null, cityName: 'Indore', zone: 'East', landmarks: ['IIM Indore', 'C21 Mall'], imageUrl: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/vijaynagar_indore_1571467', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Palasia', city: null, cityName: 'Indore', zone: 'Central', landmarks: ['Palasia Market', 'MG Road'], imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/palasia_indore_1486222', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Bhawarkua', city: null, cityName: 'Indore', zone: 'South', landmarks: ['Bhawarkua Square', 'Sarafa Market'], imageUrl: 'https://images.pexels.com/photos/276673/pexels-photo-276673.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/bhawarkua_indore_276673', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Geeta Bhawan', city: null, cityName: 'Indore', zone: 'North', landmarks: ['Geeta Bhawan Square', 'Indore Railway Station'], imageUrl: 'https://images.pexels.com/photos/3861976/pexels-photo-3861976.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/geetabhawan_indore_3861976', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Rajendra Nagar', city: null, cityName: 'Indore', zone: 'West', landmarks: ['Rajendra Nagar Market', 'Lal Bagh Palace'], imageUrl: 'https://images.pexels.com/photos/2582927/pexels-photo-2582927.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/rajendranagar_indore_2582927', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Jaipur Areas
  { name: 'Mansarovar', city: null, cityName: 'Jaipur', zone: 'South', landmarks: ['Mansarovar Market', 'JECRC College'], imageUrl: 'https://images.pexels.com/photos/1549248/pexels-photo-1549248.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/mansarovar_jaipur_1549248', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Malviya Nagar', city: null, cityName: 'Jaipur', zone: 'Central', landmarks: ['Malviya Nagar Market', 'World Trade Park'], imageUrl: 'https://images.pexels.com/photos/145845/pexels-photo-145845.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/malviyanagar_jaipur_145845', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Vaishali Nagar', city: null, cityName: 'Jaipur', zone: 'West', landmarks: ['Vaishali Nagar Market', 'Jaipur Airport'], imageUrl: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/vaishalinagar_jaipur_302769', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Raja Park', city: null, cityName: 'Jaipur', zone: 'East', landmarks: ['Raja Park Market', 'Birla Temple'], imageUrl: 'https://images.pexels.com/photos/1267305/pexels-photo-1267305.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/rajapark_jaipur_1267305', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Jhotwara', city: null, cityName: 'Jaipur', zone: 'North', landmarks: ['Jhotwara Market', 'Jhotwara Industrial Area'], imageUrl: 'https://images.pexels.com/photos/276718/pexels-photo-276718.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/jhotwara_jaipur_276718', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Delhi Areas
  { name: 'Dwarka', city: null, cityName: 'Delhi', zone: 'South West', landmarks: ['Dwarka Sector 21', 'Dwarka Metro Station'], imageUrl: 'https://images.pexels.com/photos/3861978/pexels-photo-3861978.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/dwarka_delhi_3861978', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Rohini', city: null, cityName: 'Delhi', zone: 'North West', landmarks: ['Rohini Sector 10', 'Rithala Metro Station'], imageUrl: 'https://images.pexels.com/photos/3861968/pexels-photo-3861968.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/rohini_delhi_3861968', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Lajpat Nagar', city: null, cityName: 'Delhi', zone: 'South', landmarks: ['Lajpat Nagar Market', 'Lajpat Nagar Metro Station'], imageUrl: 'https://images.pexels.com/photos/279574/pexels-photo-279574.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/lajpatnagar_delhi_279574', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Karol Bagh', city: null, cityName: 'Delhi', zone: 'Central', landmarks: ['Karol Bagh Market', 'Karol Bagh Metro Station'], imageUrl: 'https://images.pexels.com/photos/279710/pexels-photo-279710.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/karolbagh_delhi_279710', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Mayur Vihar', city: null, cityName: 'Delhi', zone: 'East', landmarks: ['Mayur Vihar Phase 1', 'Mayur Vihar Metro Station'], imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/mayurvihaar_delhi_271816', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Bhopal Areas
  { name: 'MP Nagar', city: null, cityName: 'Bhopal', zone: 'Central', landmarks: ['MP Nagar Market', 'Bhopal Railway Station'], imageUrl: 'https://images.pexels.com/photos/271812/pexels-photo-271812.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/mpnagar_bhopal_271812', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Arera Colony', city: null, cityName: 'Bhopal', zone: 'South', landmarks: ['Arera Colony Market', 'BHEL Township'], imageUrl: 'https://images.pexels.com/photos/271807/pexels-photo-271807.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/areracolony_bhopal_271807', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'New Market', city: null, cityName: 'Bhopal', zone: 'North', landmarks: ['New Market', 'Jahangirabad'], imageUrl: 'https://images.pexels.com/photos/271824/pexels-photo-271824.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/newmarket_bhopal_271824', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Habibganj', city: null, cityName: 'Bhopal', zone: 'East', landmarks: ['Habibganj Railway Station', 'DB City Mall'], imageUrl: 'https://images.pexels.com/photos/271819/pexels-photo-271819.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/habibganj_bhopal_271819', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Kolar', city: null, cityName: 'Bhopal', zone: 'West', landmarks: ['Kolar Road', 'Bhoj University'], imageUrl: 'https://images.pexels.com/photos/271811/pexels-photo-271811.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/kolar_bhopal_271811', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Nagpur Areas
  { name: 'Civil Lines', city: null, cityName: 'Nagpur', zone: 'Central', landmarks: ['Civil Lines', 'Nagpur Railway Station'], imageUrl: 'https://images.pexels.com/photos/271826/pexels-photo-271826.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/civillines_nagpur_271826', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Sadar', city: null, cityName: 'Nagpur', zone: 'North', landmarks: ['Sadar Market', 'Rani Durgavati Museum'], imageUrl: 'https://images.pexels.com/photos/271823/pexels-photo-271823.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/sadar_nagpur_271823', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Dharampeth', city: null, cityName: 'Nagpur', zone: 'South', landmarks: ['Dharampeth Market', 'Japanese Garden'], imageUrl: 'https://images.pexels.com/photos/271825/pexels-photo-271825.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/dharampeth_nagpur_271825', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Wardha Road', city: null, cityName: 'Nagpur', zone: 'East', landmarks: ['Wardha Road', 'Nagpur Airport'], imageUrl: 'https://images.pexels.com/photos/271814/pexels-photo-271814.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/wardharoad_nagpur_271814', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Laxmi Nagar', city: null, cityName: 'Nagpur', zone: 'West', landmarks: ['Laxmi Nagar Market', 'Kalamna Lake'], imageUrl: 'https://images.pexels.com/photos/271813/pexels-photo-271813.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/laxminagar_nagpur_271813', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Jodhpur Areas
  { name: 'Paota', city: null, cityName: 'Jodhpur', zone: 'North', landmarks: ['Paota Circle', 'Jodhpur Railway Station'], imageUrl: 'https://images.pexels.com/photos/271820/pexels-photo-271820.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/paota_jodhpur_271820', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Sardarpura', city: null, cityName: 'Jodhpur', zone: 'Central', landmarks: ['Sardarpura Circle', 'Sardarpura Market'], imageUrl: 'https://images.pexels.com/photos/271815/pexels-photo-271815.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/sardarpura_jodhpur_271815', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Shastri Nagar', city: null, cityName: 'Jodhpur', zone: 'South', landmarks: ['Shastri Nagar Market', 'IIT Jodhpur'], imageUrl: 'https://images.pexels.com/photos/271822/pexels-photo-271822.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/shastrinagar_jodhpur_271822', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Basni', city: null, cityName: 'Jodhpur', zone: 'East', landmarks: ['Basni Industrial Area', 'Basni Market'], imageUrl: 'https://images.pexels.com/photos/271821/pexels-photo-271821.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/basni_jodhpur_271821', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Ratanada', city: null, cityName: 'Jodhpur', zone: 'West', landmarks: ['Ratanada Palace', 'Kaylana Lake'], imageUrl: 'https://images.pexels.com/photos/271818/pexels-photo-271818.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/ratanada_jodhpur_271818', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  
  // Mumbai Areas
  { name: 'Andheri', city: null, cityName: 'Mumbai', zone: 'West', landmarks: ['Andheri Railway Station', 'Versova Beach'], imageUrl: 'https://images.pexels.com/photos/1486221/pexels-photo-1486221.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/andheri_mumbai_1486221', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Bandra', city: null, cityName: 'Mumbai', zone: 'North West', landmarks: ['Bandra-Worli Sea Link', 'Bandra Railway Station'], imageUrl: 'https://images.pexels.com/photos/1549247/pexels-photo-1549247.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/bandra_mumbai_1549247', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Dadar', city: null, cityName: 'Mumbai', zone: 'Central', landmarks: ['Dadar Railway Station', 'Shivaji Park'], imageUrl: 'https://images.pexels.com/photos/1486223/pexels-photo-1486223.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/dadar_mumbai_1486223', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Powai', city: null, cityName: 'Mumbai', zone: 'North East', landmarks: ['IIT Bombay', 'Powai Lake'], imageUrl: 'https://images.pexels.com/photos/1549250/pexels-photo-1549250.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/powai_mumbai_1549250', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' },
  { name: 'Goregaon', city: null, cityName: 'Mumbai', zone: 'North', landmarks: ['Goregaon Railway Station', 'Film City'], imageUrl: 'https://images.pexels.com/photos/1549249/pexels-photo-1549249.jpeg?auto=compress&cs=tinysrgb&w=400', imagePublicId: 'roomhy/areas/goregaon_mumbai_1549249', status: 'Active', createdBy: 'superadmin', lastModifiedBy: 'superadmin' }
];

async function seedCitiesAndAreas() {
  try {
    // Clear existing data
    await City.deleteMany({});
    await Area.deleteMany({});
    console.log('Cleared existing cities and areas');

    // Insert cities
    const insertedCities = await City.insertMany(citiesData);
    console.log(`Inserted ${insertedCities.length} cities`);

    // Create city name to ID mapping
    const cityMap = {};
    insertedCities.forEach(city => {
      cityMap[city.name] = city._id;
    });

    // Update areas with city IDs
    const areasWithCityIds = areasData.map(area => ({
      ...area,
      city: cityMap[area.cityName]
    }));

    // Insert areas
    const insertedAreas = await Area.insertMany(areasWithCityIds);
    console.log(`Inserted ${insertedAreas.length} areas`);

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Connect to MongoDB and seed data
const mongoUri = process.env.MONGO_URI || 'mongodb://Harsh:Harsh%402925@ac-8n7qfaj-shard-00-00.hddqr9e.mongodb.net:27017,ac-8n7qfaj-shard-00-01.hddqr9e.mongodb.net:27017,ac-8n7qfaj-shard-00-02.hddqr9e.mongodb.net:27017/roohmy?ssl=true&replicaSet=atlas-xyz-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(mongoUri)
.then(() => {
  console.log('Connected to MongoDB');
  seedCitiesAndAreas();
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
