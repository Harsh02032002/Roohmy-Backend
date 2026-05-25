require('dotenv').config();
require('dns').setServers(['8.8.8.8']);
const mongoose = require('mongoose');

const mongoUriStr = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roomhy';
const MONGODB_URI = mongoUriStr.replace('localhost', '127.0.0.1');

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB for Property Pics Seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const Property = require('./models/Property');

const seedPropertyPics = async () => {
  try {
    const ownerLoginId = "ROOMHY9999";
    const properties = await Property.find({ ownerLoginId });

    const pics = [
      "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=600"
    ];

    let count = 0;
    for (const [i, p] of properties.entries()) {
      p.image = pics[i % pics.length];
      p.images = [p.image];
      p.rent = p.rent || [2500, 3000, 3500][i % 3]; // Add rent if missing so the discount logic works
      p.pricing = {
        baseRent: p.rent,
        deposit: p.rent * 2,
        maintenanceFee: 500,
        electricityCharge: 10,
        waterCharge: 200,
        additionalCharges: [
           { name: "Cleaning", amount: 200, type: "monthly" }
        ]
      };
      p.totalBeds = p.totalBeds || 10;
      p.occupiedBeds = p.occupiedBeds || Math.floor(Math.random() * 10);
      p.rating = p.rating || (4 + Math.random()).toFixed(1);
      
      // Update amenities to have real text instead of just random
      p.amenities = [
        { name: "WiFi", icon: "Wifi" },
        { name: "Power Backup", icon: "Zap" },
        { name: "RO Water", icon: "Droplets" },
        { name: "First Aid Kit", icon: "Check" }
      ];

      await p.save();
      count++;
    }

    console.log(`Updated ${count} properties with real pictures and metrics.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding property pics:', error);
    mongoose.connection.close();
  }
};

seedPropertyPics();
