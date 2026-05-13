const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    await mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to DB');
    
    const result = await mongoose.connection.db.collection('approvedproperties').updateOne(
      { _id: new mongoose.Types.ObjectId('69fb10f1a3ee10dbc450e070') },
      { 
        $set: { 
          owner_id: 'ROOMHY9999', 
          ownerLoginId: 'ROOMHY9999', 
          'generatedCredentials.loginId': 'ROOMHY9999' 
        } 
      }
    );
    console.log('Update result:', result);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
