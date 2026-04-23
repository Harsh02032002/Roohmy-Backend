const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  locationCode: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerLoginId: { type: String },
  status: { type: String, enum: ['inactive','active','blocked'], default: 'inactive' },
  isPublished: { type: Boolean, default: false },
  isLiveOnWebsite: { type: Boolean, default: false },
  
  // Amenities - Array of amenity objects with icon and name
  amenities: [{
    name: { type: String, required: true },
    icon: { type: String, default: 'check' }, // icon name from lucide
    category: { type: String, enum: ['basic', 'comfort', 'luxury'], default: 'basic' }
  }],
  
  // Exclusive Direct Benefits - Array of benefit strings
  exclusiveBenefits: [{
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String, default: 'gift' }
  }],
  
  // Property Views/Gallery - Like OYO (Facade, Room, Kitchen, etc.)
  propertyViews: [{
    label: { type: String, required: true }, // e.g., "Facade", "Room", "Kitchen", "Lobby"
    images: [{ type: String }], // Array of image URLs for this view
    description: { type: String }
  }],
  
  // Main gallery images (legacy support)
  images: [{ type: String }],
  
  // Featured image
  featuredImage: { type: String },
  
  // Property details
  propertyType: { type: String, enum: ['pg', 'hostel', 'co-living', 'apartment'], default: 'pg' },
  gender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  monthlyRent: { type: Number, default: 0 },
  
  // Room details
  totalRooms: { type: Number, default: 0 },
  bedsPerRoom: { type: Number, default: 1 },
  
  // Facilities (boolean flags for quick filtering)
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
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt on save
PropertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
