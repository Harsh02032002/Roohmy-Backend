const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    await mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to DB');
    
    // Update any collection that might hold this property
    const collections = ['approvedproperties', 'websiteproperties', 'properties'];
    for(const col of collections) {
      const field = col === 'websiteproperties' ? 'propertyName' : 'name';
      const result = await mongoose.connection.db.collection(col).updateMany(
        { [field]: /jhv/i },
        { $set: { owner_id: 'ROOMHY9999' } }
      );
      console.log(`Update result for ${col}:`, result);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
