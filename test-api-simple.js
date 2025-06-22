const http = require('http');

const BASE_URL = 'http://localhost:4000';

// Test endpoints
const endpoints = [
  { path: '/health', name: 'Health Check' },
  { path: '/api/doshas/info', name: 'Dosha Information' },
  { path: '/api/symptoms', name: 'Symptoms List' },
  { path: '/api/remedies', name: 'Remedies List' }
];

async function testEndpoint(path, name) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ ${name}: ${res.statusCode} - ${response.success ? 'SUCCESS' : 'FAILED'}`);
          if (response.data) {
            if (Array.isArray(response.data)) {
              console.log(`   📊 Items returned: ${response.data.length}`);
            } else if (typeof response.data === 'object') {
              console.log(`   📊 Keys: ${Object.keys(response.data).join(', ')}`);
            }
          }
        } catch (e) {
          console.log(`❌ ${name}: ${res.statusCode} - Invalid JSON response`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${name}: ERROR - ${err.message}`);
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${name}: TIMEOUT`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Ayurveda Remedy API...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, endpoint.name);
  }
  
  console.log('\n🎉 API Testing Complete!');
  console.log('📖 API Documentation: http://localhost:4000/api/docs');
  console.log('🌐 Frontend: http://localhost:4000');
}

runTests(); 