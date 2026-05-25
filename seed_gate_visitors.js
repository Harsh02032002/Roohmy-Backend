require('dotenv').config();
require('dns').setServers(['8.8.8.8']);
const mongoose = require('mongoose');

const mongoUriStr = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roomhy';
const MONGODB_URI = mongoUriStr.replace('localhost', '127.0.0.1');

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB for Gate/Visitors Seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const TenantAttendance = require('./models/TenantAttendance');
const TenantLeaveRequest = require('./models/TenantLeaveRequest');
const VisitorLog = require('./models/VisitorLog');
const Gate = require('./models/Gate');

const ownerLoginId = "ROOMHY9999";

const seedGateAndVisitors = async () => {
  try {
    console.log('Clearing old gate & visitor data...');
    await Gate.deleteMany({ ownerLoginId });
    await VisitorLog.deleteMany({ ownerLoginId });
    await TenantLeaveRequest.deleteMany({ ownerLoginId });
    await TenantAttendance.deleteMany({ ownerLoginId });

    console.log('Seeding Gates...');
    const gatesData = [
      { ownerLoginId, name: "Main Entrance Gate", type: "Biometric & RFID", status: "Unlocked" },
      { ownerLoginId, name: "Basement Parking Gate", type: "RFID & Boom Barrier", status: "Locked" }
    ];
    await Gate.insertMany(gatesData);
    console.log(`Inserted ${gatesData.length} gates.`);

    console.log('Seeding Visitor Logs (Entry/Exit/Passes)...');
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const visitorsData = [
      // Pre-approved pass
      { ownerLoginId, name: "Rajesh Kumar", phone: "9876543210", hostName: "Amit Sharma", hostRoom: "101", purpose: "Parent Visit", status: "Pre-approved", entryTime: now },
      // Inside (Entry Log)
      { ownerLoginId, name: "Swiggy Delivery", phone: "9876543211", hostName: "Rohan Das", hostRoom: "102", purpose: "Food Delivery", status: "Inside", entryTime: new Date(now.getTime() - 15 * 60 * 1000) },
      // Exited (Exit Log)
      { ownerLoginId, name: "Suresh Plumber", phone: "9876543212", hostName: "Property Manager", hostRoom: "Admin", purpose: "Maintenance", status: "Exited", entryTime: twoHoursAgo, exitTime: new Date(twoHoursAgo.getTime() + 45 * 60 * 1000) }
    ];
    await VisitorLog.insertMany(visitorsData);
    console.log(`Inserted ${visitorsData.length} visitor logs.`);

    console.log('Seeding Leave Requests...');
    const leavesData = [
      { ownerLoginId, tenantId: new mongoose.Types.ObjectId(), tenantName: "Amit Sharma", roomNo: "101", fromDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), toDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), reason: "Going home for Diwali", status: "Pending" },
      { ownerLoginId, tenantId: new mongoose.Types.ObjectId(), tenantName: "Rohan Das", roomNo: "102", fromDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), toDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), reason: "Medical Leave", status: "Approved" }
    ];
    await TenantLeaveRequest.insertMany(leavesData);
    console.log(`Inserted ${leavesData.length} leave requests.`);

    console.log('Seeding Tenant Attendance...');
    const attendanceData = [
      { ownerLoginId, tenantId: new mongoose.Types.ObjectId(), tenantName: "Amit Sharma", roomNo: "101", status: "Inside", lastScanTime: new Date(now.getTime() - 10 * 60 * 60 * 1000) },
      { ownerLoginId, tenantId: new mongoose.Types.ObjectId(), tenantName: "Rohan Das", roomNo: "102", status: "Outside", lastScanTime: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
    ];
    await TenantAttendance.insertMany(attendanceData);
    console.log(`Inserted ${attendanceData.length} tenant attendance records.`);

    console.log('All Gate and Visitor data seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedGateAndVisitors();
