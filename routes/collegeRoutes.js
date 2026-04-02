const express = require('express');
const router = express.Router();
const ApprovedProperty = require('../models/ApprovedProperty');

// College data by city
const collegesByCity = {
  'Kota': [
    'Allen Kota',
    'Resonance Kota',
    'Bansal Classes',
    'Motion Kota',
    'Vidyamandir Classes',
    'Akash Institute'
  ],
  'Indore': [
    'IIT Indore',
    'MITS Indore',
    'Devi Ahilya University',
    'Prestige Institute',
    'Choithram School'
  ],
  'Jaipur': [
    'MNIT Jaipur',
    'Jaipur University',
    'Manipal University',
    'IIT Jodhpur',
    'ICFAI Jaipur'
  ],
  'Delhi': [
    'Delhi University',
    'AIIMS Delhi',
    'IIT Delhi',
    'IIIT Delhi',
    'Delhi Technological University',
    'St. Stephens College'
  ],
  'Bhopal': [
    'Bhopal University',
    'IISER Bhopal',
    'Barkatullah University',
    'IIM Indore'
  ],
  'Nagpur': [
    'VNIT Nagpur',
    'RCOEM Nagpur',
    'Nagpur University',
    'IIT Bombay (Nagpur Campus)'
  ],
  'Mumbai': [
    'IIT Bombay',
    'IIMC Mumbai',
    'Mumbai University',
    'St. Xaviers College',
    'NMIMS Mumbai',
    'AIIMS Mumbai'
  ],
  'Bangalore': [
    'IIT Bangalore',
    'IISC Bangalore',
    'NIT Karnataka',
    'Christ University',
    'Bangalore University',
    'CMIT Bangalore'
  ]
};

// Get colleges by city
router.get('/by-city/:city', (req, res) => {
  try {
    const { city } = req.params;
    const colleges = collegesByCity[city] || [];
    
    res.status(200).json({
      success: true,
      city,
      colleges,
      count: colleges.length
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges',
      error: error.message
    });
  }
});

// Get colleges for a specific property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const property = await ApprovedProperty.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const city = property.propertyInfo?.city;
    const nearbyColleges = property.nearbyColleges || collegesByCity[city] || [];

    res.status(200).json({
      success: true,
      propertyId,
      city,
      nearbyColleges,
      count: nearbyColleges.length
    });
  } catch (error) {
    console.error('Error fetching property colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges',
      error: error.message
    });
  }
});

// Get all available cities with colleges
router.get('/cities/all', (req, res) => {
  try {
    const cities = Object.keys(collegesByCity);
    
    res.status(200).json({
      success: true,
      cities,
      count: cities.length
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
});

module.exports = router;
