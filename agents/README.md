# Oregon SMB Directory - Data Sealing Agent

## Overview

The **Data Sealing Agent** is a specialized business data validation and integration tool designed to process 1000+ real Oregon business listings and replace fake sample data in the Oregon SMB Directory application.

## Purpose

- ✅ **Validate** business data against Oregon business standards
- 🔍 **Check** for duplicate listings across cities and industries  
- 📞 **Verify** phone numbers and addresses for Oregon businesses
- 🏗️ **Transform** collected data to match TypeScript Business interface
- 📊 **Generate** validation reports and backup data
- 🎯 **Ensure** proper city/industry mapping (6 cities × 6 industries)

## Supported Data Structure

### Cities (6 total)
- Grants Pass
- Medford  
- Roseburg
- Eugene
- Salem
- Portland

### Industries (6 total)
- Lawfirms
- Roofers
- Real Estate
- General Contractors
- Plumbers
- Electricians

## Business Interface

The agent transforms data to match this TypeScript interface:

```typescript
interface Business {
  id: string;                    // Auto-generated unique ID
  name: string;                  // Business name
  trade: string;                 // Professional trade/category
  phone: string;                 // Formatted phone number
  email?: string;                // Email address (optional)
  website?: string;              // Website URL (optional)
  address: {
    street: string;              // Street address
    city: string;                // Oregon city (must match supported cities)
    state: 'OR';                 // Always Oregon
    zipCode: string;             // 5 or 9 digit ZIP code
  };
  services: string[];            // List of services offered
  specialties?: string[];        // Business specialties (optional)
  hours?: string;                // Operating hours (optional)
  rating?: number;               // Customer rating (optional)
  reviewCount?: number;          // Number of reviews (optional)
  licenseNumber?: string;        // Professional license number (optional)
  yearsInBusiness?: number;      // Years in operation (optional)
  verified: boolean;             // Verification status
  featured?: boolean;            // Featured listing flag (optional)
  emergencyService?: boolean;    // Emergency service availability (optional)
  bbbRating?: string;           // BBB rating (optional)
}
```

## Usage

### 1. Prepare Your Business Data

Create a JSON file with your collected business data in the `raw-business-data/` directory. Supported filenames:
- `businesses.json`
- `oregon-businesses.json`
- `collected-data.json`

**Sample Business Record:**
```json
{
  "name": "Example Electric Company",
  "phone": "(503) 555-0123",
  "email": "info@example-electric.com",
  "website": "www.example-electric.com",
  "address": {
    "street": "123 Main Street",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97205"
  },
  "industry": "electricians",
  "services": [
    "Residential Electrical",
    "Commercial Electrical", 
    "Emergency Repairs"
  ],
  "licenseNumber": "123456",
  "yearsInBusiness": 15,
  "emergencyService": true,
  "hours": "Mon-Fri: 7AM-5PM",
  "specialties": ["Smart Home Systems", "Panel Upgrades"],
  "bbbRating": "A+",
  "rating": 4.8,
  "reviewCount": 47,
  "featured": false
}
```

### 2. Run the Data Sealing Agent

From the project root directory:

```bash
# Make sure you're in the project root
cd /home/mikes/oregon-smb-directory-app

# Run the data sealing agent
node agents/data-sealing-agent.js
```

Or run directly:
```bash
./agents/data-sealing-agent.js
```

### 3. Review Results

The agent will generate:

- **Updated `lib/data/businesses.ts`** - Production-ready business data
- **Backup files** in `data-backups/` - Original data preservation
- **Validation reports** in `validation-reports/` - Detailed analysis
- **Console output** - Real-time processing status

## Validation Features

### Phone Number Validation
- ✅ Oregon area codes: 503, 971, 458, 541
- ✅ Proper formatting: (xxx) xxx-xxxx
- ✅ 10-11 digit validation

### Address Validation  
- ✅ Oregon ZIP codes (97xxx format)
- ✅ Supported city names
- ✅ Complete address fields

