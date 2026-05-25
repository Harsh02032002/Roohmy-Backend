const mongoose = require('mongoose');
const Tenant = require('./models/Tenant');

const dns = require('dns');
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log("Connected to MongoDB for Move-out Seed.");

    // Find Kavya Patel
    let tenant1 = await Tenant.findOne({ name: 'Kavya Patel' });
    if (tenant1) {
        tenant1.moveoutRequest = {
            status: 'pending',
            requestedDate: new Date('2026-06-01'),
            reason: 'Relocating to another city for a new job.',
            submittedAt: new Date(),
            refundStatus: 'pending',
            duesAtMoveout: 0,
            refundAmount: 0
        };
        await tenant1.save();
        console.log("Created pending move-out request for Kavya Patel.");
    }

    // Find Rohan Gupta
    let tenant2 = await Tenant.findOne({ name: 'Rohan Gupta' });
    if (tenant2) {
        tenant2.moveoutRequest = {
            status: 'approved',
            requestedDate: new Date('2026-05-30'),
            reason: 'College completed.',
            submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            refundStatus: 'pending',
            duesAtMoveout: 500,
            refundAmount: 7000
        };
        // Update status to inactive since it's approved, wait maybe it should still show up?
        // Let's leave tenant status as active or inactive based on what the UI expects for 'approved'
        await tenant2.save();
        console.log("Created approved move-out request for Rohan Gupta.");
    }

    console.log("Move-out seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
