const fetch = require('node-fetch');

async function testApi() {
  try {
    const response = await fetch('http://localhost:5001/api/approved-properties/public/approved');
    const data = await response.json();
    
    console.log('🔍 Testing API Response...');
    console.log('Total properties:', data.properties.length);
    
    // Check first property
    const firstProperty = data.properties[0];
    console.log('\n📋 First Property:');
    console.log('  _id:', firstProperty._id);
    console.log('  property_name:', firstProperty.property_name);
    console.log('  photos count:', firstProperty.photos?.length || 0);
    console.log('  images count:', firstProperty.images?.length || 0);
    console.log('  propertyViews count:', firstProperty.propertyViews?.length || 0);
    
    // Check if images field exists and has data
    if (firstProperty.images && firstProperty.images.length > 0) {
      console.log('  ✅ images field exists with data');
      console.log('  First image:', firstProperty.images[0]);
    } else {
      console.log('  ❌ images field missing or empty');
    }
    
    // Check second property
    const secondProperty = data.properties[1];
    console.log('\n📋 Second Property:');
    console.log('  _id:', secondProperty._id);
    console.log('  property_name:', secondProperty.property_name);
    console.log('  photos count:', secondProperty.photos?.length || 0);
    console.log('  images count:', secondProperty.images?.length || 0);
    
    if (secondProperty.images && secondProperty.images.length > 0) {
      console.log('  ✅ images field exists with data');
      console.log('  First image:', secondProperty.images[0]);
    } else {
      console.log('  ❌ images field missing or empty');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    process.exit(1);
  }
}

testApi();
