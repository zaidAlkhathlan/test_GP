#!/usr/bin/env node

// Test supplier API endpoints
const API_BASE = 'http://localhost:8080/api';

async function testSupplierAPI() {
  console.log('🧪 Testing Supplier API endpoints...');
  
  try {
    // Test GET /suppliers
    console.log('\n📋 Testing GET /suppliers...');
    const response = await fetch(`${API_BASE}/suppliers`);
    
    if (response.ok) {
      const suppliers = await response.json();
      console.log('✅ GET /suppliers successful');
      console.log(`📊 Found ${suppliers.length} suppliers`);
      
      if (suppliers.length > 0) {
        console.log('📄 Sample supplier:', JSON.stringify(suppliers[0], null, 2));
        
        // Test GET specific supplier
        const supplierId = suppliers[0].ID;
        console.log(`\n🔍 Testing GET /suppliers/${supplierId}...`);
        
        const supplierResponse = await fetch(`${API_BASE}/suppliers/${supplierId}`);
        if (supplierResponse.ok) {
          const supplier = await supplierResponse.json();
          console.log('✅ GET specific supplier successful');
          console.log('📄 Supplier details:', JSON.stringify(supplier, null, 2));
        } else {
          console.log('❌ GET specific supplier failed:', supplierResponse.statusText);
        }
      }
    } else {
      console.log('❌ GET /suppliers failed:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupplierAPI();
}