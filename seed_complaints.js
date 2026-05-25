const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');
const MaintenanceTask = require('./models/MaintenanceTask');

const dns = require('dns');
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log("Connected to MongoDB for Complaints Seed.");

    const ownerLoginId = "ROOMHY9999";

    // Seed Complaints
    await Complaint.create([
      {
        tenantId: 'tenant1',
        ownerLoginId,
        tenantName: 'Aarav Sharma',
        tenantPhone: '9876543210',
        property: 'Roomhy Premium PG - 1',
        roomNo: '101',
        bedNo: 'A',
        category: 'Plumbing',
        description: 'Leaking tap in the bathroom.',
        priority: 'Medium',
        status: 'Open',
        assignedStaffName: 'Suresh Kumar'
      },
      {
        tenantId: 'tenant2',
        ownerLoginId,
        tenantName: 'Kavya Patel',
        tenantPhone: '9876543211',
        property: 'Roomhy Premium PG - 2',
        roomNo: '102',
        bedNo: 'B',
        category: 'Electrical',
        description: 'Fan is making loud noise.',
        priority: 'High',
        status: 'In Progress',
        assignedStaffName: 'Ramesh Singh'
      },
      {
        tenantId: 'tenant3',
        ownerLoginId,
        tenantName: 'Rohan Gupta',
        tenantPhone: '9876543212',
        property: 'Roomhy Premium PG - 3',
        roomNo: '103',
        bedNo: 'A',
        category: 'Cleaning',
        description: 'Room cleaning missed yesterday.',
        priority: 'Low',
        status: 'Resolved',
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]);
    console.log("Complaints seeded.");

    // Seed Maintenance Tasks
    await MaintenanceTask.create([
      {
        ownerLoginId,
        title: 'Water Tank Cleaning',
        frequency: 'Quarterly',
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        staff: 'Suresh Kumar',
        assignedStaffName: 'Suresh Kumar',
        status: 'Scheduled'
      },
      {
        ownerLoginId,
        title: 'AC Servicing',
        frequency: 'Bi-Annually',
        scheduledDate: new Date().toISOString().split('T')[0],
        staff: 'Ramesh Singh',
        assignedStaffName: 'Ramesh Singh',
        status: 'In Progress'
      },
      {
        ownerLoginId,
        title: 'Pest Control',
        frequency: 'Monthly',
        scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        staff: 'Vendor - XYZ Services',
        status: 'Completed'
      }
    ]);
    console.log("Maintenance Tasks seeded.");

    console.log("Complaints & Maintenance seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