### Duplicate Detection
- 🔍 Phone number matching
- 🔍 Business name + city matching  
- 🔍 Address matching
- 🔍 Automatic duplicate removal

### Data Quality Checks
- ✅ Required field validation
- ✅ Email format validation
- ✅ Website URL formatting
- ✅ Industry classification
- ✅ License number format

## Output Structure

The agent generates businesses organized by city and industry:

```typescript
// Example output constants
export const PORTLAND_ELECTRICIANS: Business[] = [ /* businesses */ ];
export const MEDFORD_PLUMBERS: Business[] = [ /* businesses */ ];
export const EUGENE_ROOFERS: Business[] = [ /* businesses */ ];
// ... etc for all city-industry combinations
```

## Error Handling

The agent provides comprehensive error reporting:

- **Invalid Records**: Businesses missing required fields
- **Duplicate Warnings**: Potential duplicate business listings  
- **Non-Oregon Data**: Businesses outside Oregon
- **Format Errors**: Invalid phone numbers, ZIP codes, etc.

## Generated Reports

### Validation Summary
```
Oregon SMB Directory - Data Sealing Report
Generated: [timestamp]

📊 VALIDATION SUMMARY
=====================
Total Records Processed: 1000
Valid Records: 950
Invalid Records: 45
Duplicates Removed: 5
Warnings: 15

📍 BUSINESS DISTRIBUTION
=======================
Portland:
  electricians: 25
  plumbers: 18
  roofers: 12
  Total: 55

[... etc for all cities]
```

### JSON Report
Detailed JSON report with:
- Processing statistics
- Business distribution by city/industry
- Warning details and resolution suggestions

## Directory Structure

After running the agent:

```
oregon-smb-directory-app/
├── agents/
│   ├── data-sealing-agent.js     # Main agent script
│   └── README.md                 # This documentation
├── raw-business-data/            # Input data directory
│   ├── businesses.json           # Your business data
│   └── sample-business-structure.json # Generated sample
├── data-backups/                 # Backup directory
│   └── businesses-backup-[date].ts
├── validation-reports/           # Report directory  
│   ├── validation-report-[date].json
│   └── validation-summary-[date].txt
└── lib/data/
    └── businesses.ts            # Updated production data
```

## Integration with Next.js App

The generated `businesses.ts` file integrates seamlessly with the existing Next.js application:

- **Dynamic routing**: `/[city]/[industry]` pages automatically load business data
- **Search functionality**: Business lookup by ID and filtering
- **Type safety**: Full TypeScript support with Business interface
- **Performance**: Static generation with pre-built business constants

## Troubleshooting

### No Data Found Error
```
❌ No business data found in raw-business-data/

Please add your collected business data in one of these formats:
- businesses.json
- oregon-businesses.json  
- collected-data.json
```

**Solution**: Create a JSON file with your business data in the `raw-business-data/` directory.

### Invalid Business Records
Check the validation report for specific issues:
- Missing required fields (name, phone, address, etc.)
- Invalid Oregon ZIP codes or area codes
- Unsupported cities or industries

### Duplicate Warnings
The agent automatically removes duplicates but logs warnings for review. Check:
- Same phone numbers across businesses
- Similar business names in the same city
- Identical addresses

## Next Steps

After successful data sealing:

1. **Review validation reports** for any warnings or issues
2. **Test the Next.js application** with real business data
3. **Deploy updated businesses.ts** to production
4. **Monitor application performance** with real data loads
5. **Set up regular data updates** as new businesses are added

## Support

For issues with the Data Sealing Agent:
1. Check validation reports for specific error details
2. Verify input data format matches sample structure
3. Ensure all required fields are present in source data
4. Contact LEVERAGEAI LLC for advanced troubleshooting

---

**Generated by**: LEVERAGEAI LLC Data Sealing Agent  
**Version**: 1.0.0  
**Date**: 2025-08-11