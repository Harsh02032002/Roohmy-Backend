require('dotenv').config();
const connectDB = require('./config/database');
const Property = require('./models/Property');

async function checkProperties() {
  try {
    await connectDB();
    const properties = await Property.find({});
    console.log('Total Properties:', properties.length);
    
    const activeProperties = properties.filter(p => p.status === 'active' && p.isPublished === true);
    console.log('Active & Published Properties:', activeProperties.length);
    
    const liveProperties = properties.filter(p => p.isLiveOnWebsite === true);
    console.log('Live on Website Properties:', liveProperties.length);
    
    console.log('\nFirst 5 Properties:');
    properties.slice(0, 5).forEach(p => {
      console.log(`- ${p.title}: status=${p.status}, published=${p.isPublished}, live=${p.isLiveOnWebsite}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProperties();
