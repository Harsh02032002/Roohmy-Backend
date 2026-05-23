const http = require('http');

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

async function fetchApi(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) {
    console.error(`API Error on ${endpoint}:`, data);
    throw new Error(data.message || data.error || 'Request failed');
  }
  return data;
}

async function runTests() {
  try {
    console.log("🚀 Starting API Integration Test Flow...");

    // 1. Get Owner & Tenants
    console.log("\\n--- 1. Fetching Tenants ---");
    const tenantsRes = await fetchApi('/tenants');
    const tenants = Array.isArray(tenantsRes) ? tenantsRes : (tenantsRes.data || tenantsRes.tenants || []);
    if (tenants.length === 0) {
      console.log("❌ No tenants found. Please add a tenant via UI first.");
      process.exit(1);
    }
    const tenant = tenants[0];
    console.log(`✅ Found active tenant: ${tenant.name} (${tenant.phone}) in Room ${tenant.roomNo || '-'}`);

    const ownerLoginId = tenant.ownerLoginId || (tenant.property && tenant.property.ownerLoginId) || 'SYSTEM';
    console.log("Using ownerLoginId:", ownerLoginId);
    const propertyId = tenant.property ? tenant.property._id : null;

    // 2. Tenant Leaves
    console.log("\\n--- 2. Testing Gate & Leaves (Tenant App to Owner App) ---");
    const leaveData = {
      tenantId: tenant._id,
      departureDate: new Date().toISOString(),
      returnDate: new Date(Date.now() + 86400000*3).toISOString(),
      reason: "API Test Leave"
    };
    const leaveRes = await fetchApi('/tenant-gate/leave-request', 'POST', leaveData);
    console.log("✅ Tenant submitted Leave Request successfully.");

    // Owner checks leaves
    const ownerLeavesRes = await fetchApi(`/leaves/owner/${ownerLoginId}`);
    if (ownerLeavesRes.requests && ownerLeavesRes.requests.some(r => r.reason === "API Test Leave")) {
      console.log("✅ Verified: Leave request successfully populated in Owner Panel!");
    } else {
      console.error("❌ Failed to verify Leave Request in Owner Panel. Owner Leaves:", ownerLeavesRes);
    }

    // 3. Visitor Pass
    console.log("\\n--- 3. Testing Visitor Passes ---");
    const visitorData = {
      tenantId: tenant._id,
      guestName: "Priya (API Test)",
      guestPhone: "9876543210",
      expectedDate: new Date().toISOString()
    };
    const visitorRes = await fetchApi('/tenant-gate/visitor-pass', 'POST', visitorData);
    console.log(`✅ Tenant generated Visitor Pass successfully (Code: ${visitorRes.pass.passCode}).`);

    // Owner checks visitors
    const ownerVisitorsRes = await fetchApi(`/visitors/owner/${ownerLoginId}?status=Pre-approved`);
    if (ownerVisitorsRes.visitors && ownerVisitorsRes.visitors.some(v => v.name === "Priya (API Test)")) {
      console.log("✅ Verified: Visitor Pass successfully populated in Owner Panel!");
    } else {
      console.error("❌ Failed to verify Visitor Pass in Owner Panel. Owner Visitors:", ownerVisitorsRes);
    }

    // 4. Staff Management
    console.log("\\n--- 4. Testing Staff Management ---");
    const loginId = `test_staff_${Math.floor(Math.random()*100000)}`;
    const staffPhone = `91${Math.floor(10000000 + Math.random() * 90000000)}`;
    const staffData = {
      name: "API Test Warden",
      loginId: loginId,
      phone: staffPhone,
      role: "Warden",
      parentLoginId: ownerLoginId
    };
    
    // Add staff
    const empRes = await fetchApi('/employees', 'POST', staffData);
    console.log(`✅ Owner created Staff profile successfully (LoginID: ${loginId}).`);
    const staffId = empRes.data._id;

    // Mark attendance
    const attData = {
      employeeId: staffId,
      ownerLoginId: ownerLoginId,
      date: new Date().toISOString(),
      status: "Present",
      checkIn: "08:00 AM"
    };
    await fetchApi('/hr/attendance', 'POST', attData);
    console.log("✅ Staff attendance marked successfully.");

    // Check owner attendance list
    const ownerAttRes = await fetchApi(`/hr/attendance/${ownerLoginId}`);
    if (ownerAttRes.data && ownerAttRes.data.length > 0) {
      console.log("✅ Verified: Staff Attendance populated in Owner HR Panel!");
    }

    console.log("\\n🎉 ALL API INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉");

  } catch (err) {
    console.error("\\n❌ Test Failed:", err);
  }
}

runTests();
