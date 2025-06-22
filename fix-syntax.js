const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing syntax errors...');

// Read the current server file
const serverPath = path.join(__dirname, 'server-simple.js');
let content = fs.readFileSync(serverPath, 'utf8');

// Remove extra closing braces and fix the structure
content = content.replace(/\n\s*}\);[\s\S]*?app\.get\('\/api\/remedies\/by-symptoms'/g, 
  '\n\napp.get(\'/api/remedies/by-symptoms\'');

content = content.replace(/\n\s*}\);[\s\S]*?app\.get\('\/api\/remedies\/categories'/g,
  '\n\napp.get(\'/api/remedies/categories\'');

content = content.replace(/\n\s*}\);[\s\S]*?app\.get\('\/api\/remedies\/origins'/g,
  '\n\napp.get(\'/api/remedies/origins\'');

// Remove any remaining extra closing braces
content = content.replace(/\n\s*}\);[\s\S]*?\n\s*}\);[\s\S]*?\n\s*}\);/g, '\n});');

// Write the fixed content back
fs.writeFileSync(serverPath, content);
console.log('✅ Syntax errors fixed!'); 