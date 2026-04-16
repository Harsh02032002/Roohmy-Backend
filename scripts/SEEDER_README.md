# 🌱 Roomhy Database Seeder

Complete database seeding for all user types in Roomhy platform.

## 📦 What Gets Seeded?

- ✅ **1 Superadmin** - Full system access
- ✅ **3 Area Managers** - Kota, Delhi, Bangalore
- ✅ **4 Employees** - Marketing, Accounts, Maintenance, Support
- ✅ **3 Property Owners** - With KYC and bank details
- ✅ **3 Tenants** - With different KYC statuses

---

## 🚀 How to Run Seeder

### Step 1: Navigate to Backend
```bash
cd roomhy-backend
```

### Step 2: Run Seeder
```bash
npm run seed:users
```

### Step 3: Check Output
You'll see a summary of all created users with their credentials.

---

## 🔑 Login Credentials

### 👑 SUPERADMIN
```
URL: http://localhost:5173/superadmin/index
Email: admin@roomhy.com
Password: admin@123
```

### 📍 AREA MANAGERS
```
URL: http://localhost:5173/employee/index

Manager 1:
  LoginID: MGR001
  Password: manager@123
  Area: Kota

Manager 2:
  LoginID: MGR002
  Password: manager@123
  Area: Delhi

Manager 3:
  LoginID: MGR003
  Password: manager@123
  Area: Bangalore
```

### 👥 EMPLOYEES
```
URL: http://localhost:5173/employee/index

Employee 1 (Marketing):
  LoginID: EMP001
  Password: employee@123
  Email: marketing@roomhy.com

Employee 2 (Accounts):
  LoginID: EMP002
  Password: employee@123
  Email: accounts@roomhy.com

Employee 3 (Maintenance):
  LoginID: EMP003
  Password: employee@123
  Email: maintenance@roomhy.com

Employee 4 (Support):
  LoginID: EMP004
  Password: employee@123
  Email: support@roomhy.com
```

### 🏠 PROPERTY OWNERS
```
URL: http://localhost:5173/propertyowner/ownerlogin

Owner 1:
  LoginID: OWN001
  Password: owner@123
  Name: Rajesh Kumar
  Area: Kota

Owner 2:
  LoginID: OWN002
  Password: owner@123
  Name: Priya Sharma
  Area: Delhi

Owner 3:
  LoginID: OWN003
  Password: owner@123
  Name: Amit Patel
  Area: Bangalore
```

### 🏘️ TENANTS
```
URL: http://localhost:5173/tenant/tenantlogin

Tenant 1 (Active):
  LoginID: TNT001
  Password: tenant@123
  Name: Rahul Verma
  Status: Active, KYC Verified

Tenant 2 (KYC Submitted):
  LoginID: TNT002
  Password: tenant@123
  Name: Sneha Gupta
  Status: Active, KYC Submitted

Tenant 3 (Pending):
  LoginID: TNT003
  Password: tenant@123
  Name: Vikram Singh
  Status: Pending, KYC Pending
```

---

## 🎯 Quick Testing

### Test Superadmin Panel
```bash
# Open browser
http://localhost:5173/superadmin/index

# Login with
Email: admin@roomhy.com
Password: admin@123
```

### Test Employee Panel
```bash
# Open browser
http://localhost:5173/employee/index

# Login with
LoginID: MGR001
Password: manager@123
```

### Test Owner Panel
```bash
# Open browser
http://localhost:5173/propertyowner/ownerlogin

# Login with
LoginID: OWN001
Password: owner@123
```

### Test Tenant Panel
```bash
# Open browser
http://localhost:5173/tenant/tenantlogin

# Login with
LoginID: TNT001
Password: tenant@123
```

---

## 🔧 Troubleshooting

### Error: MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Check .env file has correct MONGO_URI
```

### Error: Duplicate Key
```bash
# Clear database first
# Run seeder again
npm run seed:users
```

### Want to Re-seed?
```bash
# Seeder automatically clears old data
# Just run again
npm run seed:users
```

---

## 📝 Notes

- All passwords are hashed using bcrypt
- Superadmin has full system access
- Area Managers can manage their respective areas
- Employees have role-based permissions
- Owners have verified/pending KYC status
- Tenants have different agreement statuses

---

## 🎉 Success!

After seeding, you can login to any panel with the credentials above and test the complete system!

**Happy Testing! 🚀**
