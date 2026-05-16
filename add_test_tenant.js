const http = require('http');

const data = JSON.stringify({
  name: "Harsh Test",
  phone: "9999988888",
  email: "harsh20020203@gmail.com",
  propertyId: "65f1a2b3c4d5e6f7a8b9c0d1", // Random ID for fallback
  roomNo: "TEST-101",
  bedNo: "1",
  moveInDate: "2024-05-16",
  agreedRent: "1500",
  securityDepositTotal: "1000",
  securityDepositPaid: "0",
  additional: {
    emergencyName: "Emergency",
    emergencyPhone: "1234567890",
    relationship: "Friend"
  }
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/tenants/assign',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
    process.exit();
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

req.write(data);
req.end();
