const http = require('http');

const data = JSON.stringify({
  name: "Demo Staff",
  loginId: "STAFF_DEMO",
  phone: "9998887776",
  password: "password123",
  role: "Warden",
  parentLoginId: "TESTOWNER"
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/employees',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
