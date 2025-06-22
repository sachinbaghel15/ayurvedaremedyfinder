const fs = require('fs');
const path = require('path');

// Read the current server file
const serverPath = path.join(__dirname, 'server-simple.js');
let content = fs.readFileSync(serverPath, 'utf8');

// Find the problematic route sections
const idRouteStart = content.indexOf("app.get('/api/remedies/:id'");
const bySymptomsRouteStart = content.indexOf("app.get('/api/remedies/by-symptoms'");
const categoriesRouteStart = content.indexOf("app.get('/api/remedies/categories'");
const originsRouteStart = content.indexOf("app.get('/api/remedies/origins'");

if (idRouteStart < bySymptomsRouteStart) {
  console.log('Routes are in wrong order. Fixing...');
  
  // Extract the route handlers
  const idRouteEnd = content.indexOf('});', idRouteStart) + 3;
  const bySymptomsRouteEnd = content.indexOf('});', bySymptomsRouteStart) + 3;
  const categoriesRouteEnd = content.indexOf('});', categoriesRouteStart) + 3;
  const originsRouteEnd = content.indexOf('});', originsRouteStart) + 3;
  
  const idRoute = content.substring(idRouteStart, idRouteEnd);
  const bySymptomsRoute = content.substring(bySymptomsRouteStart, bySymptomsRouteEnd);
  const categoriesRoute = content.substring(categoriesRouteStart, categoriesRouteEnd);
  const originsRoute = content.substring(originsRouteStart, originsRouteEnd);
  
  // Remove the old routes
  content = content.replace(idRoute, '');
  content = content.replace(bySymptomsRoute, '');
  content = content.replace(categoriesRoute, '');
  content = content.replace(originsRoute, '');
  
  // Find where to insert the routes (after the main remedies route)
  const mainRemediesRouteEnd = content.indexOf("app.get('/api/remedies', authenticateApiKey");
  const insertPoint = content.indexOf('});', mainRemediesRouteEnd) + 3;
  
  // Insert the routes in correct order
  const newRoutes = `
${bySymptomsRoute}

${categoriesRoute}

${originsRoute}

${idRoute}
`;
  
  content = content.substring(0, insertPoint) + newRoutes + content.substring(insertPoint);
  
  // Write the fixed content back
  fs.writeFileSync(serverPath, content);
  console.log('Routes fixed successfully!');
} else {
  console.log('Routes are already in correct order.');
} 