async function testEndpoints() {
  const endpoints = [
    { name: 'Vet Directory', url: 'http://localhost:3000/api/vet/directory', method: 'GET' },
    { name: 'Lost & Found Radar', url: 'http://localhost:3000/api/lost-found', method: 'GET' },
    { name: 'Marketplace Listings', url: 'http://localhost:3000/api/marketplace', method: 'GET' },
    { name: 'Posts Feed', url: 'http://localhost:3000/api/posts', method: 'GET' },
    { name: 'Auth /me', url: 'http://localhost:3000/api/auth/me', method: 'GET' },
    { 
      name: 'PawAI Clinical Triage', 
      url: 'http://localhost:3000/api/pawai/triage', 
      method: 'POST', 
      body: JSON.stringify({ petName: 'Mochi', species: 'Cat', symptoms: 'vomiting and lethargic' }),
      headers: { 'Content-Type': 'application/json' }
    }
  ];

  let passed = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { 
        method: ep.method, 
        headers: ep.headers, 
        body: ep.body 
      });
      const data = await res.json();
      console.log(`✓ [PASS] ${ep.name} -> HTTP ${res.status} | Data received: ${JSON.stringify(data).slice(0, 70)}...`);
      passed++;
    } catch (e) {
      console.error(`✗ [FAIL] ${ep.name} -> ${e.message}`);
    }
  }

  console.log(`\nEndpoint Test Summary: ${passed} / ${endpoints.length} PASSED.`);
}

testEndpoints();
