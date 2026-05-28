const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dotenv.config();

const ensurePublicDNSForSRV = () => {
  const currentServers = dns.getServers();
  if (currentServers && currentServers.some(server => server.includes('127.0.0.1') || server.includes('::1'))) {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
};
ensurePublicDNSForSRV();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomhy')
  .then(async () => {
    const db = mongoose.connection.db;
    
    console.log('--- ALL EMPLOYEES ---');
    const employees = await db.collection('employees').find({}).toArray();
    employees.forEach(emp => {
      console.log(`Name: ${emp.name}, LoginID: ${emp.loginId}, Role: ${emp.role}, Password: ${emp.password || emp.tempPassword || 'No password field'}`);
    });
    
    console.log('\n--- ALL USERS ---');
    const users = await db.collection('users').find({}).toArray();
    users.forEach(usr => {
      console.log(`Name: ${usr.name}, LoginID: ${usr.loginId || usr.email}, Role: ${usr.role}, Password: ${usr.password}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
