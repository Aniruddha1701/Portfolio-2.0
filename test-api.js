// Test script for admin dashboard API endpoints
// Run with: node test-api.js

const testAPIs = async () => {
  const baseURL = 'http://localhost:9002';
  
  console.log('🧪 Testing Admin Dashboard APIs...\n');
  
  // Test 1: Public portfolio endpoint
  console.log('1. Testing GET /api/portfolio (public)...');
  try {
    const res = await fetch(`${baseURL}/api/portfolio`);
    console.log(`   Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`   ✅ Portfolio loaded: ${data.personalInfo?.name || 'No name set'}`);
    } else {
      console.log(`   ⚠️  No portfolio found (${res.status})`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n2. Testing authentication required endpoints...');
  
  // Test 2: PUT /api/portfolio (requires auth)
  console.log('   Testing PUT /api/portfolio...');
  try {
    const res = await fetch(`${baseURL}/api/portfolio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });
    console.log(`   Status: ${res.status}`);
    if (res.status === 401) {
      console.log(`   ✅ Correctly requires authentication`);
    } else {
      console.log(`   ⚠️  Unexpected status: ${res.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // Test 3: Check admin routes redirect
  console.log('\n3. Testing admin route protection...');
  try {
    const res = await fetch(`${baseURL}/admin/dashboard`, {
      redirect: 'manual'
    });
    console.log(`   Status: ${res.status}`);
    if (res.status === 307 || res.status === 308) {
      console.log(`   ✅ Correctly redirects to login when not authenticated`);
    } else {
      console.log(`   Status: ${res.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // Test 4: Check uploads directory
  console.log('\n4. Testing upload endpoints exist...');
  const uploadEndpoints = [
    '/api/resume/upload',
    '/api/resume/download',
    '/api/upload/logo'
  ];
  
  for (const endpoint of uploadEndpoints) {
    try {
      const res = await fetch(`${baseURL}${endpoint}`, {
        method: endpoint.includes('download') ? 'GET' : 'POST'
      });
      console.log(`   ${endpoint}: Status ${res.status}`);
    } catch (error) {
      console.log(`   ${endpoint}: ❌ ${error.message}`);
    }
  }
  
  // Test 5: Check static assets
  console.log('\n5. Testing static assets...');
  const assets = [
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/manifest.json'
  ];
  
  for (const asset of assets) {
    try {
      const res = await fetch(`${baseURL}${asset}`);
      console.log(`   ${asset}: ${res.ok ? '✅ Found' : `❌ Not found (${res.status})`}`);
    } catch (error) {
      console.log(`   ${asset}: ❌ ${error.message}`);
    }
  }
  
  console.log('\n✨ API Testing Complete!');
  console.log('\nNote: To test authenticated endpoints, you need to:');
  console.log('1. Login through the UI at /admin/login');
  console.log('2. Use the browser DevTools to test authenticated requests');
  console.log('3. Or use the cookies from a logged-in session');
};

// Run tests
testAPIs().catch(console.error);
