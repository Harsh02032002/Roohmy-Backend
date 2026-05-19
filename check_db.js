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
    
    // Check users collection
    const user = await db.collection('users').findOne({ 
      $or: [
        { email: 'ROOMHY9999' }, 
        { loginId: 'ROOMHY9999' },
        { 'generatedCredentials.loginId': 'ROOMHY9999' }
      ] 
    });
    
    // Check propertyowners collection just in case
    const owner = await db.collection('propertyowners').findOne({
      $or: [
        { loginId: 'ROOMHY9999' },
        { email: 'ROOMHY9999' },
        { 'generatedCredentials.loginId': 'ROOMHY9999' }
      ]
    });

    console.log('User found:', !!user);
    if (user) {
      console.log('User Password:', user.password);
      console.log('User Generated Password:', user.generatedCredentials?.password);
    }
    
    console.log('Owner found:', !!owner);
    if (owner) {
      console.log('Owner Password:', owner.password);
      console.log('Owner Generated Password:', owner.generatedCredentials?.password);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
