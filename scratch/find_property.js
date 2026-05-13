const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    await mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0');
    const ApprovedProperty = mongoose.connection.db.collection('approvedproperties');
    const p = await ApprovedProperty.findOne({ 
      $or: [
        { "propertyInfo.name": /jhv/i },
        { "visitId": "jhvhhjhjv" }
      ]
    });
    if(p) {
      console.log('Found in approvedproperties:');
      console.log(JSON.stringify(p, null, 2));
    } else {
      console.log('Not found in approvedproperties');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
