const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const MaintenanceTask = require('./models/MaintenanceTask');
const Complaint = require('./models/Complaint');

const dns = require('dns');
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}
mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    const employees = await Employee.find({ parentLoginId: 'ROOMHY9999' });
    console.log("Employees:", employees.length);
    
    const tasks = await MaintenanceTask.find({ ownerLoginId: 'ROOMHY9999' });
    console.log("MaintenanceTasks:", tasks.length);

    const complaints = await Complaint.find({ ownerLoginId: 'ROOMHY9999' });
    console.log("Complaints:", complaints.length);

    process.exit(0);
  });
