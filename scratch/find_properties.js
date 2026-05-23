const mongoose = require('mongoose');
require('dotenv').config();
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomhy';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const properties = await mongoose.connection.db.collection('properties').find({
      $or: [
        { ownerLoginId: 'ROOMHY9999' },
        { owner_id: 'ROOMHY9999' }
      ]
    }).toArray();

    console.log(`Found ${properties.length} properties for ROOMHY9999:`);
    for (const p of properties) {
      console.log(`\nProperty ID: ${p._id}, Title: ${p.title || p.propertyName || p.name}, LocationCode: ${p.locationCode}`);
      // Find rooms for this property
      const rooms = await mongoose.connection.db.collection('rooms').find({
        property: p._id
      }).toArray();
      console.log(`- Found ${rooms.length} rooms:`);
      rooms.forEach(r => {
        console.log(`  Room ID: ${r._id}, Title/No: ${r.title || r.number}, Beds: ${r.beds}, Type: ${r.type}, Price: ${r.price}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
