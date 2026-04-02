const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, default: 'India' },
        colleges: [{ type: String }], // List of colleges/institutions
        population: { type: Number, default: 0 },
        imageUrl: { type: String, default: null }, // Cloudinary image URL
        imagePublicId: { type: String, default: null }, // Cloudinary public ID for deletion
        status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
        createdBy: { type: String, default: 'superadmin' },
        lastModifiedBy: { type: String, default: 'superadmin' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('City', CitySchema);
