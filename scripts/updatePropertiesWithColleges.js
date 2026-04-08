const mongoose = require('mongoose');
const WebsiteProperty = require('../models/WebsiteProperty');

// College data for different cities
const collegeData = {
    'Delhi': {
        nearbyColleges: ['IIT Delhi', 'Delhi University', 'AIIMS Delhi', 'JNU', 'Jamia Millia Islamia'],
        nearbyUniversities: ['IIT Delhi', 'Delhi University', 'JNU', 'Jamia Millia Islamia'],
        nearbyInstitutes: ['AIIMS Delhi', 'NIT Delhi', 'Indian Statistical Institute', 'TERI University'],
        distanceToNearestCollege: 1.5,
        distanceToNearestUniversity: 1.5,
        distanceToNearestInstitute: 2.0
    },
    'Kota': {
        nearbyColleges: ['Allen Career Institute', 'FIITJEE', 'Bansal Classes', 'Resonance', 'Career Point'],
        nearbyUniversities: ['Rajasthan Technical University', 'University of Kota'],
        nearbyInstitutes: ['Allen Career Institute', 'FIITJEE', 'Bansal Classes', 'Resonance'],
        distanceToNearestCollege: 0.5,
        distanceToNearestUniversity: 5.0,
        distanceToNearestInstitute: 0.5
    },
    'Indore': {
        nearbyColleges: ['IIT Indore', 'MITS', 'Devi Ahilya University', 'Medi-Caps University'],
        nearbyUniversities: ['IIT Indore', 'Devi Ahilya University', 'RGPV'],
        nearbyInstitutes: ['IIM Indore', 'MITS', 'Medi-Caps', 'SGSITS'],
        distanceToNearestCollege: 2.0,
        distanceToNearestUniversity: 2.0,
        distanceToNearestInstitute: 3.0
    },
    'Jaipur': {
        nearbyColleges: ['MNIT Jaipur', 'RTU Jaipur', 'Manipal University', 'Jaipur Engineering College'],
        nearbyUniversities: ['RTU Jaipur', 'Manipal University', 'Jaipur National University'],
        nearbyInstitutes: ['MNIT Jaipur', 'IIHM Jaipur', 'Jaipur Engineering College', 'Poornima College'],
        distanceToNearestCollege: 1.8,
        distanceToNearestUniversity: 2.5,
        distanceToNearestInstitute: 1.8
    },
    'Bhopal': {
        nearbyColleges: ['IISER Bhopal', 'Barkatullah University', 'MATS University', 'LNCT Bhopal'],
        nearbyUniversities: ['IISER Bhopal', 'Barkatullah University', 'RGPV Bhopal'],
        nearbyInstitutes: ['IISER Bhopal', 'LNCT Bhopal', 'MATS University', 'Sagar Institute'],
        distanceToNearestCollege: 1.2,
        distanceToNearestUniversity: 2.0,
        distanceToNearestInstitute: 1.5
    },
    'Mumbai': {
        nearbyColleges: ['IIT Bombay', 'NMIMS', 'Mumbai University', 'SP Jain'],
        nearbyUniversities: ['IIT Bombay', 'Mumbai University', 'NMIMS', 'SNDT University'],
        nearbyInstitutes: ['IIT Bombay', 'NMIMS', 'SP Jain', 'Welingkar Institute'],
        distanceToNearestCollege: 1.0,
        distanceToNearestUniversity: 1.0,
        distanceToNearestInstitute: 1.5
    },
    'Bangalore': {
        nearbyColleges: ['IIT Bangalore', 'RV College', 'BMS College', 'Christ College'],
        nearbyUniversities: ['IIT Bangalore', 'VTU', 'Bangalore University', 'Christ University'],
        nearbyInstitutes: ['IIT Bangalore', 'RV College', 'BMS College', 'PES University'],
        distanceToNearestCollege: 1.3,
        distanceToNearestUniversity: 2.0,
        distanceToNearestInstitute: 1.3
    },
    'Pune': {
        nearbyColleges: ['Pune University', 'COEP', 'Symbiosis', 'MIT Pune'],
        nearbyUniversities: ['Pune University', 'Savitribai Phule Pune University', 'Symbiosis International'],
        nearbyInstitutes: ['COEP', 'MIT Pune', 'VIT Pune', 'PICT Pune'],
        distanceToNearestCollege: 1.0,
        distanceToNearestUniversity: 1.5,
        distanceToNearestInstitute: 1.0
    }
};

async function updatePropertiesWithCollegeData() {
    try {
        console.log('🔍 Finding all properties...');
        
        // Find all properties
        const properties = await WebsiteProperty.find({});
        console.log(`Found ${properties.length} properties`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const property of properties) {
            const cityData = collegeData[property.city];
            
            if (cityData) {
                // Update property with college data
                await WebsiteProperty.updateOne(
                    { _id: property._id },
                    { 
                        $set: {
                            nearbyColleges: cityData.nearbyColleges,
                            nearbyUniversities: cityData.nearbyUniversities,
                            nearbyInstitutes: cityData.nearbyInstitutes,
                            distanceToNearestCollege: cityData.distanceToNearestCollege,
                            distanceToNearestUniversity: cityData.distanceToNearestUniversity,
                            distanceToNearestInstitute: cityData.distanceToNearestInstitute
                        }
                    }
                );
                
                console.log(`✅ Updated: ${property.propertyName} (${property.city})`);
                console.log(`   Colleges: ${cityData.nearbyColleges.slice(0, 3).join(', ')}...`);
                updatedCount++;
            } else {
                console.log(`⚠️  No college data for city: ${property.city} - Property: ${property.propertyName}`);
                skippedCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Updated: ${updatedCount} properties`);
        console.log(`   ⚠️  Skipped: ${skippedCount} properties`);
        console.log(`   📋 Total: ${properties.length} properties`);

    } catch (error) {
        console.error('❌ Error updating properties:', error);
    }
}

// Export function to be called from server or run directly
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            updatePropertiesWithCollegeData().then(() => {
                process.exit(0);
            });
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}

module.exports = { updatePropertiesWithCollegeData, collegeData };
