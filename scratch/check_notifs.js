const mongoose = require('mongoose');
const Notification = require('../models/Notification');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roomhy');
        const notifs = await Notification.find({ toLoginId: 'ROOMHY9999' }).sort({ createdAt: -1 });
        console.log('Notifications for ROOMHY9999:');
        console.log(JSON.stringify(notifs, null, 2));
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

check();
