#!/usr/bin/env node

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testTenderStatusSystem() {
  try {
    console.log('🧪 Testing Tender Status System...\n');

    // Test 1: Get tenders with status
    console.log('1. Testing GET /api/tenders (should include status)...');
    const tendersResponse = await fetch('http://localhost:8080/api/tenders');
    
    if (!tendersResponse.ok) {
      console.log('❌ Failed to fetch tenders:', tendersResponse.status);
      return;
    }
    
    const tendersData = await tendersResponse.json();
    console.log('✅ Tenders fetched successfully');
    console.log(`   Total tenders: ${tendersData.tenders?.length || 0}`);
    
    if (tendersData.tenders && tendersData.tenders.length > 0) {
      const firstTender = tendersData.tenders[0];
      console.log(`   First tender status: ${firstTender.status_name || 'No status'}`);
      console.log(`   First tender status_id: ${firstTender.status_id || 'No status_id'}`);
    }

    // Test 2: Get tenders with status using new endpoint
    console.log('\n2. Testing GET /api/tender-status/tenders...');
    const statusResponse = await fetch('http://localhost:8080/api/tender-status/tenders');
    
    if (!statusResponse.ok) {
      console.log('❌ Failed to fetch tenders with status:', statusResponse.status);
      return;
    }
    
    const statusData = await statusResponse.json();
    console.log('✅ Tenders with status fetched successfully');
    console.log(`   Total tenders: ${statusData.tenders?.length || 0}`);

    // Test 3: Get tender stats
    console.log('\n3. Testing GET /api/tender-status/stats...');
    const statsResponse = await fetch('http://localhost:8080/api/tender-status/stats');
    
    if (!statsResponse.ok) {
      console.log('❌ Failed to fetch tender stats:', statsResponse.status);
      return;
    }
    
    const statsData = await statsResponse.json();
    console.log('✅ Tender stats fetched successfully');
    console.log('   Stats:', JSON.stringify(statsData, null, 2));

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTenderStatusSystem();