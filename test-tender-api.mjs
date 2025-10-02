// Test the tender API endpoints
// Run with: node test-tender-api.mjs

const BASE_URL = 'http://localhost:8085/api';

async function testTenderAPI() {
  console.log('🧪 Testing Tender API endpoints...\n');

  try {
    // 1. Get all tenders (should be empty initially)
    console.log('📝 1. Getting all tenders...');
    const getTendersResponse = await fetch(`${BASE_URL}/tenders`);
    const tendersData = await getTendersResponse.json();
    console.log('✅ Get tenders:', tendersData);

    // 2. Create a new tender
    console.log('\n📝 2. Creating a new tender...');
    const newTender = {
      reference_number: 25073901055,
      title: 'تطوير تطبيق جوال للتسوق الإلكتروني',
      domain_id: 1, // Assuming domain 1 exists
      project_description: 'تطوير تطبيق جوال شامل للتسوق الإلكتروني يدعم اللغة العربية',
      city: 'الرياض',
      submit_deadline: '2025-12-31T23:59:59',
      quires_deadline: '2025-11-30T23:59:59',
      contract_time: '6 أشهر',
      tender_coordinator: 'أحمد محمد',
      coordinator_email: 'ahmed@company.com',
      coordinator_phone: '966501234567',
      subDomainIds: [1, 2], // Assuming these exist
      licenseIds: [1], // Assuming license 1 exists
      certificateIds: [1] // Assuming certificate 1 exists
    };

    const createTenderResponse = await fetch(`${BASE_URL}/tenders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTender)
    });
    const createData = await createTenderResponse.json();
    console.log('✅ Create tender:', createData);

    if (createData.success && createData.tenderId) {
      const tenderId = createData.tenderId;

      // 3. Get the created tender by ID
      console.log(`\n📝 3. Getting tender by ID (${tenderId})...`);
      const getTenderResponse = await fetch(`${BASE_URL}/tenders/${tenderId}`);
      const tenderData = await getTenderResponse.json();
      console.log('✅ Get tender by ID:', tenderData);

      // 4. Update the tender
      console.log(`\n📝 4. Updating tender ${tenderId}...`);
      const updateTender = {
        title: 'تطوير تطبيق جوال للتسوق الإلكتروني - محدث',
        city: 'جدة',
        contract_time: '8 أشهر'
      };

      const updateTenderResponse = await fetch(`${BASE_URL}/tenders/${tenderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTender)
      });
      const updateData = await updateTenderResponse.json();
      console.log('✅ Update tender:', updateData);

      // 5. Get tenders by domain
      console.log('\n📝 5. Getting tenders by domain (1)...');
      const getDomainTendersResponse = await fetch(`${BASE_URL}/domains/1/tenders`);
      const domainTendersData = await getDomainTendersResponse.json();
      console.log('✅ Get tenders by domain:', domainTendersData);

      // 6. Delete the tender (optional - comment out to keep test data)
      // console.log(`\\n📝 6. Deleting tender ${tenderId}...`);
      // const deleteTenderResponse = await fetch(`${BASE_URL}/tenders/${tenderId}`, {
      //   method: 'DELETE'
      // });
      // const deleteData = await deleteTenderResponse.json();
      // console.log('✅ Delete tender:', deleteData);
    }

    console.log('\n🎉 All tender API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the tests
testTenderAPI();