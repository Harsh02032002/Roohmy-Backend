require('dotenv').config();
require('dns').setServers(['8.8.8.8']);
const mongoose = require('mongoose');

// Connect using 8.8.8.8 for DNS resolution in this environment
const mongoUriStr = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roomhy';
const MONGODB_URI = mongoUriStr.replace('localhost', '127.0.0.1');
mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB for Staff HR Seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const Employee = require('./models/Employee');
const StaffAttendance = require('./models/StaffAttendance');
const StaffSalary = require('./models/StaffSalary');
const StaffShift = require('./models/StaffShift');

const ownerLoginId = "ROOMHY9999";
const propertyId = "prop_123"; // Using mock property string for assigned property

const seedStaffHR = async () => {
  try {
    console.log('Clearing old staff HR data...');
    await Employee.deleteMany({ parentLoginId: ownerLoginId });
    await StaffAttendance.deleteMany({ ownerLoginId });
    await StaffSalary.deleteMany({ ownerLoginId });
    await StaffShift.deleteMany({ ownerLoginId });

    console.log('Seeding Property Managers and Staff...');
    const staffData = [
      {
        name: "Ramesh Sharma",
        email: "ramesh.sharma@roomhy.com",
        phone: "+91-9876543210",
        role: "Property Manager",
        parentLoginId: ownerLoginId,
        loginId: "MGR_" + Math.floor(1000 + Math.random() * 9000),
        plainPassword: "password123",
        permissions: ["dashboard", "properties", "tenants", "rent", "complaints", "staff"],
        assignedProperty: propertyId,
        status: "active",
        isActive: true
      },
      {
        name: "Suresh Kumar",
        email: "suresh.w@roomhy.com",
        phone: "+91-9876543211",
        role: "Warden",
        parentLoginId: ownerLoginId,
        loginId: "WRD_" + Math.floor(1000 + Math.random() * 9000),
        plainPassword: "password123",
        permissions: ["tenants", "complaints"],
        assignedProperty: propertyId,
        status: "active",
        isActive: true
      },
      {
        name: "Anil Yadav",
        email: "anil.sec@roomhy.com",
        phone: "+91-9876543212",
        role: "Security Guard",
        parentLoginId: ownerLoginId,
        loginId: "SEC_" + Math.floor(1000 + Math.random() * 9000),
        plainPassword: "password123",
        permissions: ["gate"],
        assignedProperty: propertyId,
        status: "active",
        isActive: true
      },
      {
        name: "Sunita Devi",
        email: "sunita.c@roomhy.com",
        phone: "+91-9876543213",
        role: "Housekeeping",
        parentLoginId: ownerLoginId,
        loginId: "HK_" + Math.floor(1000 + Math.random() * 9000),
        plainPassword: "password123",
        permissions: ["complaints"],
        assignedProperty: propertyId,
        status: "active",
        isActive: true
      }
    ];

    const employees = await Employee.insertMany(staffData);
    console.log(`Inserted ${employees.length} staff members.`);

    console.log('Seeding Shift Management...');
    const shiftsData = employees.map((emp, index) => {
      let shiftName = "Day Shift";
      let startTime = "09:00 AM";
      let endTime = "06:00 PM";
      if (emp.role === "Security Guard") {
        shiftName = "Night Shift";
        startTime = "08:00 PM";
        endTime = "06:00 AM";
      } else if (emp.role === "Housekeeping") {
        shiftName = "Morning Shift";
        startTime = "07:00 AM";
        endTime = "03:00 PM";
      }

      return {
        ownerLoginId,
        employeeId: emp._id,
        shiftName,
        startTime,
        endTime,
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      };
    });
    
    await StaffShift.insertMany(shiftsData);
    console.log(`Inserted ${shiftsData.length} shift records.`);

    console.log('Seeding Staff Attendance...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceData = employees.map(emp => {
      const isPresent = Math.random() > 0.2; // 80% chance present
      return {
        ownerLoginId,
        employeeId: emp._id,
        date: today,
        status: isPresent ? "Present" : "Absent",
        checkIn: isPresent ? "09:15 AM" : "--",
        checkOut: isPresent ? "06:00 PM" : "--"
      };
    });

    await StaffAttendance.insertMany(attendanceData);
    console.log(`Inserted ${attendanceData.length} attendance records for today.`);

    console.log('Seeding Staff Salaries...');
    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const salaryData = employees.map(emp => {
      let baseSalary = 15000;
      if (emp.role === "Property Manager") baseSalary = 35000;
      if (emp.role === "Warden") baseSalary = 20000;
      
      const deductions = Math.floor(Math.random() * 500);
      const bonus = Math.floor(Math.random() * 1000);
      
      return {
        ownerLoginId,
        employeeId: emp._id,
        month,
        baseSalary,
        deductions,
        bonus,
        netPay: baseSalary - deductions + bonus,
        status: Math.random() > 0.5 ? "Paid" : "Pending"
      };
    });

    await StaffSalary.insertMany(salaryData);
    console.log(`Inserted ${salaryData.length} salary records for ${month}.`);

    console.log('All HR staff data seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding HR data:', error);
    mongoose.connection.close();
  }
};

seedStaffHR();
