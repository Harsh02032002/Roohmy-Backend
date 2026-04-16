require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const connectDB = require('../config/database');

// Import Models
const User = require('../models/user');
const AreaManager = require('../models/AreaManager');
const Employee = require('../models/Employee');
const Owner = require('../models/Owner');
const Tenant = require('../models/Tenant');

// Seed Data
const seedUsers = async () => {
    try {
        console.log('\n🌱 Starting Database Seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await AreaManager.deleteMany({});
        await Employee.deleteMany({});
        await Owner.deleteMany({});
        await Tenant.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // ==================== SUPERADMIN ====================
        console.log('👑 Creating Superadmin...');
        const superadmin = await User.create({
            name: 'Super Admin',
            email: 'admin@roomhy.com',
            phone: '+919876543210',
            password: 'admin@123',
            role: 'superadmin',
            loginId: 'SUPER_ADMIN',
            isActive: true,
            status: 'active'
        });
        console.log('✅ Superadmin created:', {
            email: 'admin@roomhy.com',
            password: 'admin@123',
            loginId: 'SUPER_ADMIN'
        });

        // ==================== AREA MANAGERS ====================
        console.log('\n📍 Creating Area Managers...');
        const areaManagers = [
            {
                name: 'Kota Area Manager',
                loginId: 'MGR001',
                email: 'manager.kota@roomhy.com',
                phone: '+919876543211',
                password: 'manager@123',
                area: 'Kota',
                areaName: 'Kota',
                areaCode: 'KO',
                city: 'Kota',
                region: 'Rajasthan',
                permissions: ['view_properties', 'manage_tenants', 'view_bookings', 'manage_complaints'],
                isActive: true,
                role: 'areamanager'
            },
            {
                name: 'Delhi Area Manager',
                loginId: 'MGR002',
                email: 'manager.delhi@roomhy.com',
                phone: '+919876543212',
                password: 'manager@123',
                area: 'Delhi',
                areaName: 'Delhi',
                areaCode: 'DL',
                city: 'Delhi',
                region: 'NCR',
                permissions: ['view_properties', 'manage_tenants', 'view_bookings', 'manage_complaints'],
                isActive: true,
                role: 'areamanager'
            },
            {
                name: 'Bangalore Area Manager',
                loginId: 'MGR003',
                email: 'manager.bangalore@roomhy.com',
                phone: '+919876543213',
                password: 'manager@123',
                area: 'Bangalore',
                areaName: 'Bangalore',
                areaCode: 'BLR',
                city: 'Bangalore',
                region: 'Karnataka',
                permissions: ['view_properties', 'manage_tenants', 'view_bookings', 'manage_complaints'],
                isActive: true,
                role: 'areamanager'
            }
        ];

        for (const manager of areaManagers) {
            await AreaManager.create(manager);
            console.log(`✅ Area Manager created: ${manager.name} (${manager.loginId})`);
        }

        // ==================== EMPLOYEES ====================
        console.log('\n👥 Creating Employees...');
        const employees = [
            {
                name: 'Marketing Executive',
                loginId: 'EMP001',
                email: 'marketing@roomhy.com',
                phone: '+919876543214',
                password: 'employee@123',
                role: 'Marketing Team',
                area: 'Kota',
                areaCode: 'KO',
                city: 'Kota',
                permissions: ['view_properties', 'manage_enquiries'],
                isActive: true
            },
            {
                name: 'Accounts Manager',
                loginId: 'EMP002',
                email: 'accounts@roomhy.com',
                phone: '+919876543215',
                password: 'employee@123',
                role: 'Accounts Department',
                area: 'Delhi',
                areaCode: 'DL',
                city: 'Delhi',
                permissions: ['view_payments', 'manage_refunds'],
                isActive: true
            },
            {
                name: 'Maintenance Staff',
                loginId: 'EMP003',
                email: 'maintenance@roomhy.com',
                phone: '+919876543216',
                password: 'employee@123',
                role: 'Maintenance Team',
                area: 'Bangalore',
                areaCode: 'BLR',
                city: 'Bangalore',
                permissions: ['view_complaints', 'manage_maintenance'],
                isActive: true
            },
            {
                name: 'Customer Support',
                loginId: 'EMP004',
                email: 'support@roomhy.com',
                phone: '+919876543217',
                password: 'employee@123',
                role: 'Customer Support',
                area: 'Kota',
                areaCode: 'KO',
                city: 'Kota',
                permissions: ['view_enquiries', 'manage_complaints', 'view_tenants'],
                isActive: true
            }
        ];

        // Hash passwords for employees
        for (const emp of employees) {
            const salt = await bcrypt.genSalt(10);
            emp.password = await bcrypt.hash(emp.password, salt);
            await Employee.create(emp);
            console.log(`✅ Employee created: ${emp.name} (${emp.loginId})`);
        }

        // ==================== PROPERTY OWNERS ====================
        console.log('\n🏠 Creating Property Owners...');
        const owners = [
            {
                loginId: 'OWN001',
                name: 'Rajesh Kumar',
                email: 'owner1@roomhy.com',
                phone: '+919876543220',
                address: '123, MG Road, Kota',
                locationCode: 'KO',
                area: 'Kota',
                credentials: {
                    password: await bcrypt.hash('owner@123', 10),
                    firstTime: false
                },
                profile: {
                    name: 'Rajesh Kumar',
                    email: 'owner1@roomhy.com',
                    phone: '+919876543220',
                    address: '123, MG Road, Kota',
                    locationCode: 'KO',
                    bankName: 'HDFC Bank',
                    accountNumber: '1234567890',
                    ifscCode: 'HDFC0001234',
                    branchName: 'Kota Main Branch'
                },
                kyc: {
                    status: 'verified',
                    aadharNumber: '1234-5678-9012',
                    verifiedAt: new Date()
                },
                isActive: true
            },
            {
                loginId: 'OWN002',
                name: 'Priya Sharma',
                email: 'owner2@roomhy.com',
                phone: '+919876543221',
                address: '456, Connaught Place, Delhi',
                locationCode: 'DL',
                area: 'Delhi',
                credentials: {
                    password: await bcrypt.hash('owner@123', 10),
                    firstTime: false
                },
                profile: {
                    name: 'Priya Sharma',
                    email: 'owner2@roomhy.com',
                    phone: '+919876543221',
                    address: '456, Connaught Place, Delhi',
                    locationCode: 'DL',
                    bankName: 'ICICI Bank',
                    accountNumber: '9876543210',
                    ifscCode: 'ICIC0001234',
                    branchName: 'CP Branch'
                },
                kyc: {
                    status: 'verified',
                    aadharNumber: '9876-5432-1098',
                    verifiedAt: new Date()
                },
                isActive: true
            },
            {
                loginId: 'OWN003',
                name: 'Amit Patel',
                email: 'owner3@roomhy.com',
                phone: '+919876543222',
                address: '789, Koramangala, Bangalore',
                locationCode: 'BLR',
                area: 'Bangalore',
                credentials: {
                    password: await bcrypt.hash('owner@123', 10),
                    firstTime: false
                },
                profile: {
                    name: 'Amit Patel',
                    email: 'owner3@roomhy.com',
                    phone: '+919876543222',
                    address: '789, Koramangala, Bangalore',
                    locationCode: 'BLR',
                    bankName: 'SBI',
                    accountNumber: '5555666677',
                    ifscCode: 'SBIN0001234',
                    branchName: 'Koramangala Branch'
                },
                kyc: {
                    status: 'pending',
                    aadharNumber: '5555-6666-7777'
                },
                isActive: true
            }
        ];

        for (const owner of owners) {
            await Owner.create(owner);
            console.log(`✅ Owner created: ${owner.name} (${owner.loginId})`);
        }

        // ==================== TENANTS ====================
        console.log('\n🏘️  Creating Tenants...');
        
        // Note: Tenants require property reference, so we'll create them without property
        // or you can assign them to properties later
        const tenants = [
            {
                name: 'Rahul Verma',
                phone: '+919876543230',
                email: 'tenant1@roomhy.com',
                dob: '2000-05-15',
                guardianNumber: '+919876543240',
                loginId: 'TNT001',
                tempPassword: 'tenant@123',
                status: 'pending', // Changed to pending since no property assigned
                kycStatus: 'verified',
                kyc: {
                    aadhaarNumber: '1111-2222-3333',
                    aadhaarLinkedPhone: '+919876543230',
                    otpVerified: true,
                    otpVerifiedAt: new Date()
                },
                agreementSigned: false // Changed to false since no property
            },
            {
                name: 'Sneha Gupta',
                phone: '+919876543231',
                email: 'tenant2@roomhy.com',
                dob: '2001-08-20',
                guardianNumber: '+919876543241',
                loginId: 'TNT002',
                tempPassword: 'tenant@123',
                status: 'pending',
                kycStatus: 'submitted',
                kyc: {
                    aadhaarNumber: '4444-5555-6666',
                    aadhaarLinkedPhone: '+919876543231',
                    otpVerified: true,
                    otpVerifiedAt: new Date()
                },
                agreementSigned: false
            },
            {
                name: 'Vikram Singh',
                phone: '+919876543232',
                email: 'tenant3@roomhy.com',
                dob: '1999-12-10',
                guardianNumber: '+919876543242',
                loginId: 'TNT003',
                tempPassword: 'tenant@123',
                status: 'pending',
                kycStatus: 'pending',
                kyc: {
                    aadhaarNumber: '7777-8888-9999',
                    aadhaarLinkedPhone: '+919876543232'
                },
                agreementSigned: false
            }
        ];

        // Create tenants with validation disabled for property field
        for (const tenant of tenants) {
            try {
                // Create tenant without property (will be assigned later by owners)
                const newTenant = new Tenant(tenant);
                // Skip property validation
                await newTenant.save({ validateBeforeSave: false });
                console.log(`✅ Tenant created: ${tenant.name} (${tenant.loginId})`);
            } catch (err) {
                console.log(`⚠️  Skipping tenant ${tenant.name}: ${err.message}`);
            }
        }

        console.log('\n✅ Database seeding completed successfully!\n');
        
        // Print Summary
        console.log('═══════════════════════════════════════════════════════');
        console.log('📋 SEEDED CREDENTIALS SUMMARY');
        console.log('═══════════════════════════════════════════════════════\n');
        
        console.log('👑 SUPERADMIN:');
        console.log('   Email: admin@roomhy.com');
        console.log('   Password: admin@123');
        console.log('   Login URL: /superadmin/index\n');
        
        console.log('📍 AREA MANAGERS:');
        console.log('   LoginID: MGR001 | Password: manager@123 | Area: Kota');
        console.log('   LoginID: MGR002 | Password: manager@123 | Area: Delhi');
        console.log('   LoginID: MGR003 | Password: manager@123 | Area: Bangalore');
        console.log('   Login URL: /employee/index\n');
        
        console.log('👥 EMPLOYEES:');
        console.log('   LoginID: EMP001 | Password: employee@123 | Role: Marketing');
        console.log('   LoginID: EMP002 | Password: employee@123 | Role: Accounts');
        console.log('   LoginID: EMP003 | Password: employee@123 | Role: Maintenance');
        console.log('   LoginID: EMP004 | Password: employee@123 | Role: Support');
        console.log('   Login URL: /employee/index\n');
        
        console.log('🏠 PROPERTY OWNERS:');
        console.log('   LoginID: OWN001 | Password: owner@123 | Name: Rajesh Kumar');
        console.log('   LoginID: OWN002 | Password: owner@123 | Name: Priya Sharma');
        console.log('   LoginID: OWN003 | Password: owner@123 | Name: Amit Patel');
        console.log('   Login URL: /propertyowner/ownerlogin\n');
        
        console.log('🏘️  TENANTS (No property assigned yet):');
        console.log('   LoginID: TNT001 | Password: tenant@123 | Name: Rahul Verma');
        console.log('   LoginID: TNT002 | Password: tenant@123 | Name: Sneha Gupta');
        console.log('   LoginID: TNT003 | Password: tenant@123 | Name: Vikram Singh');
        console.log('   Login URL: /tenant/tenantlogin');
        console.log('   Note: Tenants need to be assigned to properties by owners\n');
        
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Seeding Error:', error);
        throw error;
    }
};

// Run Seeder
const runSeeder = async () => {
    try {
        await connectDB();
        await seedUsers();
        console.log('🎉 All done! Exiting...\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
};

runSeeder();
