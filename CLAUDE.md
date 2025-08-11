# CLAUDE.md - Oregon SMB Directory Project

## Project Overview
Complete Oregon Small Business Directory covering the I-5 corridor from Portland to Ashland with real, verified business listings.

## Critical Requirements
- **NO SAMPLE DATA** - All business listings must be real, verified businesses
- Real contact information, addresses, phone numbers
- Verified licensing and business credentials
- Actual service offerings and specialties

## Data Structure Requirements

### Cities (6 Required)
- Grants Pass
- Medford  
- Roseburg
- Eugene
- Salem
- Portland

### Industries (6 Required)
- Lawfirms
- Roofers
- Real Estate
- General Contractors  
- Plumbers
- Electricians

## Business Data Fields (ALL REQUIRED)
```typescript
interface Business {
  id: string;
  name: string;          // REAL business name
  phone: string;         // REAL phone number
  website?: string;      // REAL website URL
  email?: string;        // REAL email address
  address: {
    street: string;      // REAL street address
    city: string;        // Must match one of 6 cities
    state: 'OR';         // Oregon only
    zipCode: string;     // REAL zip code
  };
  services: string[];    // REAL services offered
  licenseNumber?: string; // REAL license if applicable
  yearsInBusiness?: number; // ACTUAL years
  verified: boolean;     // Must verify each business
  rating?: number;       // Real customer ratings
  reviewCount?: number;  // Actual review count
}
```

## Data Sources to Use
1. **Oregon Secretary of State Business Registry**
2. **Oregon Construction Contractors Board (CCB)**
3. **Oregon State Bar for Legal Services**
4. **Local Chamber of Commerce listings**
5. **Google Business listings with verification**
6. **Yelp business data**
7. **Yellow Pages verified listings**

## Quality Assurance Requirements
- Verify each business exists and is operational
- Confirm phone numbers are current
- Validate addresses through mapping services
- Check business licenses where applicable
- Ensure no duplicate listings

## Deployment Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Type checking
npm run type-check
```

## File Structure
```
/oregon-smb-directory-app/
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/data/              # Data management (REAL DATA ONLY)
│   ├── businesses.ts      # Real business listings
│   ├── cities.ts          # City configurations
│   └── industries.ts      # Industry definitions
└── CLAUDE.md              # This file
```

## Admin Panel
- URL: `/admin`
- Password: admin123 (CHANGE FOR PRODUCTION)
- Features: Blog management, comment moderation

## Blog System
- Industry-focused content
- Comment system with moderation
- SEO optimized articles

## SEO Requirements Met
- Server-side rendering
- Static generation for all pages
- Modal content pre-rendered in DOM for crawlers
- Structured data for business listings
- Meta tags for all pages

## Next Phase: Real Data Integration
🚨 **CRITICAL**: Replace ALL sample data with verified, real Oregon businesses across specified cities and industries.

## Contact for Real Data Needs
- Use data-gathering specialists
- Verify business information accuracy
- Ensure compliance with business listing standards