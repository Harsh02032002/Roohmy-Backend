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

        // SEED 42 PROPERTIES WITH DIVERSE AMENITIES
        const cities = [
            { name: "Delhi", areas: ["Hauz Khas", "North Campus", "Rohini", "Dwarka", "South Ex"] },
            { name: "Mumbai", areas: ["Andheri West", "Bandra", "Powai", "Juhu", "Worli"] },
            { name: "Bangalore", areas: ["Whitefield", "Koramangala", "Indiranagar", "HSR Layout", "Electronic City"] },
            { name: "Hyderabad", areas: ["HITEC City", "Gachibowli", "Madhapur", "Jubilee Hills", "Banjara Hills"] },
            { name: "Chandigarh", areas: ["Sector 15", "Sector 17", "Sector 35", "Mohali", "Panchkula"] },
            { name: "Pune", areas: ["Viman Nagar", "Hinjewadi", "Kothrud", "Magarpatta", "Baner"] }
        ];

        const types = ["PG", "Hostel", "Apartment", "Co-living"];
        const genders = ["male", "female", "any"];
        const amenityPool = [
            { name: "WiFi", icon: "wifi" },
            { name: "AC", icon: "wind" },
            { name: "Food", icon: "utensils" },
            { name: "Laundry", icon: "droplets" },
            { name: "TV", icon: "tv" },
            { name: "Gym", icon: "dumbbell" },
            { name: "Parking", icon: "car" },
            { name: "Security", icon: "shield" },
            { name: "Power Backup", icon: "zap" },
            { name: "CCTV", icon: "camera" }
        ];

        const imagePool = [
            "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
            "https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg",
            "https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg",
            "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
            "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
            "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg",
            "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
            "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg"
        ];

        const sampleProperties = [];
        for (let i = 1; i <= 42; i++) {
            const cityObj = cities[i % cities.length];
            const area = cityObj.areas[i % cityObj.areas.length];
            const type = types[i % types.length];
            const gender = genders[i % genders.length];
            
            // Randomize amenities (3-6 per property)
            const shuffledAmenities = [...amenityPool].sort(() => 0.5 - Math.random());
            const selectedAmenities = shuffledAmenities.slice(0, 3 + (i % 4));

            // Randomize images (4 per property)
            const shuffledImages = [...imagePool].sort(() => 0.5 - Math.random());
            const propertyImages = shuffledImages.slice(0, 4).map(url => `${url}?auto=compress&cs=tinysrgb&w=600`);

            sampleProperties.push({
                title: `${area} ${type} - ${i}`,
                description: `Premium ${type} in the heart of ${area}, ${cityObj.name}. Features modern amenities and prime location.`,
                address: `${area}, ${cityObj.name}`,
                locationCode: `${cityObj.name.substring(0, 3).toUpperCase()}${100 + i}`,
                latitude: 20 + Math.random() * 10,
                longitude: 70 + Math.random() * 10,
                status: 'active',
                isPublished: true,
                propertyType: type === "Co-living" ? "co-living" : type.toLowerCase(),
                gender: gender,
                monthlyRent: 8000 + (Math.floor(Math.random() * 20) * 500),
                featuredImage: propertyImages[0],
                propertyViews: [
                    { label: "Main", images: [propertyImages[0]] },
                    { label: "Room", images: [propertyImages[1]] },
                    { label: "Interior", images: [propertyImages[2]] },
                    { label: "Building", images: [propertyImages[3]] }
                ],
                amenities: selectedAmenities
            });
        }

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
