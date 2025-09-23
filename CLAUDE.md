# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Oregon SMB Directory - A dual-architecture business directory covering the I-5 corridor from Portland to Ashland. The project maintains both a Next.js static site and a Cloudflare Worker implementation, with the Worker currently being the active deployment.

## Architecture

### Dual Deployment System
- **Primary**: Cloudflare Worker (`src/index.ts`) - Production deployment
- **Secondary**: Next.js App Router (`app/`) - Static site fallback option
- **Database**: Cloudflare D1 with full business data (2,482+ businesses)
- **Data Sources**: Large dataset in `raw-business-data/businesses.json`, minimal subset in `lib/data/businesses.ts`

### Key Architectural Decisions
- Worker uses TypeScript with D1 database for dynamic business listings
- Next.js configured for static export (`output: 'export'`) with Cloudflare Pages compatibility
- Database-first approach with businesses stored in D1, queried dynamically
- Blog system integrated into Worker with full CMS capabilities

## Development Workflow Rules

### CRITICAL: Testing Order Protocol
1. **Local Testing First**: Always test data flow and functionality locally with wrangler dev
2. **GitHub Commit**: Only commit after local verification of data integrity
3. **Cloudflare Deployment**: Deploy only after GitHub commit and local validation
4. **Never skip local testing**: Database changes must be verified locally before deployment

## Development Commands

### Cloudflare Worker (Primary)
```bash
# Local development
wrangler dev

# Deploy to development
wrangler deploy

# Deploy to production
wrangler deploy --env production

# View production logs
wrangler tail --env production

# Generate TypeScript bindings
wrangler types
```

### Next.js Application (Secondary)
```bash
# Development server
npm run dev

# Build static site
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Type checking
npm run type-check

# Linting
npm run lint
```

### Database Operations
```bash
# Create D1 database tables
wrangler d1 execute oregon-smb-directory --file=schema.sql

# Import business data
node import-data.js

# Query database
wrangler d1 execute oregon-smb-directory --command="SELECT COUNT(*) FROM businesses"
```

## Critical Data Integration Issue

### Current State
- **Available Data**: 2,482 businesses in `raw-business-data/businesses.json`
- **Currently Used**: 8 businesses in `lib/data/businesses.ts`
- **Database Schema**: Ready for full dataset in D1 (`schema.sql`)
- **Import Script**: Available (`import-data.js`)

### Required Integration
The Worker is designed to use D1 database but may fall back to TypeScript data. Full data integration requires:
1. Import all 2,482 businesses into D1 database
2. Verify D1 queries are working in Worker
3. Ensure 30+ listings per industry per city requirement is met

## File Structure

### Core Application Files
- `src/index.ts` - Cloudflare Worker (primary implementation)
- `wrangler.toml` - Worker configuration with D1 bindings
- `schema.sql` - D1 database schema for businesses and blog posts
- `import-data.js` - Script to import business data into D1

### Data Management
- `lib/data/cities.ts` - City definitions (6 cities)
- `lib/data/industries.ts` - Industry categories (6 industries)
- `lib/data/businesses.ts` - Minimal business subset (8 businesses)
- `raw-business-data/businesses.json` - Complete dataset (2,482 businesses)

### Next.js Application (Fallback)
- `app/` - Next.js App Router pages
- `components/` - React components
- `next.config.mjs` - Static export configuration

## Key Features

### Business Directory
- **6 Cities**: Portland, Salem, Eugene, Medford, Grants Pass, Roseburg
- **6 Industries**: Electricians, Plumbers, Roofers, General Contractors, Lawyers, Real Estate
- **Dynamic Routing**: `/{city}/{industry}` pattern
- **Database Integration**: D1 queries with fallback to TypeScript data

### Blog System
- **Admin Interface**: `/admin` (password: admin123)
- **Content Management**: Full CRUD operations for blog posts
- **SEO Features**: Meta tags, slugs, published/draft status
- **API Endpoints**: `/admin/save-post` for content management

### Worker-Specific Features
- **D1 Integration**: `getBusinessesFromD1()` for database queries
- **Blog Management**: `getBlogPosts()`, `saveBlogPost()` functions
- **Error Handling**: Database fallbacks and proper error responses
- **Environment Bindings**: D1 database binding configured in `wrangler.toml`

## Database Schema

### Businesses Table
```sql
- id (PRIMARY KEY)
- name, city, industry
- services (JSON array as text)
- verified, website, phone, address, email
- rating, reviewCount, yearsInBusiness
- licenseNumber, bbbRating, emergencyService
```

### Blog Posts Table
```sql
- id, title, slug, content, excerpt
- status (published/draft)
- meta_title, meta_description, tags
- created_at, updated_at, published_at
```

## Configuration Files

### Worker Configuration (`wrangler.toml`)
- **D1 Binding**: `oregon-smb-directory` database
- **Production Routes**: Custom domain mapping
- **Environment Variables**: Production/development separation

### Next.js Configuration (`next.config.mjs`)
- **Static Export**: Configured for Cloudflare Pages
- **Image Optimization**: Disabled for static compatibility
- **Trailing Slash**: Enabled for consistent routing

## Testing and Quality Assurance

### Before Deployment
1. Test homepage routing (both `/` and `` paths)
2. Verify city pages load correctly
3. Check industry pages show proper business counts
4. Test D1 database connectivity
5. Validate mobile responsiveness (375px minimum)
6. Confirm blog admin functionality

### Common Issues
- **Homepage 404**: Check both `normalizedPath === '/'` and `normalizedPath === ''`
- **Empty Business Lists**: Verify D1 data import and database queries
- **Admin Access**: Default password is `admin123` (change for production)
- **Database Errors**: Check D1 binding configuration in `wrangler.toml`

## Performance Considerations
- **D1 Queries**: Limited to 50 businesses per request with proper indexing
- **Static Fallback**: Next.js build generates all city/industry combinations
- **Caching**: Worker responses cacheable, database queries optimized
- **Error Boundaries**: Graceful degradation when database unavailable

## Security Notes
- **Blog Admin**: Password-protected admin interface
- **Database**: Parameterized queries prevent SQL injection
- **CORS**: Configured for static site compatibility
- **Input Validation**: All user inputs sanitized and validated

## Dependencies
- **Runtime**: Node.js 18.17.0+
- **Cloudflare**: Wrangler 3.0+, D1 database
- **Next.js**: Version 15.4.6 with TypeScript
- **UI**: Tailwind CSS, Lucide React icons