const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8']);
dotenv.config({ path: path.join(__dirname, '../.env') });

const Owner = require('../models/Owner');
const Property = require('../models/Property');
const BookingRequest = require('../models/BookingRequest');
const User = require('../models/user');

async function seedBids() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomhy';
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        // 1. Create Test Owner
        const ownerLoginId = "ROOMHY9999";
        const password = "password123";

        await Owner.deleteMany({ loginId: ownerLoginId });
        await Property.deleteMany({ ownerLoginId: ownerLoginId });
        await BookingRequest.deleteMany({ owner_id: ownerLoginId });
        await User.deleteMany({ loginId: ownerLoginId });

        const owner = await Owner.create({
            loginId: ownerLoginId,
            credentials: { password: password, firstTime: false },
            profile: { name: "Test Bid Owner", email: "bidowner@test.com", phone: "9999999999", city: "Bangalore", locationCode: "BLR" },
            isActive: true
        });

        const userForOwner = await User.create({
            loginId: ownerLoginId,
            role: 'owner',
            password: password,
            email: "bidowner@test.com",
            phone: "9999999999",
            name: "Test Bid Owner",
            fullName: "Test Bid Owner",
            isActive: true
        });

        // 2. Create Properties
        const props = [
            { rent: 7000, title: "Prop 7K BLR", city: "Bangalore", locationCode: "BLR" },
            { rent: 8000, title: "Prop 8K BLR", city: "Bangalore", locationCode: "BLR" },
            { rent: 9000, title: "Prop 9K BLR", city: "Bangalore", locationCode: "BLR" },
            { rent: 10000, title: "Prop 10K BLR", city: "Bangalore", locationCode: "BLR" },
            { rent: 11000, title: "Prop 11K BLR", city: "Bangalore", locationCode: "BLR" },
            { rent: 8000, title: "Prop 8K MUM", city: "Mumbai", locationCode: "MUM" }
        ];

        const savedProps = [];
        for (let p of props) {
            const prop = await Property.create({
                title: p.title,
                city: p.city,
                locality: p.city === "Bangalore" ? "Koramangala" : "Bandra",
                locationCode: p.locationCode,
                monthlyRent: p.rent,
                ownerLoginId: ownerLoginId,
                owner: userForOwner._id,
                status: "active",
                isPublished: true
            });
            savedProps.push(prop);
        }

        // 3. Create Bid Requests for the 4 Cases

        // Bidder info
        const userId = "roomhyweb123456";
        const userName = "Test Bidder";
        const userEmail = "bidder@test.com";
        const userPhone = "8888888888";

        await User.deleteMany({ loginId: userId });
        await User.deleteMany({ phone: userPhone });

        const bidderUser = await User.create({
            loginId: userId,
            role: 'tenant',
            password: password,
            email: userEmail,
            phone: userPhone,
            name: userName,
            fullName: userName,
            isActive: true
        });

        // Helper to create bid
        async function createBid(prop, maxPrice, messageCase) {
            await BookingRequest.create({
                property_id: prop._id.toString(),
                property_name: prop.title,
                area: prop.locality || (prop.city === "Bangalore" ? "Koramangala" : "Bandra"),
                rent_amount: prop.monthlyRent,
                user_id: userId,
                name: userName,
                email: userEmail,
                phone: userPhone,
                owner_id: ownerLoginId,
                owner_name: "Test Bid Owner",
                request_type: 'bid',
                bid_amount: maxPrice,
                bid_max: maxPrice,
                whatsapp_enabled: true,
                message: `[${messageCase}] User max price is ${maxPrice}, but property rent is ${prop.monthlyRent}. Gap is within 3000. Let us know if you can negotiate.`,
                status: 'pending'
            });
        }

        // Case 1: Less than (Max Price 7000)
        // User max price 7000. Gap up to 3000 -> so properties 8K, 9K, 10K.
        for (let prop of savedProps) {
            if (prop.city === "Bangalore") {
                if (prop.monthlyRent > 7000 && prop.monthlyRent <= 10000) {
                    await createBid(prop, 7000, "Less Than Case");
                }
            }
        }

        // Case 2: Greater than (e.g. Min budget 8000, Max budget 10000 -> we use Max 10000 for gap logic)
        for (let prop of savedProps) {
            if (prop.city === "Bangalore") {
                if (prop.monthlyRent > 10000 && prop.monthlyRent <= 13000) {
                    await createBid(prop, 10000, "Greater Than Case");
                }
            }
        }

        // Case 3: Range Case (Range 5000 to 7000) - Max price 7000
        for (let prop of savedProps) {
            if (prop.city === "Bangalore") {
                if (prop.monthlyRent === 7000) {
                    await createBid(prop, 7000, "Range Case (Exact Match)");
                } else if (prop.monthlyRent > 7000 && prop.monthlyRent <= 10000) {
                    await createBid(prop, 7000, "Range Case (Within 3000 Negotiation Gap)");
                }
            }
        }

        // Case 4: Location Wise Case (MUM)
        for (let prop of savedProps) {
            if (prop.locationCode === "MUM") {
                // Rent is 8000, max price 6000 (Gap 2000)
                await createBid(prop, 6000, "Location Wise Case (MUM)");
            }
        }

        console.log("=========================================");
        console.log("Seeding complete!");
        console.log("Property Owner ID: ", ownerLoginId);
        console.log("Password:          ", password);
        console.log("=========================================");
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seedBids();
