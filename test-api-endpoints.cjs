const fetch = require('node-fetch');

async function testAPI() {
  console.log('Testing API endpoints...');
  
  try {
    // Test domains endpoint
    console.log('\n=== Testing /api/domains ===');
    const domainsResponse = await fetch('http://localhost:8081/api/domains');
    if (domainsResponse.ok) {
      const domainsData = await domainsResponse.json();
      console.log('✅ Domains endpoint working');
      console.log('Found', domainsData.domains.length, 'domains');
      console.log('First few domains:', domainsData.domains.slice(0, 3));
    } else {
      console.log('❌ Domains endpoint failed:', domainsResponse.status);
    }

    // Test sub-domains endpoint
    console.log('\n=== Testing /api/sub-domains ===');
    const subDomainsResponse = await fetch('http://localhost:8081/api/sub-domains');
    if (subDomainsResponse.ok) {
      const subDomainsData = await subDomainsResponse.json();
      console.log('✅ Sub-domains endpoint working');
      console.log('Found', subDomainsData.subDomains.length, 'sub-domains');
      console.log('First few sub-domains:', subDomainsData.subDomains.slice(0, 3));
    } else {
      console.log('❌ Sub-domains endpoint failed:', subDomainsResponse.status);
    }

    // Test sub-domains by domain endpoint
    console.log('\n=== Testing /api/domains/1/sub-domains ===');
    const domainSubDomainsResponse = await fetch('http://localhost:8081/api/domains/1/sub-domains');
    if (domainSubDomainsResponse.ok) {
      const domainSubDomainsData = await domainSubDomainsResponse.json();
      console.log('✅ Domain-specific sub-domains endpoint working');
      console.log('Found', domainSubDomainsData.subDomains.length, 'sub-domains for domain 1');
      console.log('Sub-domains for domain 1:', domainSubDomainsData.subDomains);
    } else {
      console.log('❌ Domain-specific sub-domains endpoint failed:', domainSubDomainsResponse.status);
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();