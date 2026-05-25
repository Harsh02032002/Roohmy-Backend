const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const StaffAttendance = require('./models/StaffAttendance');

const dns = require('dns');
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log("Connected to MongoDB for Staff Seed.");

    const ownerLoginId = "ROOMHY9999";

    // 1. Seed Staff
    let emp1 = await Employee.findOne({ loginId: 'EMP_SURESH' });
    if (!emp1) {
        emp1 = await Employee.create({
            name: 'Suresh Kumar',
            loginId: 'EMP_SURESH',
            phone: '+919876543111',
            role: 'Plumber',
            parentLoginId: ownerLoginId,
            isActive: true
        });
    }

    let emp2 = await Employee.findOne({ loginId: 'EMP_RAMESH' });
    if (!emp2) {
        emp2 = await Employee.create({
            name: 'Ramesh Singh',
            loginId: 'EMP_RAMESH',
            phone: '+919876543112',
            role: 'Electrician',
            parentLoginId: ownerLoginId,
            isActive: true
        });
    }

    let emp3 = await Employee.findOne({ loginId: 'EMP_RITA' });
    if (!emp3) {
        emp3 = await Employee.create({
            name: 'Rita Das',
            loginId: 'EMP_RITA',
            phone: '+919876543113',
            role: 'Housekeeping',
            parentLoginId: ownerLoginId,
            isActive: true
        });
    }

    console.log("Employees seeded.");

    // 2. Seed Staff Attendance for today (On Duty for Suresh)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await StaffAttendance.deleteMany({ date: { $gte: today }, ownerLoginId });

    await StaffAttendance.create({
        employeeId: emp1._id,
        ownerLoginId,
        date: today,
        status: 'Present',
        checkIn: '09:00 AM'
    });

    await StaffAttendance.create({
        employeeId: emp2._id,
        ownerLoginId,
        date: today,
        status: 'Present',
        checkIn: '09:30 AM'
    });
    
    // Rita is off duty (no attendance record or Absent)
    await StaffAttendance.create({
        employeeId: emp3._id,
        ownerLoginId,
        date: today,
        status: 'Absent'
    });

    console.log("Staff Attendance seeded.");

    console.log("Staff Seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
