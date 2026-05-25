const mongoose = require('mongoose');
const Enquiry = require('./models/Enquiry');
const BookingRequest = require('./models/BookingRequest');

const dns = require('dns');
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

mongoose.connect('mongodb+srv://Harsh:Harsh%402925@cluster0.hddqr9e.mongodb.net/roohmy?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log("Connected to MongoDB for Leads Seed.");

    const ownerLoginId = "ROOMHY9999";

    // 1. New Enquiries (Enquiry model)
    await Enquiry.create({
        ownerLoginId,
        studentName: 'Amit Singh',
        studentEmail: 'amit@example.com',
        studentPhone: '+919876543001',
        propertyName: 'Roomhy Premium PG - 1',
        interest: 'Single Room',
        budget: '₹8,000',
        status: 'pending',
        source: 'Website',
        notes: 'Looking for a quiet place to study.'
    });

    // 2. Follow Ups
    await Enquiry.create({
        ownerLoginId,
        studentName: 'Priya Sharma',
        studentEmail: 'priya@example.com',
        studentPhone: '+919876543002',
        propertyName: 'Roomhy Premium PG - 2',
        interest: 'Double Sharing',
        budget: '₹6,000',
        status: 'follow-up',
        source: 'Website',
        notes: 'Called yesterday, need to call again on Monday.'
    });

    // 3. Site Visits
    await Enquiry.create({
        ownerLoginId,
        studentName: 'Rahul Dev',
        studentEmail: 'rahul@example.com',
        studentPhone: '+919876543003',
        propertyName: 'Roomhy Premium PG - 1',
        interest: 'Triple Sharing',
        budget: '₹4,500',
        status: 'site-visit',
        source: 'Website',
        notes: 'Scheduled for tomorrow evening.',
        visitTime: '2026-05-26T18:00:00',
        assignedStaff: 'Suresh Kumar'
    });

    // 4. WhatsApp Leads
    await Enquiry.create({
        ownerLoginId,
        studentName: 'Neha Gupta',
        studentPhone: '+919876543004',
        propertyName: 'Roomhy Premium PG - 3',
        interest: 'Any Room',
        budget: '₹5,000',
        status: 'pending',
        source: 'WhatsApp',
        notes: 'Contacted via WhatsApp button.'
    });

    // 5. Booking Requests (Pending)
    await BookingRequest.create({
        owner_id: ownerLoginId,
        user_id: 'USER001',
        name: 'Sandeep Roy',
        email: 'sandeep@example.com',
        phone: '+919876543005',
        property_id: 'some_prop_id',
        property_name: 'Roomhy Premium PG - 1',
        area: 'Koramangala',
        request_type: 'online',
        booking_status: 'pending',
        payment_amount: 1500,
        check_in_date: new Date('2026-06-01')
    });

    // 6. Confirmed Bookings
    await BookingRequest.create({
        owner_id: ownerLoginId,
        user_id: 'USER002',
        name: 'Anjali Verma',
        email: 'anjali@example.com',
        phone: '+919876543006',
        property_id: 'some_prop_id',
        property_name: 'Roomhy Premium PG - 2',
        area: 'Indiranagar',
        request_type: 'online',
        booking_status: 'confirmed',
        payment_amount: 1500,
        check_in_date: new Date('2026-05-28')
    });

    // 7. Cancelled Bookings
    await BookingRequest.create({
        owner_id: ownerLoginId,
        user_id: 'USER003',
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+919876543007',
        property_id: 'some_prop_id',
        property_name: 'Roomhy Premium PG - 1',
        area: 'Koramangala',
        request_type: 'online',
        booking_status: 'cancelled',
        payment_amount: 1500,
        check_in_date: new Date('2026-05-15')
    });

    console.log("Leads & Bookings seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
