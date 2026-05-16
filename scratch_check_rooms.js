const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

async function checkRooms() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roomhy');
        const count = await Room.countDocuments();
        console.log("Total rooms in DB:", count);
        
        const rooms = await Room.find().limit(5);
        console.log("Sample rooms:", rooms.map(r => ({ title: r.title, property: r.property })));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkRooms();
