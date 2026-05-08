const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Property = require('../models/Property');
const ApprovedProperty = require('../models/ApprovedProperty');

async function fixDuplicates() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find all properties
        const allProperties = await Property.find({});
        console.log(`📊 Checking ${allProperties.length} properties...`);

        for (const prop of allProperties) {
            // If visitId is missing or "Unknown", generate a unique one based on ID
            if (!prop.visitId || prop.visitId === 'Unknown' || prop.visitId.trim() === '') {
                const newVisitId = `VIST-${prop.locationCode || 'GEN'}-${prop._id.toString().slice(-6).toUpperCase()}`;
                console.log(`🔧 Fixing visitId for "${prop.propertyName || prop.title}": ${prop.visitId} -> ${newVisitId}`);
                prop.visitId = newVisitId;
                prop.propertyId = newVisitId;
                await prop.save();
            }
        }

        // Now clear ApprovedProperty and re-sync to ensure no duplicates survive
        console.log('🧹 Clearing ApprovedProperty collection for a clean sync...');
        await ApprovedProperty.deleteMany({});

        // Run the sync logic (re-using part of addProperty logic)
        console.log('🔄 Re-syncing all properties to website...');
        const updatedProperties = await Property.find({ status: 'active', isLiveOnWebsite: true });
        
        for (const property of updatedProperties) {
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

            await ApprovedProperty.create(approvedPropertyData);
        }

        console.log(`✨ Done! ${updatedProperties.length} properties are now live and unique.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

fixDuplicates();
