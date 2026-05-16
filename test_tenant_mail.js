const mongoose = require('mongoose');
const { assignTenant } = require('./controllers/tenantController');
require('dotenv').config();

// Mock req and res
const req = {
    body: {
        name: "Test Tenant AI",
        phone: "9876543210",
        email: "helloroomhy@gmail.com", // Sending to your configured email to test
        propertyId: "661234567890abcdef123456", // Dummy but valid format
        roomNo: "Test-101",
        bedNo: "A",
        moveInDate: "2026-06-01",
        agreedRent: "5000",
        dob: "1995-01-01",
        gender: "Male",
        building: "Block A",
        floor: "1st",
        rentAgreementType: "Standard",
        paymentFrequency: "Monthly",
        additional: {
            emergencyName: "Emergency Contact",
            emergencyPhone: "9999999999",
            relationship: "Friend",
            occupation: "Tester",
            company: "AI Lab"
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
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for testing...");
        await assignTenant(req, res);
        console.log("Test execution finished.");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testAssignment();
