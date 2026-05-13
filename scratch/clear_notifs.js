const mongoose = require('mongoose');
const Notification = require('../models/Notification');
require('dotenv').config();

async function clear() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roomhy');
        const result = await Notification.deleteMany({ toLoginId: 'ROOMHY9999', type: 'user_filter_match' });
        console.log(`Deleted ${result.deletedCount} filter-match notifications for ROOMHY9999`);
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

clear();
