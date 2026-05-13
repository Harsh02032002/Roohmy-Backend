const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8']);

async function run() {
  try {
    await mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0');
    const ApprovedProperty = mongoose.connection.db.collection('approvedproperties');
    const properties = await ApprovedProperty.find({}).toArray();
    
    console.log('Processing', properties.length, 'properties...');
    
    const cityMap = {
      'MUM': 'Mumbai',
      'BAN': 'Bangalore',
      'HYD': 'Hyderabad',
      'CHA': 'Chandigarh',
      'PUN': 'Pune',
      'DEL': 'Delhi',
      'IND': 'Indore',
      'JAI': 'Jaipur',
      'KOT': 'Kota',
      'BHO': 'Bhopal',
      'NAG': 'Nagpur'
    };

    for (const p of properties) {
      let city = p.propertyInfo?.city;
      
      // If city is "Unknown" or a code, try to derive it from visitId
      if (!city || city === 'Unknown' || city.length <= 6) {
        const visitId = p.visitId || '';
        const prefix = visitId.split('-')[1]?.substring(0, 3).toUpperCase();
        if (cityMap[prefix]) {
          city = cityMap[prefix];
        } else {
          // Try deriving from name
          const name = (p.propertyInfo?.name || '').toLowerCase();
          for (const [code, cityName] of Object.entries(cityMap)) {
            if (name.includes(cityName.toLowerCase())) {
              city = cityName;
              break;
            }
          }
        }
      }

      if (city && city !== p.propertyInfo?.city) {
        console.log(`Updating ${p.visitId}: ${p.propertyInfo?.city} -> ${city}`);
        await ApprovedProperty.updateOne(
          { _id: p._id },
          { $set: { "propertyInfo.city": city } }
        );
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
