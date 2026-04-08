const mongoose = require('mongoose');
const WebsiteProperty = require('../models/WebsiteProperty');

// Sample property with nearby colleges/universities/institutes
const sampleProperty = {
    visitId: 'PROP-COLLEGE-001',
    propertyName: 'Scholars Hostel - Near IIT Delhi',
    propertyType: 'PG',
    city: 'Delhi',
    area: 'Hauz Khas',
    gender: 'Male',
    ownerName: 'Rajesh Kumar',
    contactPhone: '9876543210',
    monthlyRent: 12000,
    professionalPhotos: [
        'https://res.cloudinary.com/dpwgvcibj/image/upload/v1768990260/roomhy/properties/hostel1.jpg',
        'https://res.cloudinary.com/dpwgvcibj/image/upload/v1768990260/roomhy/properties/hostel2.jpg'
    ],
    fieldPhotos: [
        'https://res.cloudinary.com/dpwgvcibj/image/upload/v1768990260/roomhy/properties/field1.jpg'
    ],
    // College/University/Institute information
    nearbyColleges: [
        'IIT Delhi',
        'Delhi University - South Campus',
        'AIIMS Delhi',
        'JNU Delhi'
    ],
    nearbyUniversities: [
        'IIT Delhi',
        'Delhi University',
        'JNU',
        'Jamia Millia Islamia'
    ],
    nearbyInstitutes: [
        'AIIMS Delhi',
        'National Institute of Technology Delhi',
        'Indian Statistical Institute Delhi',
        'TERI University'
    ],
    // Distance information
    distanceToNearestCollege: 1.2, // IIT Delhi - 1.2 km
    distanceToNearestUniversity: 1.2, // IIT Delhi - 1.2 km
    distanceToNearestInstitute: 2.5, // AIIMS Delhi - 2.5 km
    isLiveOnWebsite: true,
    status: 'online'
};

async function createSampleProperty() {
    try {
        // Connect to MongoDB (assuming connection is already established)
        
        // Check if property already exists
        const existingProperty = await WebsiteProperty.findOne({ visitId: sampleProperty.visitId });
        if (existingProperty) {
            console.log('Property already exists:', existingProperty.propertyName);
            return;
        }

        // Create new property
        const newProperty = new WebsiteProperty(sampleProperty);
        await newProperty.save();
        
        console.log('✅ Sample property created successfully!');
        console.log('Property Name:', newProperty.propertyName);
        console.log('City:', newProperty.city);
        console.log('Nearby Colleges:', newProperty.nearbyColleges.join(', '));
        console.log('Nearby Universities:', newProperty.nearbyUniversities.join(', '));
        console.log('Nearby Institutes:', newProperty.nearbyInstitutes.join(', '));
        console.log('Distance to IIT Delhi:', newProperty.distanceToNearestCollege, 'km');
        
    } catch (error) {
        console.error('❌ Error creating sample property:', error);
    }
}

// Export function to be called from server or run directly
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            createSampleProperty().then(() => {
                process.exit(0);
            });
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}

module.exports = { createSampleProperty, sampleProperty };
