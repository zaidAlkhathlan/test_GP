// Test the licenses and certificates API endpoints
async function testAPIs() {
  try {
    console.log('🧪 Testing Licenses API...');
    const licensesResponse = await fetch('http://localhost:8080/api/licenses');
    
    if (!licensesResponse.ok) {
      console.error('❌ Licenses API failed:', licensesResponse.status, licensesResponse.statusText);
    } else {
      const licenses = await licensesResponse.json();
      console.log(`✅ Licenses API working - Found ${licenses.length} licenses`);
      console.log('📋 First few licenses:');
      licenses.slice(0, 3).forEach(license => {
        console.log(`   - ID: ${license.id}, Code: ${license.code}, Name: ${license.name_ar}`);
      });
    }
    
    console.log('\n🧪 Testing Certificates API...');
    const certificatesResponse = await fetch('http://localhost:8080/api/certificates');
    
    if (!certificatesResponse.ok) {
      console.error('❌ Certificates API failed:', certificatesResponse.status, certificatesResponse.statusText);
    } else {
      const certificates = await certificatesResponse.json();
      console.log(`✅ Certificates API working - Found ${certificates.length} certificates`);
      console.log('📜 First few certificates:');
      certificates.slice(0, 3).forEach(cert => {
        console.log(`   - ID: ${cert.id}, Code: ${cert.code}, Name: ${cert.name_ar}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing APIs:', error);
  }
}

testAPIs();