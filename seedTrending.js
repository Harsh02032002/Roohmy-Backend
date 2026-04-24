const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
dotenv.config({ path: path.join(__dirname, '.env') });

// Fix for SRV DNS lookups
const ensurePublicDNSForSRV = () => {
  const currentServers = dns.getServers();
  if (currentServers && currentServers.some(server => server.includes('127.0.0.1') || server.includes('::1'))) {
    console.log('🔄 Switching to Google public DNS for SRV lookups...');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
};

const ApprovedProperty = require('./models/ApprovedProperty');
const Property = require('./models/Property');
const WebsiteProperty = require('./models/WebsiteProperty');
const User = require('./models/user');

const trendingProperties = [
    {
        visitId: 'TREND-001',
        name: 'Sunrise Luxury PG',
        location: 'Talwandi, Kota',
        city: 'Kota',
        price: 8500,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'pg',
        gender: 'male',
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Gym'],
        description: 'Premium luxury PG with all modern amenities located in the heart of Kota coaching hub.'
    },
    {
        visitId: 'TREND-002',
        name: 'Elite Student Hostel',
        location: 'Vijay Nagar, Indore',
        city: 'Indore',
        price: 6200,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'hostel',
        gender: 'female',
        amenities: ['WiFi', 'Security', 'Food', 'Power Backup'],
        description: 'Safe and secure hostel for girls with home-like food and 24/7 security.'
    },
    {
        visitId: 'TREND-003',
        name: 'Urban Co-living Space',
        location: 'Malviya Nagar, Jaipur',
        city: 'Jaipur',
        price: 12000,
        rating: 4.9,
        image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'co-living',
        gender: 'any',
        amenities: ['WiFi', 'AC', 'Gaming Room', 'Terrace Cafe'],
        description: 'Modern co-living space designed for the new-age student and working professional.'
    },
    {
        visitId: 'TREND-004',
        name: 'Campus View Residency',
        location: 'North Campus, Delhi',
        city: 'Delhi',
        price: 9500,
        rating: 4.7,
        image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'pg',
        gender: 'any',
        amenities: ['WiFi', 'Library', 'Food', 'AC'],
        description: 'Located right next to North Campus, offering the best student life experience.'
    },
    {
        visitId: 'TREND-005',
        name: 'Royal Palms PG',
        location: 'Andheri West, Mumbai',
        city: 'Mumbai',
        price: 15000,
        rating: 4.5,
        image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'pg',
        gender: 'female',
        amenities: ['WiFi', 'AC', 'Security', 'Attached Washroom'],
        description: 'Luxurious stay in Mumbai with premium facilities and proximity to major colleges.'
    },
    {
        visitId: 'TREND-006',
        name: 'Smart Stay PG',
        location: 'MP Nagar, Bhopal',
        city: 'Bhopal',
        price: 5800,
        rating: 4.4,
        image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'pg',
        gender: 'male',
        amenities: ['WiFi', 'Food', 'Parking'],
        description: 'Affordable and smart living for students in Bhopal.'
    },
    {
        visitId: 'TREND-007',
        name: 'Grand Heritage Hostel',
        location: 'Civil Lines, Nagpur',
        city: 'Nagpur',
        price: 4800,
        rating: 4.3,
        image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'hostel',
        gender: 'any',
        amenities: ['WiFi', 'Large Rooms', 'Garden'],
        description: 'Spacious rooms with a heritage feel and modern amenities.'
    },
    {
        visitId: 'TREND-008',
        name: 'City Hub PG',
        location: 'Paota, Jodhpur',
        city: 'Jodhpur',
        price: 6500,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'pg',
        gender: 'any',
        amenities: ['WiFi', 'AC', 'Food'],
        description: 'Centrally located PG with easy access to transportation and markets.'
    }
];

async function seedTrending() {
    try {
        ensurePublicDNSForSRV();
        const mongoUri = process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Get or create a default owner
        let owner = await User.findOne({ role: 'owner' });
        if (!owner) {
            owner = await User.create({
                name: 'Default Owner',
                email: 'owner@roomhy.com',
                phone: '9999999999',
                password: 'password123',
                role: 'owner'
            });
        }

        // Clean up existing trending properties
        const visitIds = trendingProperties.map(p => p.visitId);
        await ApprovedProperty.deleteMany({ visitId: { $in: visitIds } });
        await Property.deleteMany({ locationCode: { $in: visitIds } });
        await WebsiteProperty.deleteMany({ visitId: { $in: visitIds } });

        for (const prop of trendingProperties) {
            const propertyViews = [
                { label: "Main", images: [prop.image], description: "Main View" },
                { label: "Room", images: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800'], description: "Room View" },
                { label: "Common Area", images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800'], description: "Common Area" }
            ];

            // Create Approved Property
            await ApprovedProperty.create({
                visitId: prop.visitId,
                propertyInfo: {
                    name: prop.name,
                    address: `${prop.location}, ${prop.city}`,
                    city: prop.city,
                    area: prop.location.split(',')[0],
                    photos: propertyViews.flatMap(v => v.images),
                    ownerName: owner.name,
                    ownerPhone: owner.phone,
                    rent: prop.price,
                    description: prop.description,
                    genderSuitability: prop.gender,
                    propertyType: prop.type
                },
                propertyViews: propertyViews,
                amenities: prop.amenities.map(a => ({ name: a, icon: 'check', category: 'basic' })),
                isLiveOnWebsite: true,
                status: 'live',
                approvedBy: 'superadmin',
                ratingBreakdown: { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
            });

            console.log(`✅ Seeded: ${prop.name}`);
        }

        console.log('🎉 Trending properties seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedTrending();
