const mongoose = require('mongoose');
const { assignTenant } = require('./controllers/tenantController');
require('dotenv').config();

// Mock req and res
const req = {
    body: {
        name: "Test Harshdeep AI",
        phone: "9464165010",
        email: "harshdeep20020203@gmail.com", 
        propertyId: "661234567890abcdef123456", // Dummy
        roomNo: "AI-101",
        bedNo: "A",
        moveInDate: "2026-06-01",
        agreedRent: "5000",
        dob: "2002-03-02",
        gender: "Female",
        building: "Block A",
        floor: "2nd",
        rentAgreementType: "Standard",
        paymentFrequency: "Monthly",
        additional: {
            emergencyName: "Nisha",
            emergencyPhone: "9876543210",
            relationship: "Friend",
            occupation: "Testing",
            company: "RoomHy"
        }
    }
};

const res = {
    status: (code) => {
        console.log("Response Status:", code);
        return res;
    },
    json: (data) => {
        console.log("Response JSON:", JSON.stringify(data, null, 2));
    }
};

async function testAssignment() {
    try {
        // Connect with long timeout
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("Connected to DB...");
        
        console.log("Calling assignTenant...");
        await assignTenant(req, res);
        
        console.log("Test finished.");
        process.exit(0);
    } catch (err) {
        console.error("Test execution error:", err.message);
        process.exit(1);
    }
}

testAssignment();
