const http = require('http');

http.get('http://localhost:5001/api/employees', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Employees API:', data.substring(0, 500));
  });
});

http.get('http://localhost:5001/api/maintenance/owner/ROOMHY9999', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Maintenance API:', data.substring(0, 500));
  });
});

http.get('http://localhost:5001/api/complaints/owner/ROOMHY9999', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Complaints API:', data.substring(0, 500));
  });
});
