const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');
const WebsiteProperty = require('../models/WebsiteProperty');

// High-quality Pexels images for properties - 4 images per property type
const propertyImages = {
    pg: [
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    hostel: [
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2029719/pexels-photo-2029719.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    flat: [
        'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271660/pexels-photo-271660.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2459/pexels-photo-2459.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
};

// Seed data with 4 images per property
const seedWebsiteProperties = async () => {
    try {
        await connectDB();
        await WebsiteProperty.deleteMany({});
        console.log('Cleared existing website properties');

        const properties = [
            {
                visitId: 'RM001',
                propertyName: 'Royal Stays PG',
                propertyType: 'PG',
                city: 'Kota',
                area: 'Mahaveer Nagar',
                gender: 'Male',
                ownerName: 'Ramesh Sharma',
                contactPhone: '+91-9876543210',
                monthlyRent: 4500,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM002',
                propertyName: 'Girls Paradise Hostel',
                propertyType: 'Hostel',
                city: 'Kota',
                area: 'Rajeev Gandhi Nagar',
                gender: 'Female',
                ownerName: 'Sunita Gupta',
                contactPhone: '+91-9876543211',
                monthlyRent: 6500,
                professionalPhotos: propertyImages.hostel,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM003',
                propertyName: 'Elite Student Living',
                propertyType: 'PG',
                city: 'Kota',
                area: 'Dadabari',
                gender: 'Co-ed',
                ownerName: 'Vikram Patel',
                contactPhone: '+91-9876543212',
                monthlyRent: 5500,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM004',
                propertyName: 'Dream Home PG',
                propertyType: 'PG',
                city: 'Indore',
                area: 'Vijay Nagar',
                gender: 'Male',
                ownerName: 'Amit Khanna',
                contactPhone: '+91-9876543213',
                monthlyRent: 5000,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM005',
                propertyName: 'Comfort Zone Girls Hostel',
                propertyType: 'Hostel',
                city: 'Indore',
                area: 'Bhawarkua',
                gender: 'Female',
                ownerName: 'Priya Verma',
                contactPhone: '+91-9876543214',
                monthlyRent: 7200,
                professionalPhotos: propertyImages.hostel,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM006',
                propertyName: 'Urban Living PG',
                propertyType: 'PG',
                city: 'Indore',
                area: 'Palasia',
                gender: 'Co-ed',
                ownerName: 'Rajesh Malhotra',
                contactPhone: '+91-9876543215',
                monthlyRent: 4800,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM007',
                propertyName: 'Pink City Residency',
                propertyType: 'PG',
                city: 'Jaipur',
                area: 'Malviya Nagar',
                gender: 'Male',
                ownerName: 'Suresh Yadav',
                contactPhone: '+91-9876543216',
                monthlyRent: 4200,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM008',
                propertyName: 'Heritage Girls Hostel',
                propertyType: 'Hostel',
                city: 'Jaipur',
                area: 'Tonk Road',
                gender: 'Female',
                ownerName: 'Anita Rajput',
                contactPhone: '+91-9876543217',
                monthlyRent: 6800,
                professionalPhotos: propertyImages.hostel,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM009',
                propertyName: 'Capital Heights PG',
                propertyType: 'PG',
                city: 'Delhi',
                area: 'Kamla Nagar',
                gender: 'Male',
                ownerName: 'Mohit Singh',
                contactPhone: '+91-9876543218',
                monthlyRent: 8500,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM010',
                propertyName: 'Metro Living Hostel',
                propertyType: 'Hostel',
                city: 'Delhi',
                area: 'Kalkaji',
                gender: 'Female',
                ownerName: 'Deepa Sharma',
                contactPhone: '+91-9876543219',
                monthlyRent: 9200,
                professionalPhotos: propertyImages.hostel,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM011',
                propertyName: 'Marvel Apartments',
                propertyType: 'Flat',
                city: 'Mumbai',
                area: 'Andheri West',
                gender: 'Co-ed',
                ownerName: 'Karan Mehta',
                contactPhone: '+91-9876543220',
                monthlyRent: 15000,
                professionalPhotos: propertyImages.flat,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM012',
                propertyName: 'Student Nest PG',
                propertyType: 'PG',
                city: 'Bhopal',
                area: 'MP Nagar',
                gender: 'Male',
                ownerName: 'Alok Tiwari',
                contactPhone: '+91-9876543221',
                monthlyRent: 3800,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM013',
                propertyName: 'Lakeview Girls Hostel',
                propertyType: 'Hostel',
                city: 'Bhopal',
                area: 'Arera Colony',
                gender: 'Female',
                ownerName: 'Rekha Agrawal',
                contactPhone: '+91-9876543222',
                monthlyRent: 5800,
                professionalPhotos: propertyImages.hostel,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM014',
                propertyName: 'Study Hub PG',
                propertyType: 'PG',
                city: 'Kota',
                area: 'Indra Vihar',
                gender: 'Male',
                ownerName: 'Nitin Gupta',
                contactPhone: '+91-9876543223',
                monthlyRent: 4200,
                professionalPhotos: propertyImages.pg,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            },
            {
                visitId: 'RM015',
                propertyName: 'Premium Stay Hostel',
                propertyType: 'Hostel',
                city: 'Jaipur',
                area: 'Sitapura',
                gender: 'Female',
                ownerName: 'Neha Jain',
                contactPhone: '+91-9876543224',
                monthlyRent: 7500,
                professionalPhotos: propertyImages.hostel,
                fieldPhotos: [],
                isLiveOnWebsite: true,
                status: 'online'
            }
        ];

        const inserted = await WebsiteProperty.insertMany(properties);
        console.log(`Seeded ${inserted.length} website properties with 4 images each`);

        const online = await WebsiteProperty.countDocuments({ isLiveOnWebsite: true });
        console.log(`Online properties: ${online}`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

connectDB().then(() => {
    seedWebsiteProperties();
});