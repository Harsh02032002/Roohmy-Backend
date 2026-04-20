const mongoose = require('mongoose');

const ApprovedPropertySchema = new mongoose.Schema({
    visitId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    propertyInfo: {
        name: { type: String, required: true },
        address: { type: String },
        city: { type: String, index: true },
        area: { type: String },
        photos: [{ type: String }],
        ownerGmail: { type: String },
        ownerName: { type: String },
        ownerPhone: { type: String },
        ownerEmail: { type: String },
        rent: { type: Number },
        deposit: { type: String },
        description: { type: String },
        amenities: [{ type: String }],
        genderSuitability: { type: String },
        propertyType: { type: String }
    },
    professionalPhotos: [{ type: String }],
    nearbyColleges: [{ type: String }],
    generatedCredentials: {
        loginId: { type: String },
        tempPassword: { type: String }
    },
    isLiveOnWebsite: {
        type: Boolean,
        default: false,
        index: true
    },
    status: {
        type: String,
        enum: ['approved', 'live', 'offline'],
        default: 'approved',
        index: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    approvedBy: { type: String },
    bannerPhoto: { type: String },
    websiteBannerPhoto: { type: String },
    
    // New fields for enhanced UI
    highlights: [{
        icon: { type: String },
        text: { type: String },
        subtext: { type: String }
    }],
    benefits: [{ type: String }],
    offers: [{ type: String }],
    nearbyPlaces: [{
        name: { type: String },
        type: { type: String }, // e.g., 'college', 'landmark'
        distance: { type: Number },
        lat: { type: Number },
        lng: { type: Number }
    }],
    roomVariants: [{
        name: { type: String },
        image: { type: String },
        size: { type: String },
        price: { type: Number },
        originalPrice: { type: Number },
        discount: { type: Number },
        amenities: [{ type: String }]
    }],
    ratingBreakdown: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 }
    },
    pricingDetails: {
        baseRent: { type: Number },
        discount: { type: Number },
        totalAmount: { type: Number },
        offers: [{
            label: { type: String },
            amount: { type: Number }
        }]
    },
    originalPrice: { type: Number }, // Quick access variable

    // Premium UI Enhancement Fields
    propertyViews: [{
        label: { type: String, required: true },
        images: [{ type: String }],
        description: { type: String }
    }],
    amenities: [{
        name: { type: String, required: true },
        icon: { type: String, default: 'check' },
        category: { type: String, enum: ['basic', 'comfort', 'luxury'], default: 'basic' }
    }],
    exclusiveBenefits: [{
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String, default: 'gift' }
    }],
    facilities: {
        wifi: { type: Boolean, default: false },
        ac: { type: Boolean, default: false },
        food: { type: Boolean, default: false },
        laundry: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        gym: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
        powerBackup: { type: Boolean, default: false }
    },
    latitude: { type: Number },
    longitude: { type: Number },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ApprovedPropertySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('ApprovedProperty', ApprovedPropertySchema);
