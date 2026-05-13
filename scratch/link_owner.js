const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    await mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to DB');
    
    // Find a property in Indore and link it to ROOMHY9999
    const result = await mongoose.connection.db.collection('websiteproperties').updateOne(
      { propertyName: /jhvhhjhjv/i },
      { $set: { owner_id: 'ROOMHY9999' } }
    );
    
    console.log('Update result:', result);
    
    // Also link a Mumbai property for testing
    const result2 = await mongoose.connection.db.collection('websiteproperties').updateOne(
      { propertyName: /Powai/i },
      { $set: { owner_id: 'ROOMHY9999' } }
    );
    console.log('Update result Mumbai:', result2);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
