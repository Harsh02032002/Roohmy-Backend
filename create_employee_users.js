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

const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomhy')
  .then(async () => {
    console.log('Syncing employees and area managers to User collection...');
    
    const defaultStaff = [
      {
        name: 'Kota Area Manager',
        loginId: 'MGR001',
        email: 'manager.kota@roomhy.com',
        phone: '+919876543211',
        password: 'manager@123',
        role: 'areamanager'
      },
      {
        name: 'Delhi Area Manager',
        loginId: 'MGR002',
        email: 'manager.delhi@roomhy.com',
        phone: '+919876543212',
        password: 'manager@123',
        role: 'areamanager'
      },
      {
        name: 'Bangalore Area Manager',
        loginId: 'MGR003',
        email: 'manager.bangalore@roomhy.com',
        phone: '+919876543213',
        password: 'manager@123',
        role: 'areamanager'
      },
      {
        name: 'Marketing Executive',
        loginId: 'EMP001',
        email: 'marketing@roomhy.com',
        phone: '+919876543214',
        password: 'employee@123',
        role: 'employee'
      },
      {
        name: 'Accounts Manager',
        loginId: 'EMP002',
        email: 'accounts@roomhy.com',
        phone: '+919876543215',
        password: 'employee@123',
        role: 'employee'
      },
      {
        name: 'Maintenance Staff',
        loginId: 'EMP003',
        email: 'maintenance@roomhy.com',
        phone: '+919876543216',
        password: 'employee@123',
        role: 'employee'
      },
      {
        name: 'Customer Support',
        loginId: 'EMP004',
        email: 'support@roomhy.com',
        phone: '+919876543217',
        password: 'employee@123',
        role: 'employee'
      }
    ];

    for (const staff of defaultStaff) {
      const existing = await User.findOne({ loginId: staff.loginId });
      if (!existing) {
        await User.create(staff);
        console.log(`Created login User for: ${staff.name} (ID: ${staff.loginId}, Role: ${staff.role})`);
      } else {
        // Update password & role just in case
        existing.password = staff.password;
        existing.role = staff.role;
        existing.name = staff.name;
        existing.email = staff.email;
        existing.phone = staff.phone;
        await existing.save();
        console.log(`Updated existing login User for: ${staff.name} (ID: ${staff.loginId}, Role: ${staff.role})`);
      }
    }
    
    console.log('Staff User Sync Completed Successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error syncing staff users:', err);
    process.exit(1);
  });
