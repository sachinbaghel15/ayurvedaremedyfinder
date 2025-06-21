const http = require('http');

// Test the health endpoint
function testHealth() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Health Check Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📋 Response:', JSON.parse(data));
      testDoshaInfo();
    });
  });

  req.on('error', (err) => {
    console.log('❌ Error:', err.message);
    console.log('💡 Make sure the server is running on port 5000');
  });

  req.end();
}

// Test the dosha info endpoint
function testDoshaInfo() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/doshas/info',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Dosha Info Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log('📋 Dosha Types Available:', Object.keys(response.data));
      console.log('🎉 API is working correctly!');
    });
  });

  req.on('error', (err) => {
    console.log('❌ Error:', err.message);
  });

  req.end();
}

console.log('🧪 Testing Ayurveda Remedy API...');
console.log('📍 Make sure the server is running on http://localhost:5000');
console.log('');

testHealth(); 