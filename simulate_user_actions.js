const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const BookingRequest = require('./models/BookingRequest');
const Complaint = require('./models/Complaint');

const userId = "69fa4bde724fe20c7d0532ec";
const propertyId = "69eb612e8b7178e0352aee6f";
const ownerId = "69e683191209f648e3ab2318";
const email = "harshdeep20020203@gmail.com";
const name = "Harshdeep Kaur";

async function simulate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear previous test complaints for this user
    await Complaint.deleteMany({ tenantId: userId });
    console.log("Cleared old test complaints");

    // 1. Create Tenant Complaint
    await Complaint.create({
      tenantId: userId,
      type: 'Tenant',
      tenantName: name,
      tenantPhone: "9464165010",
      property: "Bandra Hostel - 1",
      roomNo: "302",
      bedNo: "A",
      category: "Plumbing",
      description: "Tap is leaking in the bathroom.",
      priority: "Medium",
      status: "Open"
    });
    console.log("Tenant complaint created");

    // 2. Create Owner Complaint
    await Complaint.create({
      tenantId: userId, // Using userId as identifier
      type: 'Owner',
      tenantName: name, // Using user name for identification
      tenantPhone: "9464165010",
      property: "Bandra Hostel - 1",
      roomNo: "N/A",
      bedNo: "N/A",
      category: "Other",
      description: "Monthly maintenance fee dispute.",
      priority: "High",
      status: "In Progress"
    });
    console.log("Owner complaint created");

    console.log("Simulation updated with Complaints!");
    process.exit(0);
  } catch (err) {
    console.error("Simulation failed:", err);
    process.exit(1);
  }
}

simulate();
