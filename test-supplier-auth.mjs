#!/usr/bin/env node

// Test supplier authentication with migrated data
const API_BASE = 'http://localhost:8080/api'; // Using port 8080

async function testSupplierAuth() {
  console.log('🧪 Testing Supplier Authentication...');
  
  const testCredentials = {
    account_email: 'ahmed.supplier@techsolutions.com',
    account_password: 'password123'
  };

  try {
    console.log('\n🔐 Testing supplier login...');
    console.log('📧 Email:', testCredentials.account_email);
    
    const response = await fetch(`${API_BASE}/auth/supplier/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials),
    });

    console.log('📊 Response status:', response.status);
    
    const data = await response.json();
    console.log('📄 Response data:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('✅ Authentication successful!');
      console.log('👤 Supplier info:');
      console.log('  - ID:', data.supplier.id);
      console.log('  - Company:', data.supplier.company_name);
      console.log('  - Name:', data.supplier.account_name);
      console.log('  - Email:', data.supplier.account_email);
      console.log('  - City:', data.supplier.city);
      console.log('  - Domain:', data.supplier.domain);
      console.log('  - Registration:', data.supplier.commercial_registration_number);
      
      // Test with wrong password
      console.log('\n🔐 Testing with wrong password...');
      const wrongPasswordResponse = await fetch(`${API_BASE}/auth/supplier/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_email: testCredentials.account_email,
          account_password: 'wrong_password'
        }),
      });
      
      const wrongData = await response.json();
      
      if (wrongPasswordResponse.status === 401) {
        console.log('✅ Wrong password correctly rejected');
      } else {
        console.log('❌ Wrong password should have been rejected');
      }
      
    } else {
      console.log('❌ Authentication failed:', data.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupplierAuth();
}