const fs = require('fs');

// Read the file
let content = fs.readFileSync('server-simple.js', 'utf8');

// Replace the problematic lines
content = content.replace(
  "app.use('/api/remedies/by-symptoms', authenticateApiKey); // Allow frontend access",
  "// app.use('/api/remedies/by-symptoms', authenticateApiKey); // PUBLIC ENDPOINT - NO AUTH REQUIRED"
);

content = content.replace(
  "app.use('/api/remedies/categories', authenticateApiKey); // Allow frontend access",
  "// app.use('/api/remedies/categories', authenticateApiKey); // PUBLIC ENDPOINT - NO AUTH REQUIRED"
);

content = content.replace(
  "app.use('/api/remedies/origins', authenticateApiKey); // Allow frontend access",
  "// app.use('/api/remedies/origins', authenticateApiKey); // PUBLIC ENDPOINT - NO AUTH REQUIRED"
);

// Write the file back
fs.writeFileSync('server-simple.js', content);

console.log('✅ Fixed authentication issue! Public endpoints are now accessible without API keys.');
console.log('🚀 You can now restart your server with: node server-simple.js'); 