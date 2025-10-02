// Test script to send data to the buyer API endpoint
const testBuyer = {
  commercial_registration_number: "CR123456789",
  commercial_phone_number: "+966501234567",
  industry: "Technology",
  company_name: "Tech Solutions Ltd",
  city: "Riyadh",
  logo: null,
  account_name: "Ahmed Al-Rashid",
  account_email: "ahmed@techsolutions.com",
  account_phone: "+966501234567",
  account_password: "password123",
  licenses: "IT License 2024",
  certificates: "ISO 9001:2015"
};

async function testCreateBuyer() {
  try {
    console.log('Testing buyer creation API...');
    console.log('Sending data:', JSON.stringify(testBuyer, null, 2));
    
    const response = await fetch('http://localhost:8080/api/buyers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBuyer)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Success! Buyer created:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('\n❌ Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('Make sure your server is running on http://localhost:8080');
  }
}

async function testPingEndpoint() {
  try {
    console.log('Testing ping endpoint...');
    const response = await fetch('http://localhost:8080/api/ping');
    const result = await response.json();
    console.log('✅ Ping response:', result);
    return true;
  } catch (error) {
    console.error('❌ Ping failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('=== API Testing ===\n');
  
  const pingSuccess = await testPingEndpoint();
  if (!pingSuccess) {
    console.log('Server is not running. Please start it with: pnpm dev');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  await testCreateBuyer();
}

runTests();