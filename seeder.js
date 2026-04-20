const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/user');
const Property = require('./models/Property');
const WebsiteProperty = require('./models/WebsiteProperty');
const ApprovedProperty = require('./models/ApprovedProperty');

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
                description: "3-BHK PG with WiFi, AC, Laundry near Punjab University. Home-like food and 24/7 security.",
                address: "Sector 15, Chandigarh",
                locationCode: "CHD001",
                latitude: 30.7465,
                longitude: 76.7634,
                status: 'active',
                isPublished: true,
                propertyType: 'pg',
                gender: 'male',
                monthlyRent: 8500,
                featuredImage: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600",
                propertyViews: [
                    { label: "Facade", images: ["https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "Premium Building Exterior" },
                    { label: "Reception", images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "24/7 Security Desk" },
                    { label: "Bedroom", images: ["https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "Spacious Boys Bedroom" }
                ]
            },
            {
                title: "Student Hostel - Delhi University",
                description: "Budget friendly accommodation, 5 mins from North Campus. Perfect for DU students.",
                address: "North Campus, Delhi University",
                locationCode: "DEL001",
                latitude: 28.7041,
                longitude: 77.1025,
                status: 'active',
                isPublished: true,
                propertyType: 'hostel',
                gender: 'female',
                monthlyRent: 12000,
                featuredImage: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
                propertyViews: [
                    { label: "Facade", images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"] },
                    { label: "Reception", images: ["https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=600"] },
                    { label: "Kitchen", images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600"] }
                ]
            },
            {
                title: "Premium PG - Tech Park",
                description: "Fully furnished with Gym and Terrace lounge. Top choice for IT professionals.",
                address: "Whitefield, Bangalore",
                locationCode: "BNG001",
                latitude: 13.0362,
                longitude: 77.6245,
                status: 'active',
                isPublished: true,
                propertyType: 'pg',
                gender: 'any',
                monthlyRent: 18000,
                featuredImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
                propertyViews: [
                    { label: "Facade", images: ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"] },
                    { label: "Lobby", images: ["https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600"] },
                    { label: "Bedroom", images: ["https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600"] }
                ]
            },
            {
                title: "Cozy Room - Andheri West",
                description: "Walking distance to Metro, fully secured and clean environment.",
                address: "Andheri East, Mumbai",
                locationCode: "MUM001",
                latitude: 19.1136,
                longitude: 72.8697,
                status: 'active',
                isPublished: true,
                propertyType: 'pg',
                gender: 'female',
                monthlyRent: 22000,
                featuredImage: "https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg?auto=compress&cs=tinysrgb&w=600",
                propertyViews: [
                    { label: "Facade", images: ["https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg?auto=compress&cs=tinysrgb&w=600"] }
                ]
            },
            {
                title: "Shared Flat - HITEC City",
                description: "Near major IT offices, all amenities including laundry and cook.",
                address: "HITEC City, Hyderabad",
                locationCode: "HYD001",
                latitude: 17.3850,
                longitude: 78.4867,
                status: 'active',
                isPublished: true,
                propertyType: 'apartment',
                gender: 'any',
                monthlyRent: 15000,
                featuredImage: "https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=600",
                propertyViews: [
                    { label: "Living Area", images: ["https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=600"] }
                ]
            },
            {
                title: "IIT Delhi View PG",
                description: "Premium PG located right next to IIT Delhi. All inclusive luxurious stay for students and scholars.",
                address: "Hauz Khas, Delhi",
                locationCode: "DELHI-PG-002",
                latitude: 28.5397,
                longitude: 77.1957,
                status: 'active',
                isPublished: true,
                propertyType: 'pg',
                gender: 'male',
                monthlyRent: 14000,
                featuredImage: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600",
                propertyViews: [
                    { label: "Facade", images: ["https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "Premium Building Exterior" },
                    { label: "Reception", images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "Modern Reception" },
                    { label: "Bedroom", images: ["https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "Spacious Student Room" },
                    { label: "Kitchen", images: ["https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600"], description: "Fully Loaded Kitchen" }
                ],
                amenities: [
                    { name: "WiFi", icon: "wifi", category: "basic" },
                    { name: "AC", icon: "wind", category: "comfort" },
                    { name: "Food", icon: "coffee", category: "basic" }
                ]
            }
        ];

        // Delete existing properties to avoid duplicates
        await Property.deleteMany({});
        await WebsiteProperty.deleteMany({});
        await ApprovedProperty.deleteMany({});
        console.log('🗑️ Cleared existing properties, website listings, and approvals');

        // Add owner reference and create properties
        for (const prop of sampleProperties) {
            prop.owner = owner._id;
            prop.ownerLoginId = owner.email;
            
            // Create main property
            const createdProp = await Property.create(prop);
            console.log(`✅ Seeded (Main DB): ${prop.title}`);

            const targetVisitId = prop.locationCode === "DELHI-PG-002" ? "DELHI-PG-002" : `VIST-${createdProp.locationCode}-${Math.floor(Math.random() * 1000)}`;

            // Create website property (curated list)
            await WebsiteProperty.create({
                visitId: targetVisitId,
                propertyName: prop.title,
                propertyType: prop.propertyType,
                city: prop.address.split(',').pop().trim(),
                area: prop.address.split(',')[0].trim(),
                gender: prop.gender,
                ownerName: owner.name,
                contactPhone: owner.phone,
                monthlyRent: prop.monthlyRent,
                professionalPhotos: prop.propertyViews?.flatMap(v => v.images) || [],
                images: prop.propertyViews?.flatMap(v => v.images) || [],
                featuredImage: prop.featuredImage,
                propertyViews: prop.propertyViews,
                latitude: prop.latitude,
                longitude: prop.longitude,
                address: prop.address,
                isLiveOnWebsite: true,
                status: 'online'
            });

            // Create Approved Property (This is what the website ACTUALLY uses)
            await ApprovedProperty.create({
                visitId: targetVisitId,
                propertyInfo: {
                    name: prop.title,
                    address: prop.address,
                    city: prop.address.split(',').pop().trim(),
                    area: prop.address.split(',')[0].trim(),
                    photos: prop.propertyViews?.flatMap(v => v.images) || [],
                    ownerName: owner.name,
                    ownerPhone: owner.phone,
                    rent: prop.monthlyRent,
                    description: prop.description,
                    genderSuitability: prop.gender,
                    propertyType: prop.propertyType
                },
                propertyViews: prop.propertyViews,
                amenities: prop.amenities || [
                    { name: "WiFi", icon: "wifi", category: "basic" },
                    { name: "AC", icon: "wind", category: "comfort" }
                ],
                isLiveOnWebsite: true,
                status: 'live',
                approvedBy: 'superadmin',
                latitude: prop.latitude,
                longitude: prop.longitude
            });

            console.log(`✅ Seeded (Website & Approval): ${prop.title} with visitId: ${targetVisitId}`);
        }

        console.log('\n🎉 Seeding completed successfully!');
        console.log(`📍 ${sampleProperties.length} properties added to all 3 collections (Main, WebsiteList, Approved)`);
        
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
