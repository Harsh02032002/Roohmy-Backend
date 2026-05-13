const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    await mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0');
    const ApprovedProperty = mongoose.connection.db.collection('approvedproperties');
    const properties = await ApprovedProperty.find({}).toArray();
    
    console.log('Total approved properties:', properties.length);
    properties.forEach(p => {
      console.log(`- ID: ${p.visitId || p._id}, Name: ${p.propertyInfo?.name || p.propertyName || 'N/A'}`);
      console.log(`  Root city: ${p.city || 'N/A'}`);
      console.log(`  Info city: ${p.propertyInfo?.city || 'N/A'}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
