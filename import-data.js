#!/usr/bin/env node
/**
 * Import business data from businesses.json into D1 database
 * This script handles the 2,482 businesses in batches for efficient import
 */

const fs = require('fs');
const path = require('path');

// Read the businesses data
const businessesData = JSON.parse(fs.readFileSync('./raw-business-data/businesses.json', 'utf8'));

console.log(`Total businesses to import: ${businessesData.length}`);

// Create SQL insert statements in batches
const BATCH_SIZE = 100; // Import in batches of 100
let sqlStatements = [];
let currentBatch = [];

// Normalize industry names to match expected values
function normalizeIndustry(industry) {
  const industryMap = {
    'electricians': 'electricians',
    'general-contractors': 'general-contractors', 
    'real-estate': 'real-estate',
    'eugene realestate agents': 'real-estate',
    'roseburg realestate agents': 'real-estate', 
    'salem realestate agents': 'real-estate',
    'plumbers': 'plumbers',
    'lawfirms': 'lawfirms',
    'roofers': 'roofers'
  };
  
  return industryMap[industry] || industry;
}

// Normalize city names to match expected values
function normalizeCity(city) {
  const cityMap = {
    'GrantsPass': 'Grants Pass',
    'Portland': 'Portland',
    'Eugene': 'Eugene', 
    'Salem': 'Salem',
    'Medford': 'Medford',
    'Roseburg': 'Roseburg'
  };
  
  return cityMap[city] || city;
}

// Generate INSERT statements
for (let i = 0; i < businessesData.length; i++) {
  const business = businessesData[i];
  
  // Clean and prepare the data  
  function escapeSQL(str) {
    if (!str) return null;
    return str.toString().replace(/'/g, "''").replace(/\\/g, "\\\\");
  }

  const cleanBusiness = {
    id: escapeSQL(business.id),
    name: escapeSQL(business.name),
    city: escapeSQL(normalizeCity(business.city)),
    state: escapeSQL(business.state || 'OR'),
    industry: escapeSQL(normalizeIndustry(business.industry)),
    services: JSON.stringify(business.services || []).replace(/'/g, "''"),
    verified: business.verified ? 1 : 0,
    website: escapeSQL(business.website),
    yearsInBusiness: business.yearsInBusiness || null,
    phone: escapeSQL(business.phone),
    address: escapeSQL(business.address),
    email: escapeSQL(business.email), 
    rating: business.rating || null,
    reviewCount: business.reviewCount || null,
    licenseNumber: escapeSQL(business.licenseNumber),
    bbbRating: escapeSQL(business.bbbRating),
    emergencyService: business.emergencyService ? 1 : 0
  };

  const values = `(
    '${cleanBusiness.id}',
    '${cleanBusiness.name}',
    '${cleanBusiness.city}',
    '${cleanBusiness.state}',
    '${cleanBusiness.industry}',
    '${cleanBusiness.services}',
    ${cleanBusiness.verified},
    ${cleanBusiness.website ? `'${cleanBusiness.website}'` : 'NULL'},
    ${cleanBusiness.yearsInBusiness || 'NULL'},
    ${cleanBusiness.phone ? `'${cleanBusiness.phone}'` : 'NULL'},
    ${cleanBusiness.address ? `'${cleanBusiness.address}'` : 'NULL'},
    ${cleanBusiness.email ? `'${cleanBusiness.email}'` : 'NULL'},
    ${cleanBusiness.rating || 'NULL'},
    ${cleanBusiness.reviewCount || 'NULL'},
    ${cleanBusiness.licenseNumber ? `'${cleanBusiness.licenseNumber}'` : 'NULL'},
    ${cleanBusiness.bbbRating ? `'${cleanBusiness.bbbRating}'` : 'NULL'},
    ${cleanBusiness.emergencyService}
  )`;

  currentBatch.push(values);

  // When batch is full or we're at the end, create SQL statement
  if (currentBatch.length === BATCH_SIZE || i === businessesData.length - 1) {
    const insertSQL = `INSERT INTO businesses (
      id, name, city, state, industry, services, verified, website, 
      yearsInBusiness, phone, address, email, rating, reviewCount, 
      licenseNumber, bbbRating, emergencyService
    ) VALUES ${currentBatch.join(',\n')};`;
    
    sqlStatements.push(insertSQL);
    currentBatch = [];
    
    console.log(`Generated batch ${sqlStatements.length} with ${Math.min(BATCH_SIZE, businessesData.length - (sqlStatements.length - 1) * BATCH_SIZE)} businesses`);
  }
}

// Write each SQL statement to separate files for import
console.log(`\nGenerating ${sqlStatements.length} SQL files for import...`);

// Create import directory
if (!fs.existsSync('./import-sql')) {
  fs.mkdirSync('./import-sql');
}

// Write each batch to a separate file
sqlStatements.forEach((sql, index) => {
  const filename = `./import-sql/import_batch_${String(index + 1).padStart(3, '0')}.sql`;
  fs.writeFileSync(filename, sql);
});

console.log(`\nGenerated ${sqlStatements.length} SQL import files in ./import-sql/`);
console.log('\nTo import the data, run:');
console.log('for file in ./import-sql/*.sql; do wrangler d1 execute oregon-smb-directory --file="$file" --remote; done');

// Also generate a single large file for local import
const allSQL = sqlStatements.join('\n\n');
fs.writeFileSync('./import-all.sql', allSQL);
console.log('\nAlso generated ./import-all.sql for local development import');
console.log('For local: wrangler d1 execute oregon-smb-directory --file=./import-all.sql');