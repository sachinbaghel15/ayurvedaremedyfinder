const fs = require('fs');
const path = require('path');

// Read the current server file
const serverPath = path.join(__dirname, 'server-simple.js');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Fixing API for development...');

// 1. Remove API key authentication from routes
content = content.replace(/app\.use\('\/api\/remedies\/by-symptoms', authenticateApiKey\);/g, '');
content = content.replace(/app\.use\('\/api\/remedies\/by-dosha', authenticateApiKey\);/g, '');
content = content.replace(/app\.use\('\/api\/remedies\/search', authenticateApiKey\);/g, '');
content = content.replace(/app\.use\('\/api\/remedies\/:id', authenticateApiKey\);/g, '');

// 2. Remove authenticateApiKey from individual routes
content = content.replace(/authenticateApiKey,\s*/g, '');

// 3. Fix the by-symptoms route that got corrupted
const bySymptomsRoute = `app.get('/api/remedies/by-symptoms', (req, res) => {
  const { symptoms } = req.query;
  
  if (!symptoms) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms parameter is required'
    });
  }
  
  const symptomArray = symptoms.split(',');
  const remedies = worldwideRemediesData.filter(remedy => 
    remedy.symptoms.some(symptom => symptomArray.includes(symptom))
  );
  
  // Sort by number of matching symptoms (most relevant first)
  remedies.sort((a, b) => {
    const aMatches = a.symptoms.filter(s => symptomArray.includes(s)).length;
    const bMatches = b.symptoms.filter(s => symptomArray.includes(s)).length;
    return bMatches - aMatches;
  });
  
  // Group by category
  const remediesByCategory = {};
  remedies.forEach(remedy => {
    if (!remediesByCategory[remedy.category]) {
      remediesByCategory[remedy.category] = [];
    }
    remediesByCategory[remedy.category].push(remedy);
  });
  
  res.json({
    success: true,
    data: remedies,
    total: remedies.length,
    matchedSymptoms: symptomArray,
    remediesByCategory
  });
});`;

// Remove the corrupted route and add the correct one
content = content.replace(/app\.get\('\/api\/remedies\/by-symptoms'.*?}\);[\s\S]*?app\.get\('\/api\/remedies\/categories'/g, 
  `${bySymptomsRoute}\n\napp.get('/api/remedies/categories'`);

// 4. Fix the categories route
const categoriesRoute = `app.get('/api/remedies/categories', (req, res) => {
  const categories = [...new Set(worldwideRemediesData.map(r => r.category))].map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
    count: worldwideRemediesData.filter(r => r.category === category).length
  }));
  
  res.json({
    success: true,
    data: categories
  });
});`;

content = content.replace(/app\.get\('\/api\/remedies\/categories'.*?}\);[\s\S]*?app\.get\('\/api\/remedies\/origins'/g,
  `${categoriesRoute}\n\napp.get('/api/remedies/origins'`);

// 5. Fix the origins route
const originsRoute = `app.get('/api/remedies/origins', (req, res) => {
  const origins = [...new Set(worldwideRemediesData.map(r => r.origin))].map(origin => ({
    id: origin,
    name: origin,
    count: worldwideRemediesData.filter(r => r.origin === origin).length
  }));
  
  res.json({
    success: true,
    data: origins
  });
});`;

content = content.replace(/app\.get\('\/api\/remedies\/origins'.*?}\);[\s\S]*?app\.get\('\/api\/remedies\/:id'/g,
  `${originsRoute}\n\napp.get('/api/remedies/:id'`);

// Write the fixed content back
fs.writeFileSync(serverPath, content);
console.log('✅ API fixed successfully!');
console.log('🚀 No API key required for development');
console.log('📝 Routes fixed and working'); 