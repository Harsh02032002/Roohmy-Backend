const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/user');
const Property = require('./models/Property');

// Fix for SRV DNS lookups
const ensurePublicDNSForSRV = () => {
  const currentServers = dns.getServers();
  if (currentServers && currentServers.some(server => server.includes('127.0.0.1') || server.includes('::1'))) {
    console.log('🔄 Switching to Google public DNS for SRV lookups...');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
};

async function seedAdmin() {
    try {
        ensurePublicDNSForSRV();
        
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is missing in environment. Seeder aborted.');
        }

        const hasActiveConnection = mongoose.connection && mongoose.connection.readyState === 1;
        if (!hasActiveConnection) {
            const options = {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                family: 4
            };
            await mongoose.connect(mongoUri, options);
            console.log('✅ Seeder: Mongo connected');
        } else {
            console.log('✅ Seeder: Reusing existing mongoose connection');
        }

        // CREATE ADMIN USER
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'roomhyadmin@gmail.com';
        const adminPhone = process.env.SEED_ADMIN_PHONE || '9999999999';
        const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin@123';

        const existing = await User.findOne({ $or: [{ email: adminEmail }, { role: 'superadmin' }] });
        if (existing) {
            console.log('✅ Seeder: superadmin already exists, skipping creation');
        } else {
            const admin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                phone: adminPhone,
                password: adminPassword,
                role: 'superadmin'
            });
            console.log('✅ Seeder: created superadmin:', adminEmail);
        }

        // CREATE OWNER USER
        const ownerEmail = 'owner@roomhy.com';
        let owner = await User.findOne({ email: ownerEmail });
        if (!owner) {
            owner = await User.create({
                name: 'Property Owner',
                email: ownerEmail,
                phone: '8888888888',
                password: 'owner@123',
                role: 'owner'
            });
            console.log('✅ Seeder: created owner:', ownerEmail);
        } else {
            console.log('✅ Seeder: owner already exists');
        }

        // SEED PROPERTIES WITH LAT/LONG
        const sampleProperties = [
            {
                title: "Modern PG - Sector 15, Chandigarh",
                description: "3-BHK PG with WiFi, AC, Laundry near IIT",
                address: "Sector 15, Chandigarh",
                locationCode: "CHD001",
                latitude: 30.7465,
                longitude: 76.7634,
                status: 'active',
                isPublished: true
            },
            {
                title: "Student Hostel - Delhi University",
                description: "Budget friendly accommodation, 5 mins from campus",
                address: "North Campus, Delhi University",
                locationCode: "DEL001",
                latitude: 28.7041,
                longitude: 77.1025,
                status: 'active',
                isPublished: true
            },
            {
                title: "Premium PG - Bangalore Tech Park",
                description: "Fully furnished, Gym, Terrace lounge",
                address: "Whitefield, Bangalore",
                locationCode: "BNG001",
                latitude: 13.0362,
                longitude: 77.6245,
                status: 'active',
                isPublished: true
            },
            {
                title: "Cozy Room - Mumbai Andheri",
                description: "Walking distance to Western Express Highway",
                address: "Andheri East, Mumbai",
                locationCode: "MUM001",
                latitude: 19.1136,
                longitude: 72.8697,
                status: 'active',
                isPublished: true
            },
            {
                title: "Shared Flat - Hyderabad HITEC City",
                description: "Near metro station, all amenities included",
                address: "HITEC City, Hyderabad",
                locationCode: "HYD001",
                latitude: 17.3850,
                longitude: 78.4867,
                status: 'active',
                isPublished: true
            }
        ];

        // Delete existing properties to avoid duplicates
        await Property.deleteMany({});
        console.log('🗑️ Cleared existing properties');

        // Add owner reference and create properties
        for (const prop of sampleProperties) {
            prop.owner = owner._id;
            prop.ownerLoginId = owner.email;
            await Property.create(prop);
            console.log(`✅ Seeded: ${prop.title}`);
        }

        console.log('\n🎉 Seeding completed successfully!');
        console.log(`📍 ${sampleProperties.length} properties added with lat/long`);
        
    } catch (err) {
        console.error('❌ Seeder error:', err.message);
    }
}

if (require.main === module) {
    seedAdmin()
        .finally(async () => {
            try {
                if (mongoose.connection.readyState === 1) {
                    await mongoose.disconnect();
                    console.log('🔌 Database disconnected');
                }
            } catch (e) {
                console.error('Error disconnecting:', e.message);
            }
        });
}

module.exports = seedAdmin;
