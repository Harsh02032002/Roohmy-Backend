const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// DNS Fix for MongoDB Atlas SRV lookups
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Property = require('../models/Property');
const ApprovedProperty = require('../models/ApprovedProperty');

async function syncAllToLive() {
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const properties = await Property.find({});
        console.log(`📊 Found ${properties.length} properties to update...`);

        let updatedCount = 0;
        for (const property of properties) {
            // 1. Update Master Property
            property.isLiveOnWebsite = true;
            property.status = 'active';
            property.isPublished = true;
            await property.save();

            // 2. Prepare ApprovedProperty data
            const vId = property.visitId || property._id.toString();
            const approvedPropertyData = {
                visitId: vId,
                propertyId: property.propertyId || property._id.toString(),
                enquiry_id: property.enquiry_id || property._id.toString(),
                images: property.images || [],
                featuredImage: property.featuredImage || (property.images && property.images[0]) || "",
                propertyInfo: {
                    name: property.title || property.propertyName || 'Property',
                    city: property.city || 'Unknown',
                    area: property.locality || 'Unknown',
                    address: property.address || '',
                    rent: property.monthlyRent || 0,
                    propertyType: property.propertyType || 'pg',
                    genderSuitability: property.gender || 'any',
                    amenities: property.amenities?.map(a => typeof a === 'string' ? a : a.name) || [],
                    photos: property.images || [],
                    latitude: property.latitude,
                    longitude: property.longitude,
                    description: property.description || ''
                },
                amenities: property.amenities || [],
                propertyViews: property.propertyViews || [],
                facilities: property.facilities || {},
                exclusiveBenefits: property.exclusiveBenefits || [],
                latitude: property.latitude,
                longitude: property.longitude,
                generatedCredentials: {
                    ownerName: property.ownerName || 'Verified Owner',
                    loginId: property.ownerLoginId || ''
                },
                isLiveOnWebsite: true,
                status: 'live',
                updatedAt: new Date(),
                approvedBy: 'superadmin',
                approvedAt: new Date()
            };

            // 3. Upsert to ApprovedProperty
            await ApprovedProperty.findOneAndUpdate(
                { 
                  $or: [
                    { visitId: vId },
                    { propertyId: property.propertyId || "" },
                    { 'generatedCredentials.loginId': property.ownerLoginId || "" }
                  ] 
                },
                approvedPropertyData,
                { upsert: true, new: true }
            );
            
            updatedCount++;
            if (updatedCount % 5 === 0) console.log(`✅ Progress: ${updatedCount}/${properties.length}`);
        }

        console.log(`\n✨ Successfully synced ${updatedCount} properties to Live Website!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Sync Error:', err);
        process.exit(1);
    }
}

syncAllToLive();
