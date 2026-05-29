const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');
const dns = require('dns');

// Fix for SRV DNS lookups
const currentServers = dns.getServers();
if (currentServers && currentServers.some(server => server.includes('127.0.0.1') || server.includes('::1'))) {
    console.log('🔄 Switching to Google public DNS for SRV lookups...');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const Tenant = require('../models/Tenant');
const User = require('../models/user');
const Property = require('../models/Property');
const Owner = require('../models/Owner');
const Rent = require('../models/Rent');
const Notification = require('../models/Notification');

async function seed() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('❌ MONGO_URI not found in environment');
        process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000
    });
    console.log('✅ MongoDB Connected');

    try {
        // 1. Resolve or create a property owned by the target owner (ROOMHY9999)
        const targetOwnerId = 'ROOMHY9999';
        let property = await Property.findOne({ ownerLoginId: targetOwnerId, status: 'active' });
        
        if (!property) {
            console.log(`⚠️ No active property found for ${targetOwnerId}, checking any active property...`);
            property = await Property.findOne({ status: 'active' });
            
            if (property) {
                console.log(`📝 Reassigning property ${property.title} to owner ${targetOwnerId}...`);
                property.ownerLoginId = targetOwnerId;
                await property.save();
            }
        }
        
        if (!property) {
            console.log('⚠️ No active property found, creating a mock property and owner...');
            
            // Create owner User
            const ownerUser = await User.create({
                name: 'Mock Owner',
                phone: '9988776655',
                email: 'mockowner@example.com',
                password: 'password123',
                role: 'owner',
                loginId: targetOwnerId,
                locationCode: 'IND',
                status: 'active'
            });

            // Create Owner profile
            await Owner.create({
                loginId: targetOwnerId,
                name: 'Mock Owner',
                phone: '9988776655',
                email: 'mockowner@example.com',
                address: '123 PG Lane',
                locationCode: 'IND',
                credentials: { password: 'password123', firstTime: false },
                kyc: { status: 'verified' },
                checkinUpiId: 'mockowner@upi'
            });

            // Create Property
            property = await Property.create({
                title: 'Premium Test PG',
                address: '123 PG Lane, Indiranagar',
                locationCode: 'IND',
                status: 'active',
                owner: ownerUser._id,
                ownerLoginId: targetOwnerId
            });
        }

        console.log(`🏠 Using Property: ${property.title} (ID: ${property._id})`);

        const ownerLoginId = property.ownerLoginId || targetOwnerId;
        const locationCode = property.locationCode || 'IND';

        // 2. Define move-in dates
        const date10MonthsAgo = new Date();
        date10MonthsAgo.setMonth(date10MonthsAgo.getMonth() - 10);

        const date11MonthsAgo = new Date();
        date11MonthsAgo.setMonth(date11MonthsAgo.getMonth() - 11);

        const date11Months3DaysAgo = new Date();
        date11Months3DaysAgo.setMonth(date11Months3DaysAgo.getMonth() - 11);
        date11Months3DaysAgo.setDate(date11Months3DaysAgo.getDate() - 3);

        console.log(`📅 Move-in Date for 10-Month Tenant: ${date10MonthsAgo.toDateString()}`);
        console.log(`📅 Move-in Date for 11-Month Tenant: ${date11MonthsAgo.toDateString()}`);
        console.log(`📅 Move-in Date for 11-Month & 3-Day Tenant: ${date11Months3DaysAgo.toDateString()}`);

        // 3. Clear existing seeded tenants if any to prevent duplicates
        await Tenant.deleteMany({ loginId: { $in: ['ROOMHYTNT10M', 'ROOMHYTNT11M', 'ROOMHYTNTEX'] } });
        await User.deleteMany({ loginId: { $in: ['ROOMHYTNT10M', 'ROOMHYTNT11M', 'ROOMHYTNTEX'] } });
        await Rent.deleteMany({ tenantLoginId: { $in: ['ROOMHYTNT10M', 'ROOMHYTNT11M', 'ROOMHYTNTEX'] } });

        // 4. Create Users for tenants
        const user10 = await User.create({
            name: 'Rohan TenMonths',
            email: 'rohan10m@example.com',
            phone: '9876501010',
            password: 'password123',
            role: 'tenant',
            loginId: 'ROOMHYTNT10M',
            locationCode,
            status: 'active',
            requirePasswordReset: false
        });

        const user11 = await User.create({
            name: 'Aman ElevenMonths',
            email: 'aman11m@example.com',
            phone: '9876501111',
            password: 'password123',
            role: 'tenant',
            loginId: 'ROOMHYTNT11M',
            locationCode,
            status: 'active',
            requirePasswordReset: false
        });

        const userEx = await User.create({
            name: 'Vikram ExTenant',
            email: 'vikramex@example.com',
            phone: '9876502222',
            password: 'password123',
            role: 'tenant',
            loginId: 'ROOMHYTNTEX',
            locationCode,
            status: 'active',
            requirePasswordReset: false
        });

        // 5. Create Tenants
        const tenant10 = await Tenant.create({
            name: 'Rohan TenMonths',
            phone: '9876501010',
            email: 'rohan10m@example.com',
            dob: '2000-01-01',
            gender: 'Male',
            property: property._id,
            roomNo: 'A-101',
            bedNo: 'A',
            moveInDate: date10MonthsAgo,
            agreedRent: 8500,
            loginId: 'ROOMHYTNT10M',
            tempPassword: 'password123',
            user: user10._id,
            securityDepositTotal: 10000,
            securityDepositPaid: 10000,
            securityDepositBalance: 0,
            ownerLoginId,
            propertyTitle: property.title,
            status: 'active',
            kycStatus: 'verified'
        });

        const tenant11 = await Tenant.create({
            name: 'Aman ElevenMonths',
            phone: '9876501111',
            email: 'aman11m@example.com',
            dob: '1999-05-15',
            gender: 'Male',
            property: property._id,
            roomNo: 'B-102',
            bedNo: 'B',
            moveInDate: date11MonthsAgo,
            agreedRent: 9000,
            loginId: 'ROOMHYTNT11M',
            tempPassword: 'password123',
            user: user11._id,
            securityDepositTotal: 10000,
            securityDepositPaid: 10000,
            securityDepositBalance: 0,
            ownerLoginId,
            propertyTitle: property.title,
            status: 'active',
            kycStatus: 'verified'
        });

        const tenantEx = await Tenant.create({
            name: 'Vikram ExTenant',
            phone: '9876502222',
            email: 'vikramex@example.com',
            dob: '1998-08-20',
            gender: 'Male',
            property: property._id,
            roomNo: 'C-103',
            bedNo: 'C',
            moveInDate: date11Months3DaysAgo,
            agreedRent: 9500,
            loginId: 'ROOMHYTNTEX',
            tempPassword: 'password123',
            user: userEx._id,
            securityDepositTotal: 10000,
            securityDepositPaid: 10000,
            securityDepositBalance: 0,
            ownerLoginId,
            propertyTitle: property.title,
            status: 'inactive',
            kycStatus: 'verified',
            moveoutRequest: {
                status: 'approved',
                requestedDate: new Date(new Date().setDate(new Date().getDate() - 3)), // 3 days ago
                refundStatus: 'cleared',
                duesAtMoveout: 0,
                refundAmount: 10000
            }
        });

        console.log(`✅ Tenant 10 Months Created: ${tenant10.name} (${tenant10.loginId})`);
        console.log(`✅ Tenant 11 Months Created: ${tenant11.name} (${tenant11.loginId})`);
        console.log(`✅ Tenant 11 Months & 3 Days Created: ${tenantEx.name} (${tenantEx.loginId})`);

        // 6. Create Rent records
        await Rent.create({
            propertyName: property.title,
            roomNumber: 'A-101',
            area: property.area || '-',
            tenantName: tenant10.name,
            tenantEmail: tenant10.email,
            tenantPhone: tenant10.phone,
            tenantLoginId: tenant10.loginId,
            rentAmount: tenant10.agreedRent,
            totalDue: tenant10.agreedRent,
            paidAmount: tenant10.agreedRent,
            paymentStatus: 'paid',
            moveInDate: date10MonthsAgo,
            dueDate: date10MonthsAgo,
            createdAt: date10MonthsAgo
        });

        await Rent.create({
            propertyName: property.title,
            roomNumber: 'B-102',
            area: property.area || '-',
            tenantName: tenant11.name,
            tenantEmail: tenant11.email,
            tenantPhone: tenant11.phone,
            tenantLoginId: tenant11.loginId,
            rentAmount: tenant11.agreedRent,
            totalDue: tenant11.agreedRent,
            paidAmount: tenant11.agreedRent,
            paymentStatus: 'paid',
            moveInDate: date11MonthsAgo,
            dueDate: date11MonthsAgo,
            createdAt: date11MonthsAgo
        });

        await Rent.create({
            propertyName: property.title,
            roomNumber: 'C-103',
            area: property.area || '-',
            tenantName: tenantEx.name,
            tenantEmail: tenantEx.email,
            tenantPhone: tenantEx.phone,
            tenantLoginId: tenantEx.loginId,
            rentAmount: tenantEx.agreedRent,
            totalDue: tenantEx.agreedRent,
            paidAmount: tenantEx.agreedRent,
            paymentStatus: 'paid',
            moveInDate: date11Months3DaysAgo,
            dueDate: date11Months3DaysAgo,
            createdAt: date11Months3DaysAgo
        });

        console.log('✅ Initial Rent records created');

        // 7. Create Notification records
        console.log('🔔 Creating notification records...');
        await Notification.deleteMany({ toLoginId: 'ROOMHYTNT10M' });
        await Notification.deleteMany({ toLoginId: 'ROOMHYTNT11M' });
        await Notification.deleteMany({ toLoginId: 'ROOMHYTNTEX' });
        await Notification.deleteMany({ toLoginId: ownerLoginId, from: 'system', type: 'system' });

        // 10-Month Tenant (Expiring in 1 month)
        await Notification.create({
            toLoginId: tenant10.loginId,
            from: 'system',
            type: 'system',
            meta: {
                title: 'Agreement Renewal Upcoming',
                message: 'Your 11-month agreement will expire in 1 month. Please prepare for renewal.'
            },
            read: false
        });
        await Notification.create({
            toLoginId: ownerLoginId,
            from: 'system',
            type: 'system',
            meta: {
                title: 'Tenant Agreement Expiring',
                message: `The 11-month agreement for tenant ${tenant10.name} (10-Month Tester) will expire in 1 month.`
            },
            read: false
        });

        // 11-Month Tenant (Expired)
        await Notification.create({
            toLoginId: tenant11.loginId,
            from: 'system',
            type: 'system',
            meta: {
                title: 'ACTION REQUIRED: Agreement Expired',
                message: 'Your 11-month agreement has expired. You have 3 days to renew your agreement.'
            },
            read: false
        });
        await Notification.create({
            toLoginId: ownerLoginId,
            from: 'system',
            type: 'system',
            meta: {
                title: 'Tenant Agreement Expired',
                message: `The 11-month agreement for tenant ${tenant11.name} (11-Month Tester) has expired. They have 3 days to renew.`
            },
            read: false
        });

        console.log('✅ Notification records created');
        console.log('🎉 Seeding successfully completed!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
