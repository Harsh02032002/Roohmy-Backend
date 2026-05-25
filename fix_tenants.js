const mongoose = require('mongoose');
const Tenant = require('./models/Tenant');
const Room = require('./models/Room');
const ElectricityMeter = require('./models/ElectricityMeter');
const Rent = require('./models/Rent');

const dns = require('dns');
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log("Connected to MongoDB.");

    let tenants = await Tenant.find({ name: 'Aarav Sharma', property: { $exists: true, $ne: null } });
    console.log(`Found ${tenants.length} tenants named Aarav Sharma with valid property.`);

    for (let tenant of tenants) {
      // Find a valid room for this tenant's property
      let room = await Room.findOne({ property: tenant.property });
      if (!room) {
         room = await Room.findOne(); // Fallback to any room if property mismatch
      }

      if (room) {
        tenant.room = room._id;
        tenant.roomNo = room.title || room.roomNo || "101";
        tenant.bedNo = "1";
        
        // Ensure Electricity Meter exists for this room
        let meter = await ElectricityMeter.findOne({ room: room._id });
        if (!meter) {
            await ElectricityMeter.create({
                room: room._id,
                property: room.property,
                tenant: tenant._id,
                roomNo: tenant.roomNo || "101",
                billingMonth: "2026-05",
                readings: []
            });
            console.log(`Created new ElectricityMeter for Room ${room.title}`);
        } else {
            meter.tenant = tenant._id;
            await meter.save();
        }
      }

      // Add missing personal details
      tenant.dob = tenant.dob || "15 Aug 1998";
      tenant.gender = tenant.gender || "Male";
      tenant.guardianNumber = tenant.guardianNumber || "9876543211";
      tenant.occupation = tenant.occupation || "Software Engineer";
      
      // Fix agreement pending issue
      tenant.agreementSigned = true;
      tenant.agreementSignedAt = new Date();
      if (!tenant.digitalCheckin) tenant.digitalCheckin = {};
      tenant.digitalCheckin.agreement = {
          eSignName: tenant.name,
          acceptedAt: new Date()
      };
      
      tenant.status = 'active';
      tenant.kycStatus = 'verified';

      // Create rent document if it doesn't exist
      const existingRent = await Rent.findOne({ tenantId: tenant._id });
      if (!existingRent) {
         await Rent.create({
            propertyId: tenant.property,
            tenantId: tenant._id,
            tenantName: tenant.name,
            roomNumber: tenant.roomNo,
            rentAmount: tenant.agreedRent || 7500,
            totalDue: tenant.agreedRent || 7500,
            paidAmount: 0,
            paymentStatus: 'pending'
         });
         console.log(`Created Rent document for ${tenant.name}`);
      }

      await tenant.save();
      console.log(`Updated Tenant: ${tenant.name} -> Assigned to Room: ${tenant.roomNo}, Agreement: Signed`);
    }

    console.log("All tenants updated successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
