require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/database');
const mongoose = require('mongoose');

const Review = require('../models/Review');
const Property = require('../models/Property');
const User = require('../models/User');

const sampleReviews = [
  {
    rating: 5,
    review: "Amazing property! Clean rooms, great WiFi, and friendly staff. Highly recommended for students near IIT Delhi."
  },
  {
    rating: 4,
    review: "Good value for money. Food quality is decent and location is perfect for students. Minor maintenance issues but overall good."
  },
  {
    rating: 5,
    review: "Best PG in the area! AC rooms, hot water 24/7, and close to metro. Management is very cooperative."
  },
  {
    rating: 3,
    review: "Average experience. Rooms are okay but cleaning could be better. Good for short stays."
  },
  {
    rating: 4,
    review: "Nice place to stay. Gym and study room facilities are great. Food menu could have more variety."
  },
  {
    rating: 5,
    review: "Excellent! Everything is well-maintained. Security is good and staff is helpful. Perfect for students."
  }
];

const seedReviews = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');
    
    // Get all properties
    const properties = await Property.find({ status: 'approved' }).limit(10);
    console.log(`Found ${properties.length} properties`);
    
    if (properties.length === 0) {
      console.log('No properties found. Please seed properties first.');
      process.exit(1);
    }
    
    // Get or create a test user
    let testUser = await User.findOne({ email: 'test@roomhy.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@roomhy.com',
        password: 'test123',
        role: 'user'
      });
      console.log('✅ Created test user');
    }
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('✅ Cleared existing reviews');
    
    // Create reviews for each property
    const reviewsToCreate = [];
    
    properties.forEach((property, propertyIndex) => {
      // Add 2-4 reviews per property
      const numReviews = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numReviews; i++) {
        const sampleReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        const reviewData = {
          propertyId: property._id,
          propertyName: property.propertyName,
          userId: testUser._id,
          name: ['Rahul Kumar', 'Priya Singh', 'Amit Patel', 'Neha Sharma', 'Vikram Rao'][Math.floor(Math.random() * 5)],
          email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
          rating: sampleReview.rating,
          review: sampleReview.review,
          isVerified: true,
          isFeatured: Math.random() > 0.7,
          status: 'Active'
        };
        reviewsToCreate.push(reviewData);
      }
    });
    
    await Review.insertMany(reviewsToCreate);
    console.log(`✅ Created ${reviewsToCreate.length} sample reviews`);
    
    console.log('\n📊 Review Summary:');
    console.log(`- Total properties with reviews: ${properties.length}`);
    console.log(`- Total reviews created: ${reviewsToCreate.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
};

seedReviews();
