#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map directory names to our industry categories
const industryMap = {
  'Electricians': 'electricians',
  'GeneralContractors': 'general-contractors',
  'General-Contractors': 'general-contractors',
  'Plumbers': 'plumbers',
  'Leads-Plumbers-Portland': 'plumbers',
  'LawFirms': 'lawfirms',
  'Lawyers': 'lawfirms', 
  'RealEstateAgents': 'real-estate',
  'Real-Estate-Agents': 'real-estate',
  'Roofers': 'roofers'
};

// Function to parse markdown business data
function parseBusinessData(content, city, industry) {
  const businesses = [];
  const lines = content.split('\n');
  
  let currentBusiness = null;
  let businessCounter = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for business headers (## number. [Business Name])
    const businessMatch = line.match(/^##\s*\d+\.\s*\[([^\]]+)\]/);
    if (businessMatch) {
      // Save previous business if exists
      if (currentBusiness && currentBusiness.name && currentBusiness.phone) {
        businesses.push(currentBusiness);
      }
      
      businessCounter++;
      // Start new business
      currentBusiness = {
        id: `${city.toLowerCase()}-${industry}-${businessCounter}`,
        name: businessMatch[1].trim(),
        city: city,
        state: 'OR',
        industry: industryMap[industry] || industry.toLowerCase(),
        services: [],
        verified: true
      };
      continue;
    }
    
    if (!currentBusiness) continue;
    
    // Look for phone numbers - patterns like (503) 555-1234 or 503-555-1234
    const phoneMatch = line.match(/\((\d{3})\)\s*(\d{3})-(\d{4})|(\d{3})-(\d{3})-(\d{4})/);
    if (phoneMatch && !currentBusiness.phone) {
      if (phoneMatch[1]) {
        currentBusiness.phone = `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}`;
      } else {
        currentBusiness.phone = `(${phoneMatch[4]}) ${phoneMatch[5]}-${phoneMatch[6]}`;
      }
    }
    
    // Look for addresses (city, state zip)
    const addressMatch = line.match(/^(.+),\s*(OR|Oregon)\s*(\d{5})/);
    if (addressMatch && !currentBusiness.address) {
      // Look for street address in previous non-empty lines
      let streetLine = '';
      for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
        const prevLine = lines[j] ? lines[j].trim() : '';
        if (prevLine && 
            !prevLine.match(/^\(?\d{3}/) && // not phone number
            !prevLine.includes('http') && // not website
            !prevLine.includes('![') && // not image
            !prevLine.includes('**') && // not bold text
            !prevLine.includes('[') && // not link
            prevLine.length > 5 && 
            prevLine.length < 100) {
          streetLine = prevLine;
          break;
        }
      }
      
      if (streetLine) {
        currentBusiness.address = {
          street: streetLine,
          city: addressMatch[1].trim(),
          state: 'OR',
          zipCode: addressMatch[3]
        };
      }
    }
    
    // Look for websites
    const websiteMatch = line.match(/\[Website\]\(([^)]+)\)/);
    if (websiteMatch && !currentBusiness.website) {
      let website = websiteMatch[1];
      if (!website.startsWith('http')) {
        website = 'https://' + website;
      }
      currentBusiness.website = website;
    }
    
    // Look for years in business
    const yearsMatch = line.match(/\*\*(\d+)\s*Years\*\*/);
    if (yearsMatch && !currentBusiness.yearsInBusiness) {
      currentBusiness.yearsInBusiness = parseInt(yearsMatch[1]);
    }
    
    // Extract services from category links (only from lines with yellowpages.com)
    if (line.includes('yellowpages.com') && currentBusiness.services.length < 8) {
      const serviceMatches = line.match(/\[([^\]]+)\]/g);
      if (serviceMatches) {
        for (const match of serviceMatches) {
          const service = match.replace(/[\[\]]/g, '').trim();
          if (!currentBusiness.services.includes(service) && 
              service !== currentBusiness.name && 
              !service.includes('Website') &&
              !service.includes('Directions') &&
              !service.includes('More Info') &&
              !service.includes('Gallery') &&
              !service.includes('![') &&
              service.length > 2 &&
              service.length < 50) {
            currentBusiness.services.push(service);
          }
        }
      }
    }
  }
  
  // Add the last business
  if (currentBusiness && currentBusiness.name && currentBusiness.phone) {
    businesses.push(currentBusiness);
  }
  
  return businesses;
}

// Main processing function
async function processBusinessData() {
  const businessListingsPath = '/mnt/c/home/Claude.md/Business-Listings';
  const outputPath = '/home/mikes/oregon-smb-directory-app/raw-business-data/real-businesses.json';
  
  const allBusinesses = [];
  const cities = ['Eugene', 'Portland', 'Salem', 'Medford', 'GrantsPass', 'Roseburg', 'Ashland'];
  
  for (const city of cities) {
    const cityPath = path.join(businessListingsPath, city);
    console.log(`Processing ${city}...`);
    
    try {
      const items = fs.readdirSync(cityPath, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isDirectory() || item.name.endsWith('.md')) {
          let industryPath, industry;
          
          if (item.isDirectory()) {
            industryPath = path.join(cityPath, item.name);
            industry = item.name;
            
            // Process files in industry directory
            const industryFiles = fs.readdirSync(industryPath);
            for (const file of industryFiles) {
              if (file.endsWith('.md')) {
                const filePath = path.join(industryPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const businesses = parseBusinessData(content, city, industry);
                allBusinesses.push(...businesses);
                console.log(`  ${industry}/${file}: ${businesses.length} businesses`);
              }
            }
          } else if (item.name.endsWith('.md')) {
            // Direct .md file in city directory
            const filePath = path.join(cityPath, item.name);
            const content = fs.readFileSync(filePath, 'utf8');
            industry = item.name.replace('.md', '').replace(/[-_]/g, ' ');
            const businesses = parseBusinessData(content, city, industry);
            allBusinesses.push(...businesses);
            console.log(`  ${item.name}: ${businesses.length} businesses`);
          }
        }
      }
    } catch (error) {
      console.log(`Skipping ${city}: ${error.message}`);
    }
  }
  
  console.log(`\nTotal businesses processed: ${allBusinesses.length}`);
  
  // Save to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(allBusinesses, null, 2));
  console.log(`Real business data saved to: ${outputPath}`);
  
  return allBusinesses;
}

// Run the script
if (require.main === module) {
  processBusinessData().catch(console.error);
}

module.exports = { processBusinessData, parseBusinessData };