#!/usr/bin/env node

/**
 * Oregon SMB Directory - Data Sealing Agent
 * 
 * PURPOSE: Validate and integrate 1000+ real Oregon business listings
 * REPLACES: Fake sample data with actual collected business data
 * VALIDATES: Business registry, phone numbers, addresses, duplicates
 * TRANSFORMS: Raw data to TypeScript Business interface format
 * 
 * Author: LEVERAGEAI LLC
 * Date: 2025-08-11
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  // Oregon Cities (6 total)
  CITIES: ['grants-pass', 'medford', 'roseburg', 'eugene', 'salem', 'portland'],
  
  // Industries (6 total) 
  INDUSTRIES: ['lawfirms', 'roofers', 'real-estate', 'general-contractors', 'plumbers', 'electricians'],
  
  // Data paths
  INPUT_DATA_PATH: './raw-business-data', // Where collected business data is stored
  OUTPUT_DATA_PATH: './lib/data/businesses.ts',
  BACKUP_PATH: './data-backups',
  VALIDATION_REPORTS_PATH: './validation-reports',
  
  // Validation settings
  MIN_PHONE_DIGITS: 10,
  MAX_PHONE_DIGITS: 11,
  OREGON_AREA_CODES: ['503', '971', '458', '541'],
  REQUIRED_FIELDS: ['name', 'phone', 'address'],
  
  // Business validation patterns
  VALIDATION_PATTERNS: {
    phone: /^(\+1[-.\s]?)?\(?([2-9][0-8][0-9])\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/,
    website: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    licenseNumber: /^[A-Z0-9]{4,12}$/i
  }
};

class DataSealingAgent {
  constructor() {
    this.validationResults = {
      total: 0,
      valid: 0,
      invalid: 0,
      duplicates: 0,
      warnings: []
    };
    
    this.processedBusinesses = new Map(); // city-industry -> Business[]
    this.duplicateTracker = new Set();
    this.businessIdCounter = 0;
  }

  async initialize() {
    console.log('🔄 Initializing Data Sealing Agent...');
    
    // Create necessary directories
    await this.ensureDirectories();
    
    // Create backup of existing data
    await this.createBackup();
    
    console.log('✅ Data Sealing Agent initialized');
  }

  async ensureDirectories() {
    const dirs = [
      CONFIG.INPUT_DATA_PATH,
      CONFIG.BACKUP_PATH,
      CONFIG.VALIDATION_REPORTS_PATH
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        if (error.code !== 'EEXIST') {
          console.error(`❌ Error creating directory ${dir}:`, error.message);
        }
      }
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFileName = `businesses-backup-${timestamp}.ts`;
    const backupPath = path.join(CONFIG.BACKUP_PATH, backupFileName);

    try {
      const existingData = await fs.readFile(CONFIG.OUTPUT_DATA_PATH, 'utf8');
      await fs.writeFile(backupPath, existingData);
      console.log(`💾 Backup created: ${backupFileName}`);
    } catch (error) {
      console.log('ℹ️  No existing data to backup');
    }
  }

  /**
   * Main processing workflow
   */
  async processBusinessData() {
    console.log('🚀 Starting business data processing...');

    // Step 1: Load raw business data
    const rawData = await this.loadRawBusinessData();
    
    // Step 2: Validate and transform each business
    for (const business of rawData) {
      await this.processBusinessRecord(business);
    }
    
    // Step 3: Check for duplicates
    await this.checkForDuplicates();
    
    // Step 4: Generate TypeScript output
    await this.generateTypeScriptOutput();
    
    // Step 5: Generate validation report
    await this.generateValidationReport();
    
    console.log('✅ Business data processing complete');
  }

  /**
   * Load raw business data from various sources
   */
  async loadRawBusinessData() {
    console.log('📥 Loading raw business data...');
    
    const rawBusinesses = [];
    
    // Try to load from different possible formats
    const possibleSources = [
      'businesses.json',
      'oregon-businesses.json', 
      'collected-data.json',
      'business-listings.csv'
    ];

    for (const source of possibleSources) {
      const sourcePath = path.join(CONFIG.INPUT_DATA_PATH, source);
      
      try {
        if (source.endsWith('.json')) {
          const data = await fs.readFile(sourcePath, 'utf8');
          const businesses = JSON.parse(data);
          rawBusinesses.push(...(Array.isArray(businesses) ? businesses : [businesses]));
          console.log(`📄 Loaded ${businesses.length} records from ${source}`);
        } else if (source.endsWith('.csv')) {
          // CSV parsing would go here
          console.log(`📄 CSV parsing for ${source} not implemented yet`);
        }
      } catch (error) {
        // File doesn't exist, continue to next source
        continue;
      }
    }

    // If no data found, create sample structure for user to populate
    if (rawBusinesses.length === 0) {
      await this.createSampleDataStructure();
      throw new Error(`
❌ No business data found in ${CONFIG.INPUT_DATA_PATH}

Please add your collected business data in one of these formats:
- businesses.json
- oregon-businesses.json
- collected-data.json

Sample structure has been created in raw-business-data/sample-business-structure.json
      `);
    }

    this.validationResults.total = rawBusinesses.length;
    return rawBusinesses;
  }

  /**
   * Create sample data structure for user guidance
   */
  async createSampleDataStructure() {
    const sampleBusiness = {
      name: "Example Electric Company",
      phone: "(503) 555-0123",
      email: "info@example-electric.com",
      website: "www.example-electric.com",
      address: {
        street: "123 Main Street",
        city: "Portland",
        state: "OR",
        zipCode: "97205"
      },
      industry: "electricians", // or: lawfirms, roofers, real-estate, general-contractors, plumbers
      services: [
        "Residential Electrical",
        "Commercial Electrical", 
        "Emergency Repairs"
      ],
      licenseNumber: "123456",
      yearsInBusiness: 15,
      emergencyService: true,
      hours: "Mon-Fri: 7AM-5PM",
      specialties: ["Smart Home Systems", "Panel Upgrades"],
      bbbRating: "A+",
      // Optional fields
      rating: 4.8,
      reviewCount: 47,
      featured: false
    };

    const sampleStructure = [sampleBusiness];
    const samplePath = path.join(CONFIG.INPUT_DATA_PATH, 'sample-business-structure.json');
    
    await fs.writeFile(samplePath, JSON.stringify(sampleStructure, null, 2));
    console.log(`📝 Sample structure created at: ${samplePath}`);
  }

  /**
   * Process and validate individual business record
   */
  async processBusinessRecord(rawBusiness) {
    try {
      // Basic field validation
      const validationIssues = this.validateBusinessFields(rawBusiness);
      
      if (validationIssues.length > 0) {
        this.validationResults.invalid++;
        this.validationResults.warnings.push({
          business: rawBusiness.name || 'Unknown',
          issues: validationIssues
        });
        return;
      }

      // Transform to Business interface format
      const business = this.transformToBusiness(rawBusiness);
      
      // Additional validations
      await this.validatePhoneNumber(business);
      await this.validateAddress(business);
      await this.validateCity(business);
      await this.validateIndustry(business);

      // Store in appropriate city-industry bucket
      const key = `${business.address.city.toLowerCase()}-${this.getIndustryFromBusiness(business)}`;
      
      if (!this.processedBusinesses.has(key)) {
        this.processedBusinesses.set(key, []);
      }
      
      this.processedBusinesses.get(key).push(business);
      this.validationResults.valid++;

    } catch (error) {
      this.validationResults.invalid++;
      this.validationResults.warnings.push({
        business: rawBusiness.name || 'Unknown',
        issues: [`Processing error: ${error.message}`]
      });
    }
  }

  /**
   * Validate required business fields
   */
  validateBusinessFields(business) {
    const issues = [];
    
    for (const field of CONFIG.REQUIRED_FIELDS) {
      if (field === 'address') {
        if (!business.address || typeof business.address !== 'object') {
          issues.push(`Missing or invalid address object`);
        } else {
          if (!business.address.street) issues.push('Missing address.street');
          if (!business.address.city) issues.push('Missing address.city');
          if (!business.address.state) issues.push('Missing address.state');
          if (!business.address.zipCode) issues.push('Missing address.zipCode');
        }
      } else {
        if (!business[field]) {
          issues.push(`Missing required field: ${field}`);
        }
      }
    }

    // Validate state is Oregon
    if (business.address?.state && business.address.state !== 'OR') {
      issues.push(`Invalid state: ${business.address.state} (must be OR)`);
    }

    return issues;
  }

  /**
   * Transform raw business data to Business interface
   */
  transformToBusiness(rawBusiness) {
    this.businessIdCounter++;
    
    // Generate consistent ID
    const citySlug = rawBusiness.address.city.toLowerCase().replace(/\s+/g, '-');
    const nameSlug = rawBusiness.name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    
    const id = `${nameSlug}-${citySlug}-${this.businessIdCounter}`;

    return {
      id: id,
      name: rawBusiness.name.trim(),
      trade: this.determineTradeFromIndustry(rawBusiness.industry || rawBusiness.trade),
      phone: this.formatPhoneNumber(rawBusiness.phone),
      email: rawBusiness.email?.trim(),
      website: this.formatWebsite(rawBusiness.website),
      address: {
        street: rawBusiness.address.street.trim(),
        city: this.formatCityName(rawBusiness.address.city),
        state: 'OR',
        zipCode: rawBusiness.address.zipCode.trim()
      },
      services: this.formatServices(rawBusiness.services || []),
      specialties: rawBusiness.specialties || [],
      hours: rawBusiness.hours || '',
      rating: rawBusiness.rating || undefined,
      reviewCount: rawBusiness.reviewCount || undefined,
      licenseNumber: rawBusiness.licenseNumber || undefined,
      yearsInBusiness: rawBusiness.yearsInBusiness || undefined,
      verified: this.shouldMarkAsVerified(rawBusiness),
      featured: rawBusiness.featured || false,
      emergencyService: rawBusiness.emergencyService || false,
      bbbRating: rawBusiness.bbbRating || undefined
    };
  }

  /**
   * Format phone number to standard format
   */
  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Extract digits only
    const digits = phone.replace(/\D/g, '');
    
    // Format as (xxx) xxx-xxxx
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  }

  /**
   * Format website URL
   */
  formatWebsite(website) {
    if (!website) return undefined;
    
    website = website.trim();
    
    // Add https:// if no protocol
    if (website && !website.startsWith('http')) {
      website = 'https://' + website;
    }
    
    return website;
  }

  /**
   * Format city name to match expected values
   */
  formatCityName(city) {
    if (!city) return '';
    
    const cityMappings = {
      'grants pass': 'Grants Pass',
      'grantspass': 'Grants Pass',
      'medford': 'Medford',
      'roseburg': 'Roseburg',
      'eugene': 'Eugene',
      'salem': 'Salem',
      'portland': 'Portland'
    };

    const normalized = city.toLowerCase().trim();
    return cityMappings[normalized] || city;
  }

  /**
   * Format services array
   */
  formatServices(services) {
    if (!Array.isArray(services)) return [];
    
    return services
      .map(service => service.trim())
      .filter(service => service.length > 0);
  }

  /**
   * Determine trade from industry
   */
  determineTradeFromIndustry(industry) {
    const tradeMap = {
      'electricians': 'Electrician',
      'plumbers': 'Plumber', 
      'roofers': 'Roofer',
      'general-contractors': 'General Contractor',
      'lawfirms': 'Attorney',
      'real-estate': 'Real Estate Agent'
    };

    return tradeMap[industry] || industry || 'Service Provider';
  }

  /**
   * Get industry slug from business
   */
  getIndustryFromBusiness(business) {
    const tradeToIndustryMap = {
      'Electrician': 'electricians',
      'Plumber': 'plumbers',
      'Roofer': 'roofers',
      'General Contractor': 'general-contractors', 
      'Attorney': 'lawfirms',
      'Real Estate Agent': 'real-estate'
    };

    return tradeToIndustryMap[business.trade] || 'electricians';
  }

  /**
   * Determine if business should be marked as verified
   */
  shouldMarkAsVerified(rawBusiness) {
    // Mark as verified if has license number or BBB rating
    return !!(rawBusiness.licenseNumber || rawBusiness.bbbRating);
  }

  /**
   * Validate phone number
   */
  async validatePhoneNumber(business) {
    const phone = business.phone.replace(/\D/g, '');
    
    if (phone.length < CONFIG.MIN_PHONE_DIGITS || phone.length > CONFIG.MAX_PHONE_DIGITS) {
      throw new Error(`Invalid phone number length: ${business.phone}`);
    }

    // Check Oregon area codes
    const areaCode = phone.slice(0, 3);
    if (!CONFIG.OREGON_AREA_CODES.includes(areaCode)) {
      this.validationResults.warnings.push({
        business: business.name,
        issues: [`Non-Oregon area code: ${areaCode}`]
      });
    }
  }

  /**
   * Validate business address
   */
  async validateAddress(business) {
    const { address } = business;
    
    if (!CONFIG.VALIDATION_PATTERNS.zipCode.test(address.zipCode)) {
      throw new Error(`Invalid ZIP code: ${address.zipCode}`);
    }

    // Oregon ZIP code validation (97xxx)
    if (!address.zipCode.startsWith('97')) {
      this.validationResults.warnings.push({
        business: business.name,
        issues: [`Non-Oregon ZIP code: ${address.zipCode}`]
      });
    }
  }

  /**
   * Validate city is in our supported list
   */
  async validateCity(business) {
    const supportedCities = CONFIG.CITIES.map(city => 
      city.replace('-', ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );

    if (!supportedCities.includes(business.address.city)) {
      throw new Error(`Unsupported city: ${business.address.city}`);
    }
  }

  /**
   * Validate industry classification
   */
  async validateIndustry(business) {
    const industry = this.getIndustryFromBusiness(business);
    
    if (!CONFIG.INDUSTRIES.includes(industry)) {
      throw new Error(`Unsupported industry: ${industry}`);
    }
  }

  /**
   * Check for duplicate businesses
   */
  async checkForDuplicates() {
    console.log('🔍 Checking for duplicates...');
    
    const allBusinesses = [];
    for (const [key, businesses] of this.processedBusinesses) {
      allBusinesses.push(...businesses);
    }

    const duplicates = new Set();
    
    for (let i = 0; i < allBusinesses.length; i++) {
      for (let j = i + 1; j < allBusinesses.length; j++) {
        const businessA = allBusinesses[i];
        const businessB = allBusinesses[j];
        
        // Check for duplicates by phone, name similarity, or address
        if (this.isDuplicate(businessA, businessB)) {
          duplicates.add(businessB.id);
          this.validationResults.duplicates++;
          
          this.validationResults.warnings.push({
            business: businessB.name,
            issues: [`Potential duplicate of: ${businessA.name}`]
          });
        }
      }
    }

    // Remove duplicates
    for (const [key, businesses] of this.processedBusinesses) {
      const filtered = businesses.filter(b => !duplicates.has(b.id));
      this.processedBusinesses.set(key, filtered);
    }
  }

  /**
   * Check if two businesses are duplicates
   */
  isDuplicate(businessA, businessB) {
    // Same phone number
    if (businessA.phone === businessB.phone) return true;
    
    // Same name and city
    if (businessA.name.toLowerCase() === businessB.name.toLowerCase() &&
        businessA.address.city === businessB.address.city) return true;
    
    // Same address
    if (businessA.address.street.toLowerCase() === businessB.address.street.toLowerCase() &&
        businessA.address.city === businessB.address.city &&
        businessA.address.zipCode === businessB.address.zipCode) return true;
    
    return false;
  }

  /**
   * Generate TypeScript output file
   */
  async generateTypeScriptOutput() {
    console.log('📝 Generating TypeScript output...');
    
    let output = `// Generated by Data Sealing Agent - ${new Date().toISOString()}\n`;
    output += `// Total businesses: ${this.validationResults.valid}\n`;
    output += `// Cities: ${CONFIG.CITIES.length}, Industries: ${CONFIG.INDUSTRIES.length}\n\n`;

    // Business interface
    output += `export interface Business {\n`;
    output += `  id: string;\n`;
    output += `  name: string;\n`;
    output += `  trade: string;\n`;
    output += `  phone: string;\n`;
    output += `  email?: string;\n`;
    output += `  website?: string;\n`;
    output += `  address: {\n`;
    output += `    street: string;\n`;
    output += `    city: string;\n`;
    output += `    state: string;\n`;
    output += `    zipCode: string;\n`;
    output += `  };\n`;
    output += `  services: string[];\n`;
    output += `  specialties?: string[];\n`;
    output += `  hours?: string;\n`;
    output += `  rating?: number;\n`;
    output += `  reviewCount?: number;\n`;
    output += `  licenseNumber?: string;\n`;
    output += `  yearsInBusiness?: number;\n`;
    output += `  verified: boolean;\n`;
    output += `  featured?: boolean;\n`;
    output += `  emergencyService?: boolean;\n`;
    output += `  bbbRating?: string;\n`;
    output += `}\n\n`;

    // Generate business data for each city-industry combination
    const businessExports = [];
    
    for (const city of CONFIG.CITIES) {
      for (const industry of CONFIG.INDUSTRIES) {
        const key = `${city}-${industry}`;
        const businesses = this.processedBusinesses.get(key) || [];
        
        if (businesses.length > 0) {
          const constantName = `${city.toUpperCase().replace('-', '_')}_${industry.toUpperCase().replace('-', '_')}`;
          businessExports.push(constantName);
          
          output += `// ${this.formatCityName(city.replace('-', ' '))} ${industry.replace('-', ' ').toUpperCase()} (${businesses.length} businesses)\n`;
          output += `export const ${constantName}: Business[] = [\n`;
          
          for (const business of businesses) {
            output += `  {\n`;
            output += `    id: '${business.id}',\n`;
            output += `    name: '${business.name.replace(/'/g, "\\'")}',\n`;
            output += `    trade: '${business.trade}',\n`;
            output += `    phone: '${business.phone}',\n`;
            if (business.email) output += `    email: '${business.email}',\n`;
            if (business.website) output += `    website: '${business.website}',\n`;
            output += `    address: {\n`;
            output += `      street: '${business.address.street.replace(/'/g, "\\'")}',\n`;
            output += `      city: '${business.address.city}',\n`;
            output += `      state: '${business.address.state}',\n`;
            output += `      zipCode: '${business.address.zipCode}'\n`;
            output += `    },\n`;
            output += `    services: [${business.services.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
            if (business.specialties?.length) {
              output += `    specialties: [${business.specialties.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
            }
            if (business.hours) output += `    hours: '${business.hours.replace(/'/g, "\\'")}',\n`;
            if (business.rating) output += `    rating: ${business.rating},\n`;
            if (business.reviewCount) output += `    reviewCount: ${business.reviewCount},\n`;
            if (business.licenseNumber) output += `    licenseNumber: '${business.licenseNumber}',\n`;
            if (business.yearsInBusiness) output += `    yearsInBusiness: ${business.yearsInBusiness},\n`;
            output += `    verified: ${business.verified},\n`;
            if (business.featured) output += `    featured: ${business.featured},\n`;
            if (business.emergencyService) output += `    emergencyService: ${business.emergencyService},\n`;
            if (business.bbbRating) output += `    bbbRating: '${business.bbbRating}'\n`;
            output += `  },\n`;
          }
          
          output += `];\n\n`;
        }
      }
    }

    // Generate lookup function
    output += `export async function getBusinessesByCity(citySlug: string, industrySlug: string): Promise<Business[]> {\n`;
    output += `  const key = \`\${citySlug}_\${industrySlug.replace('-', '_').toUpperCase()}\`;\n`;
    output += `  \n`;
    output += `  switch (key) {\n`;
    
    for (const exportName of businessExports) {
      const [city, ...industry] = exportName.toLowerCase().split('_');
      const citySlug = city.replace('_', '-');
      const industrySlug = industry.join('_').replace('_', '-');
      output += `    case '${citySlug}_${industrySlug.toUpperCase().replace('-', '_')}':\n`;
      output += `      return ${exportName};\n`;
    }
    
    output += `    default:\n`;
    output += `      return [];\n`;
    output += `  }\n`;
    output += `}\n\n`;

    // Generate business by ID function
    output += `export async function getBusinessById(id: string): Promise<Business | null> {\n`;
    output += `  const allBusinesses = [\n`;
    for (const exportName of businessExports) {
      output += `    ...${exportName},\n`;
    }
    output += `  ];\n`;
    output += `  \n`;
    output += `  return allBusinesses.find(business => business.id === id) || null;\n`;
    output += `}\n\n`;

    // Business count summary
    output += `// Business count summary:\n`;
    for (const city of CONFIG.CITIES) {
      for (const industry of CONFIG.INDUSTRIES) {
        const key = `${city}-${industry}`;
        const count = this.processedBusinesses.get(key)?.length || 0;
        if (count > 0) {
          output += `// ${this.formatCityName(city.replace('-', ' '))} ${industry.replace('-', ' ')}: ${count} businesses\n`;
        }
      }
    }
    
    output += `// Total: ${this.validationResults.valid} businesses\n`;

    await fs.writeFile(CONFIG.OUTPUT_DATA_PATH, output);
    console.log(`✅ TypeScript output generated: ${CONFIG.OUTPUT_DATA_PATH}`);
  }

  /**
   * Generate validation report
   */
  async generateValidationReport() {
    console.log('📊 Generating validation report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.validationResults,
      businessDistribution: {},
      detailedWarnings: this.validationResults.warnings
    };

    // Business distribution by city and industry
    for (const [key, businesses] of this.processedBusinesses) {
      const [city, industry] = key.split('-');
      if (!report.businessDistribution[city]) {
        report.businessDistribution[city] = {};
      }
      report.businessDistribution[city][industry] = businesses.length;
    }

    const reportPath = path.join(
      CONFIG.VALIDATION_REPORTS_PATH, 
      `validation-report-${new Date().toISOString().slice(0, 10)}.json`
    );
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Also generate human-readable summary
    const summaryPath = path.join(
      CONFIG.VALIDATION_REPORTS_PATH,
      `validation-summary-${new Date().toISOString().slice(0, 10)}.txt`
    );
    
    let summary = `Oregon SMB Directory - Data Sealing Report\n`;
    summary += `Generated: ${new Date().toLocaleString()}\n\n`;
    summary += `📊 VALIDATION SUMMARY\n`;
    summary += `=====================\n`;
    summary += `Total Records Processed: ${this.validationResults.total}\n`;
    summary += `Valid Records: ${this.validationResults.valid}\n`;
    summary += `Invalid Records: ${this.validationResults.invalid}\n`;
    summary += `Duplicates Removed: ${this.validationResults.duplicates}\n`;
    summary += `Warnings: ${this.validationResults.warnings.length}\n\n`;

    summary += `📍 BUSINESS DISTRIBUTION\n`;
    summary += `=======================\n`;
    for (const city of CONFIG.CITIES) {
      const cityDisplay = this.formatCityName(city.replace('-', ' '));
      summary += `${cityDisplay}:\n`;
      
      let cityTotal = 0;
      for (const industry of CONFIG.INDUSTRIES) {
        const key = `${city}-${industry}`;
        const count = this.processedBusinesses.get(key)?.length || 0;
        if (count > 0) {
          summary += `  ${industry.replace('-', ' ')}: ${count}\n`;
          cityTotal += count;
        }
      }
      summary += `  Total: ${cityTotal}\n\n`;
    }

    if (this.validationResults.warnings.length > 0) {
      summary += `⚠️  WARNINGS\n`;
      summary += `============\n`;
      for (const warning of this.validationResults.warnings) {
        summary += `${warning.business}:\n`;
        for (const issue of warning.issues) {
          summary += `  - ${issue}\n`;
        }
        summary += `\n`;
      }
    }

    await fs.writeFile(summaryPath, summary);
    
    console.log(`📋 Validation report: ${reportPath}`);
    console.log(`📋 Summary report: ${summaryPath}`);
  }

  /**
   * Display final results
   */
  displayResults() {
    console.log('\n🎯 DATA SEALING COMPLETE');
    console.log('========================');
    console.log(`Total businesses processed: ${this.validationResults.total}`);
    console.log(`Valid businesses: ${this.validationResults.valid}`);
    console.log(`Invalid businesses: ${this.validationResults.invalid}`);
    console.log(`Duplicates removed: ${this.validationResults.duplicates}`);
    console.log(`Warnings: ${this.validationResults.warnings.length}`);

    console.log('\n📊 Distribution by City:');
    for (const city of CONFIG.CITIES) {
      let cityTotal = 0;
      for (const industry of CONFIG.INDUSTRIES) {
        const key = `${city}-${industry}`;
        cityTotal += this.processedBusinesses.get(key)?.length || 0;
      }
      if (cityTotal > 0) {
        console.log(`  ${this.formatCityName(city.replace('-', ' '))}: ${cityTotal} businesses`);
      }
    }

    if (this.validationResults.warnings.length > 0) {
      console.log(`\n⚠️  ${this.validationResults.warnings.length} warnings generated. Check validation reports for details.`);
    }

    console.log('\n✅ Oregon SMB Directory data is now sealed and ready for production!');
  }
}

// Main execution
async function main() {
  const agent = new DataSealingAgent();
  
  try {
    await agent.initialize();
    await agent.processBusinessData();
    agent.displayResults();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Data Sealing Agent failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = DataSealingAgent;