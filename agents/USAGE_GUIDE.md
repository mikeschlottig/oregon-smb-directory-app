# Oregon SMB Directory - Data Sealing Agent Usage Guide

## Quick Start

### 1. Prepare Your Business Data
Add your collected Oregon business data to the `raw-business-data/` directory:

```bash
# Create businesses.json with your data
nano raw-business-data/businesses.json
```

### 2. Run the Data Sealing Agent
```bash
# From project root directory
cd /home/mikes/oregon-smb-directory-app
node agents/data-sealing-agent.js
```

### 3. Check Results
- **Updated data**: `lib/data/businesses.ts`  
- **Validation report**: `validation-reports/validation-summary-[date].txt`
- **Backup**: `data-backups/businesses-backup-[timestamp].ts`

## Example Business Record Format

```json
{
  "name": "Your Business Name",
  "phone": "503-555-0123",
  "email": "contact@yourbusiness.com",
  "website": "www.yourbusiness.com",
  "address": {
    "street": "123 Your Street",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97205"
  },
  "industry": "electricians",
  "services": [
    "Service 1",
    "Service 2"
  ],
  "licenseNumber": "YOUR123",
  "yearsInBusiness": 15,
  "emergencyService": true,
  "hours": "Mon-Fri: 8AM-5PM"
}
```

## Supported Cities
- Grants Pass
- Medford  
- Roseburg
- Eugene
- Salem
- Portland

## Supported Industries  
- electricians
- plumbers
- roofers
- general-contractors
- lawfirms
- real-estate

## Validation Features

✅ **Oregon Business Validation**
- Phone numbers (503, 971, 458, 541 area codes)
- ZIP codes (97xxx format)
- Required fields check

✅ **Duplicate Detection**
- Same phone number
- Same business name + city
- Same address

✅ **Data Transformation**
- Consistent formatting
- TypeScript interface compliance
- Unique ID generation

## Common Issues & Solutions

### "No business data found"
```bash
# Make sure you have a data file in raw-business-data/
ls raw-business-data/
# Should contain: businesses.json or oregon-businesses.json
```

### "Invalid businesses" 
Check validation report for specific issues:
- Missing required fields (name, phone, address)
- Invalid phone numbers or ZIP codes
- Unsupported cities or industries

### Duplicate warnings
The agent automatically removes duplicates but logs them for review.

## Generated Output Structure

The agent creates businesses organized by city-industry combinations:

```typescript
export const PORTLAND_ELECTRICIANS: Business[] = [
  // All Portland electricians here
];

export const MEDFORD_PLUMBERS: Business[] = [
  // All Medford plumbers here  
];

// Lookup function
export async function getBusinessesByCity(citySlug: string, industrySlug: string): Promise<Business[]>
```

## Files Created/Updated

- `lib/data/businesses.ts` - Main business data (replaces sample data)
- `data-backups/businesses-backup-[timestamp].ts` - Original data backup
- `validation-reports/validation-report-[date].json` - Detailed JSON report
- `validation-reports/validation-summary-[date].txt` - Human-readable summary

## Integration with Next.js App

The updated `businesses.ts` file automatically integrates with:
- **Dynamic routing**: `/[city]/[industry]` pages
- **Business search**: By ID and filtering
- **Type safety**: Full TypeScript support
- **Static generation**: Pre-built business constants

## Testing the Integration

After running the Data Sealing Agent, test your data integration:

```bash
# Start the Next.js development server
npm run dev

# Visit generated pages with your business data:
# http://localhost:3000/portland/electricians
# http://localhost:3000/medford/roofers
# etc.
```

## Production Deployment

1. ✅ Run Data Sealing Agent with real business data
2. ✅ Review validation reports and fix any issues
3. ✅ Test Next.js app with real data
4. ✅ Deploy updated `lib/data/businesses.ts` to production
5. ✅ Monitor application performance with real data loads

---

**Need Help?** Check the validation reports first, then contact LEVERAGEAI LLC for advanced troubleshooting.