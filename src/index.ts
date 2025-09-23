/**
 * Oregon SMB Directory - Cloudflare Worker
 * Dynamic business directory for I-5 corridor
 */

import { INDUSTRIES } from '../lib/data/industries';
import { CITIES } from '../lib/data/cities';
import { getBusinessesByCity } from '../lib/data/businesses';

// Business interface matching D1 database schema
interface Business {
  id: string;
  name: string;
  city: string;
  state: string;
  industry: string;
  services: string; // JSON string in database
  verified: boolean;
  website: string | null;
  yearsInBusiness: number | null;
  phone: string | null;
  address: string | null;
  email: string | null;
  rating: number | null;
  reviewCount: number | null;
  licenseNumber: string | null;
  bbbRating: string | null;
  emergencyService: boolean;
}

// Blog post interface matching D1 database schema
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  featured_image: string | null;
  author: string | null;
  tags: string | null; // JSON string in database
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// Convert TypeScript business data to D1 Business format
function convertTSBusinessToD1(tsBusiness: any): Business {
  // Map trade names to industry slugs
  const tradeToIndustryMap: { [key: string]: string } = {
    'Electrician': 'electricians',
    'Plumber': 'plumbers',
    'Roofer': 'roofers',
    'General Contractor': 'general-contractors',
    'Attorney': 'lawfirms',
    'Real Estate Agent': 'real-estate'
  };

  const industrySlug = tradeToIndustryMap[tsBusiness.trade] || tsBusiness.trade.toLowerCase().replace(' ', '-');

  return {
    id: tsBusiness.id,
    name: tsBusiness.name,
    city: tsBusiness.address.city,
    state: tsBusiness.address.state,
    industry: industrySlug,
    services: JSON.stringify(tsBusiness.services),
    verified: tsBusiness.verified,
    website: tsBusiness.website || null,
    yearsInBusiness: tsBusiness.yearsInBusiness || null,
    phone: tsBusiness.phone || null,
    address: `${tsBusiness.address.street}, ${tsBusiness.address.city}, ${tsBusiness.address.state} ${tsBusiness.address.zipCode}`,
    email: tsBusiness.email || null,
    rating: tsBusiness.rating || null,
    reviewCount: tsBusiness.reviewCount || null,
    licenseNumber: tsBusiness.licenseNumber || null,
    bbbRating: tsBusiness.bbbRating || null,
    emergencyService: tsBusiness.emergencyService || false
  };
}

// Get businesses with D1 + TypeScript fallback
async function getBusinessesWithFallback(db: D1Database, citySlug: string, industrySlug: string, limit: number = 50): Promise<Business[]> {
  let businesses: Business[] = [];

  // First try D1 database
  try {
    const cityName = CITIES.find(c => c.slug === citySlug)?.name || citySlug;
    console.log(`Querying D1 for city: ${cityName}, industry: ${industrySlug}`);

    const stmt = db.prepare(`
      SELECT * FROM businesses
      WHERE LOWER(city) = LOWER(?)
      AND LOWER(industry) = LOWER(?)
      AND verified = 1
      ORDER BY rating DESC NULLS LAST, reviewCount DESC NULLS LAST, yearsInBusiness DESC NULLS LAST
      LIMIT ?
    `);

    const result = await stmt.bind(cityName, industrySlug, limit).all();
    businesses = result.results as Business[];

    console.log(`D1 query returned ${businesses.length} businesses for ${cityName}/${industrySlug}`);
  } catch (error) {
    console.error('D1 database query error:', error);
  }

  // If D1 returns no results, try TypeScript fallback data
  if (businesses.length === 0) {
    console.log(`No D1 results found, trying TypeScript fallback for ${citySlug}/${industrySlug}`);
    try {
      const tsBusinesses = await getBusinessesByCity(citySlug, industrySlug);
      businesses = tsBusinesses.map(convertTSBusinessToD1);
      console.log(`TypeScript fallback returned ${businesses.length} businesses`);
    } catch (error) {
      console.error('TypeScript fallback error:', error);
    }
  }

  return businesses;
}

// Blog database functions
async function getBlogPosts(db: D1Database, status: string = 'published', limit: number = 10): Promise<BlogPost[]> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM blog_posts 
      WHERE status = ?
      ORDER BY published_at DESC, created_at DESC
      LIMIT ?
    `);
    
    const result = await stmt.bind(status, limit).all();
    return result.results as BlogPost[];
  } catch (error) {
    console.error('Blog query error:', error);
    return [];
  }
}

async function getBlogPostBySlug(db: D1Database, slug: string): Promise<BlogPost | null> {
  try {
    const stmt = db.prepare(`SELECT * FROM blog_posts WHERE slug = ? LIMIT 1`);
    const result = await stmt.bind(slug).first();
    return result as BlogPost | null;
  } catch (error) {
    console.error('Blog query error:', error);
    return null;
  }
}

async function saveBlogPost(db: D1Database, post: Partial<BlogPost>): Promise<string> {
  try {
    const id = post.id || crypto.randomUUID();
    const now = new Date().toISOString();

    if (post.id) {
      // Update existing post
      const stmt = db.prepare(`
        UPDATE blog_posts
        SET title = ?, slug = ?, content = ?, excerpt = ?, status = ?,
            tags = ?, meta_title = ?, meta_description = ?, updated_at = ?,
            published_at = CASE WHEN status = 'published' AND published_at IS NULL THEN ? ELSE published_at END
        WHERE id = ?
      `);

      await stmt.bind(
        post.title, post.slug, post.content, post.excerpt, post.status,
        post.tags, post.meta_title, post.meta_description, now, now, id
      ).run();
    } else {
      // Create new post
      const stmt = db.prepare(`
        INSERT INTO blog_posts (id, title, slug, content, excerpt, status, tags, meta_title, meta_description, created_at, updated_at, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const publishedAt = post.status === 'published' ? now : null;
      await stmt.bind(
        id, post.title, post.slug, post.content, post.excerpt, post.status,
        post.tags, post.meta_title, post.meta_description, now, now, publishedAt
      ).run();
    }

    return id;
  } catch (error) {
    console.error('Blog save error:', error);
    throw error;
  }
}

// Contact form database functions
async function saveContactSubmission(db: D1Database, submission: ContactSubmission): Promise<number> {
  try {
    const stmt = db.prepare(`
      INSERT INTO contact_submissions (name, email, phone, company, inquiry_type, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(
      submission.name,
      submission.email,
      submission.phone || null,
      submission.company || null,
      submission.inquiry_type || null,
      submission.message
    ).run();

    return result.meta.last_row_id as number;
  } catch (error) {
    console.error('Contact submission save error:', error);
    throw error;
  }
}

// Business listing submission database functions
async function saveListingSubmission(db: D1Database, submission: ListingSubmission): Promise<number> {
  try {
    const stmt = db.prepare(`
      INSERT INTO listing_submissions (
        business_name, owner_name, email, phone, website, address, city,
        industry, services, years_in_business, license_number, listing_plan, emergency_service
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(
      submission.business_name,
      submission.owner_name,
      submission.email,
      submission.phone,
      submission.website || null,
      submission.address,
      submission.city,
      submission.industry,
      submission.services,
      submission.years_in_business || null,
      submission.license_number || null,
      submission.listing_plan,
      submission.emergency_service || false
    ).run();

    return result.meta.last_row_id as number;
  } catch (error) {
    console.error('Listing submission save error:', error);
    throw error;
  }
}

// Contact submission interface
interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiry_type?: string;
  message: string;
  submitted_at?: string;
  status?: string;
}

// Business listing submission interface
interface ListingSubmission {
  id?: number;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  industry: string;
  services: string;
  years_in_business?: number;
  license_number?: string;
  listing_plan: string;
  emergency_service?: boolean;
  submitted_at?: string;
  status?: string;
}

export interface Env {
  DB: D1Database;
}

// City data is now imported from lib/data/cities.ts

// Industry data is now imported from lib/data/industries.ts

// Business data is now imported from lib/data/businesses.ts

function getHomePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oregon SMB Directory - Find Local Businesses Along I-5</title>
    <meta name="description" content="Complete directory of verified businesses from Portland to Ashland along the I-5 corridor.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; }
        .hero { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 4rem 2rem; text-center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .card:hover { transform: translateY(-2px); }
        .icon { font-size: 2rem; margin-bottom: 1rem; }
        a { color: #4F46E5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .stat { background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Oregon's Complete Business Directory</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Find verified local businesses along the entire I-5 corridor from Portland to Ashland</p>
            <div class="stats">
                <div class="stat">
                    <div style="font-size: 2rem; font-weight: bold;">50+</div>
                    <div>Cities Covered</div>
                </div>
                <div class="stat">
                    <div style="font-size: 2rem; font-weight: bold;">14</div>
                    <div>Industries</div>
                </div>
                <div class="stat">
                    <div style="font-size: 2rem; font-weight: bold;">700+</div>
                    <div>Business Pages</div>
                </div>
                <div class="stat">
                    <div style="font-size: 2rem; font-weight: bold;">100%</div>
                    <div>Verified</div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container">
        <h2 style="text-align: center; margin: 3rem 0 1rem;">Major Cities</h2>
        <div class="grid">
            ${CITIES.map(city => `
                <div class="card">
                    <h3>${city.name}</h3>
                    <p>${city.county} County</p>
                    <a href="/${city.slug}">View Businesses →</a>
                </div>
            `).join('')}
        </div>
        
        <h2 style="text-align: center; margin: 3rem 0 1rem;">Popular Industries</h2>
        <div class="grid">
            ${INDUSTRIES.map(industry => `
                <div class="card" style="text-align: center;">
                    <div class="icon">${industry.icon}</div>
                    <h3>${industry.name}</h3>
                    <a href="/portland/${industry.slug}">View Directory →</a>
                </div>
            `).join('')}
        </div>
    </div>
    
    <footer style="background: #1f2937; color: white; padding: 3rem 2rem;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Oregon SMB Directory</h4>
                    <p style="color: #9ca3af;">Your trusted directory for finding verified Oregon businesses along the I-5 corridor.</p>
                    <p style="color: #9ca3af; margin-top: 1rem;">
                        <strong>Phone:</strong> (541) 450-2082<br>
                        <strong>Email:</strong> contact@oregonsmbdirectory.com
                    </p>
                </div>

                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Major Cities</h4>
                    <a href="/portland" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Portland</a>
                    <a href="/salem" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Salem</a>
                    <a href="/eugene" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Eugene</a>
                    <a href="/medford" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Medford</a>
                    <a href="/grants-pass" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Grants Pass</a>
                    <a href="/roseburg" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Roseburg</a>
                </div>

                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Business Services</h4>
                    <a href="/get-listed" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Get Listed</a>
                    <a href="/blog" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Blog & Resources</a>
                    <a href="/contact" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Contact Us</a>
                    <a href="/about" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">About Us</a>
                </div>

                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Legal</h4>
                    <a href="/privacy" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Privacy Policy</a>
                    <a href="/faq" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">FAQ</a>
                    <a href="/contact" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Support</a>
                </div>
            </div>

            <div style="border-top: 1px solid #374151; margin-top: 2rem; padding-top: 2rem; text-align: center; color: #9ca3af;">
                <p>&copy; 2025 Oregon SMB Directory. Powered by LEVERAGEAI LLC. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

function getCityPage(city: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${city.name} Business Directory - Oregon SMB Directory</title>
    <meta name="description" content="Find verified businesses in ${city.name}, Oregon. Complete directory of local services.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; }
        .hero { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 3rem 2rem; text-center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.2s; text-align: center; }
        .card:hover { transform: translateY(-2px); }
        .icon { font-size: 3rem; margin-bottom: 1rem; }
        a { color: #4F46E5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { margin-right: 0.5rem; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>${city.name}</strong>
        </div>
    </div>
    
    <div class="hero">
        <div class="container">
            <h1>${city.name} Business Directory</h1>
            <p>Discover verified local businesses in ${city.name}, ${city.county} County</p>
        </div>
    </div>
    
    <div class="container">
        <h2 style="text-align: center; margin: 3rem 0 1rem;">Business Categories in ${city.name}</h2>
        <div class="grid">
            ${INDUSTRIES.map(industry => `
                <div class="card">
                    <div class="icon">${industry.icon}</div>
                    <h3>${industry.name}</h3>
                    <a href="/${city.slug}/${industry.slug}">View Directory →</a>
                </div>
            `).join('')}
        </div>
    </div>
    ${getFooter()}
</body>
</html>`;
}

function getIndustryPage(city: any, industry: any, businesses: any[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${industry.name} in ${city.name}, Oregon - Oregon SMB Directory</title>
    <meta name="description" content="Find verified ${industry.name.toLowerCase()} in ${city.name}. Compare ratings, services, and contact information.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; }
        .hero { background: linear-gradient(135deg, #F59E0B, #F97316); color: white; padding: 3rem 2rem; text-center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .business-card { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s; }
        .business-card:hover { transform: translateY(-4px); }
        .card-header { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 1.5rem; }
        .card-body { padding: 1.5rem; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; margin: 1rem 0; }
        .service { background: #f3f4f6; padding: 0.5rem; border-radius: 4px; font-size: 0.9rem; }
        .badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
        .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; }
        .badge-verified { background: #10b981; color: white; }
        .badge-emergency { background: #ef4444; color: white; }
        .badge-bbb { background: #16a34a; color: white; }
        .actions { display: flex; gap: 1rem; margin-top: 1rem; }
        .btn { padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600; text-align: center; }
        .btn-primary { background: #4F46E5; color: white; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        a { color: #4F46E5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { margin-right: 0.5rem; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › 
            <a href="/${city.slug}">${city.name}</a> › 
            <strong>${industry.name}</strong>
        </div>
    </div>
    
    <div class="hero">
        <div class="container">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${industry.icon}</div>
            <h1>${industry.name} in ${city.name}</h1>
            <p>${businesses.length} verified ${industry.name.toLowerCase()} serving ${city.name} and surrounding areas</p>
        </div>
    </div>
    
    <div class="container">
        <h2 style="margin: 3rem 0 1rem;">${industry.name} in ${city.name}</h2>
        <p style="color: #6b7280; margin-bottom: 2rem;">${businesses.length} businesses found</p>
        
        ${businesses.length > 0 ? `
            <div class="grid">
                ${businesses.map(business => {
                    // Parse services JSON string
                    let services = [];
                    try {
                        services = typeof business.services === 'string' ? JSON.parse(business.services) : business.services || [];
                    } catch (e) {
                        services = [];
                    }

                    return `
                    <div class="business-card">
                        <div class="card-header">
                            <div style="display: flex; justify-content: between; align-items: start;">
                                <div>
                                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">${business.name}</h3>
                                    <p style="margin: 0; opacity: 0.9;">Licensed ${business.industry}</p>
                                </div>
                                ${business.rating ? `
                                    <div style="background: rgba(255,255,255,0.2); padding: 0.5rem; border-radius: 6px; text-align: center;">
                                        <div>⭐ ${business.rating}</div>
                                        <div style="font-size: 0.8rem;">(${business.reviewCount})</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div class="card-body">
                            <div style="margin-bottom: 1rem;">
                                ${business.phone ? `<p><strong>📞</strong> ${business.phone}</p>` : ''}
                                ${business.address ? `<p><strong>📍</strong> ${business.address}</p>` : ''}
                                ${business.website ? `<p><strong>🌐</strong> <a href="${business.website.startsWith('http') ? business.website : 'https://' + business.website}" target="_blank">${business.website}</a></p>` : ''}
                                ${business.email ? `<p><strong>✉️</strong> <a href="mailto:${business.email}">${business.email}</a></p>` : ''}
                            </div>
                            
                            <h4>Services Offered</h4>
                            <div class="services">
                                ${services.slice(0, 6).map(service => `
                                    <div class="service">✓ ${service}</div>
                                `).join('')}
                            </div>
                            
                            <div class="badges">
                                ${business.verified ? '<span class="badge badge-verified">✓ 100% Verified</span>' : ''}
                                ${business.emergencyService ? '<span class="badge badge-emergency">24/7 Emergency</span>' : ''}
                                ${business.bbbRating ? `<span class="badge badge-bbb">BBB ${business.bbbRating}</span>` : ''}
                                ${business.yearsInBusiness ? `<span class="badge" style="background: #6b7280; color: white;">${business.yearsInBusiness}+ Years</span>` : ''}
                            </div>
                            
                            <div class="actions">
                                ${business.phone ? `<a href="tel:${business.phone}" class="btn btn-primary">Call Now</a>` : ''}
                                ${business.address ? `<a href="https://maps.google.com/maps?q=${encodeURIComponent(business.address)}" target="_blank" class="btn btn-secondary">Get Directions</a>` : ''}
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        ` : `
            <div style="text-align: center; padding: 4rem; color: #6b7280;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${industry.icon}</div>
                <h3>${industry.name} Coming Soon to ${city.name}</h3>
                <p>We're working on adding verified ${industry.name.toLowerCase()} to our ${city.name} directory.</p>
                <a href="/portland/electricians" class="btn btn-primary" style="display: inline-block; margin-top: 1rem;">View Portland Electricians</a>
            </div>
        `}
    </div>
    ${getFooter()}
</body>
</html>`;
}

// Blog admin interface
function getBlogAdminPage(posts: BlogPost[] = []): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Admin - Oregon SMB Directory</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 2rem; background: #f9fafb; }
        .header { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 1rem; }
        .form-group textarea { min-height: 200px; font-family: monospace; }
        .btn { padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600; border: none; cursor: pointer; font-size: 1rem; }
        .btn-primary { background: #4F46E5; color: white; }
        .btn-secondary { background: #6b7280; color: white; margin-left: 0.5rem; }
        .btn-success { background: #10b981; color: white; }
        .btn-danger { background: #ef4444; color: white; }
        .posts-list { display: grid; gap: 1rem; }
        .post-item { display: flex; justify-content: between; align-items: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 6px; background: white; }
        .post-info h3 { margin: 0 0 0.5rem 0; }
        .post-info p { margin: 0; color: #6b7280; font-size: 0.9rem; }
        .post-actions { display: flex; gap: 0.5rem; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .status-published { background: #d1fae5; color: #065f46; }
        .status-draft { background: #fef3c7; color: #92400e; }
        #editor { display: none; }
        .two-column { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        @media (max-width: 768px) { .two-column { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Blog Admin</h1>
            <p>Create and manage blog posts for Oregon SMB Directory</p>
            <a href="/" style="color: white; text-decoration: underline;">← Back to Directory</a>
        </div>

        <div id="postsList">
            <div class="card">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 2rem;">
                    <h2>Blog Posts</h2>
                    <button class="btn btn-primary" onclick="showEditor()">+ New Post</button>
                </div>
                
                <div class="posts-list">
                    ${posts.length > 0 ? posts.map(post => `
                        <div class="post-item">
                            <div class="post-info">
                                <h3>${post.title}</h3>
                                <p>Slug: /${post.slug} • Created: ${new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                            <div class="post-actions">
                                <span class="status-badge status-${post.status}">${post.status}</span>
                                <button class="btn btn-secondary" onclick="editPost('${post.id}')">Edit</button>
                                ${post.status === 'published' ? `<a href="/blog/${post.slug}" class="btn btn-success" target="_blank">View</a>` : ''}
                            </div>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #6b7280; padding: 2rem;">No blog posts yet. Create your first post!</p>'}
                </div>
            </div>
        </div>

        <div id="editor" class="card">
            <form id="postForm">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 2rem;">
                    <h2 id="editorTitle">New Blog Post</h2>
                    <button type="button" class="btn btn-secondary" onclick="hideEditor()">Cancel</button>
                </div>
                
                <div class="two-column">
                    <div>
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="slug">URL Slug</label>
                            <input type="text" id="slug" name="slug" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Content (Markdown supported)</label>
                            <textarea id="content" name="content" placeholder="Write your blog post content here..." required></textarea>
                        </div>
                    </div>
                    
                    <div>
                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" name="status">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="excerpt">Excerpt</label>
                            <textarea id="excerpt" name="excerpt" rows="3" placeholder="Brief description..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="tags">Tags (comma-separated)</label>
                            <input type="text" id="tags" name="tags" placeholder="business, directory, oregon">
                        </div>
                        
                        <div class="form-group">
                            <label for="meta_title">Meta Title (SEO)</label>
                            <input type="text" id="meta_title" name="meta_title">
                        </div>
                        
                        <div class="form-group">
                            <label for="meta_description">Meta Description (SEO)</label>
                            <textarea id="meta_description" name="meta_description" rows="2"></textarea>
                        </div>
                        
                        <input type="hidden" id="post_id" name="id">
                        
                        <div style="margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary">Save Post</button>
                            <button type="button" class="btn btn-secondary" onclick="hideEditor()">Cancel</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Auto-generate slug from title
        document.getElementById('title').addEventListener('input', function() {
            const title = this.value;
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');
            document.getElementById('slug').value = slug;
        });

        function showEditor() {
            document.getElementById('postsList').style.display = 'none';
            document.getElementById('editor').style.display = 'block';
            document.getElementById('editorTitle').textContent = 'New Blog Post';
            document.getElementById('postForm').reset();
        }

        function hideEditor() {
            document.getElementById('editor').style.display = 'none';
            document.getElementById('postsList').style.display = 'block';
        }

        function editPost(postId) {
            // This would fetch post data and populate form
            showEditor();
            document.getElementById('editorTitle').textContent = 'Edit Blog Post';
            document.getElementById('post_id').value = postId;
        }

        document.getElementById('postForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const postData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/admin/save-post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                });
                
                if (response.ok) {
                    alert('Post saved successfully!');
                    window.location.reload();
                } else {
                    alert('Error saving post. Please try again.');
                }
            } catch (error) {
                alert('Error saving post: ' + error.message);
            }
        });
    </script>
</body>
</html>`;
}

// Blog post display page
function getBlogPostPage(post: BlogPost): string {
  // Parse tags if they exist
  let tags = [];
  try {
    tags = post.tags ? JSON.parse(post.tags) : [];
  } catch (e) {
    tags = [];
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.meta_title || post.title} - Oregon SMB Directory Blog</title>
    <meta name="description" content="${post.meta_description || post.excerpt || 'Oregon SMB Directory Blog'}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 2rem; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .article { background: white; margin: 2rem auto; padding: 2rem; max-width: 800px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; }
        .article h1 { color: #1f2937; margin-bottom: 1rem; }
        .article .meta { color: #6b7280; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; }
        .article .content { color: #374151; }
        .article .content h2 { color: #1f2937; margin-top: 2rem; margin-bottom: 1rem; }
        .article .content h3 { color: #374151; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .article .content p { margin-bottom: 1rem; }
        .article .content ul, .article .content ol { margin-bottom: 1rem; padding-left: 2rem; }
        .article .content blockquote { border-left: 4px solid #4F46E5; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1.5rem 0; }
        .article .content code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace; }
        .article .content pre { background: #1f2937; color: white; padding: 1rem; border-radius: 8px; overflow-x: auto; }
        .tags { margin-top: 2rem; }
        .tag { display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.9rem; margin-right: 0.5rem; margin-bottom: 0.5rem; }
        .back-link { display: inline-block; margin-top: 2rem; color: #4F46E5; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › 
            <a href="/blog">Blog</a> › 
            <strong>${post.title}</strong>
        </div>
    </div>
    
    <div class="header">
        <div class="container">
            <h1>${post.title}</h1>
            ${post.excerpt ? `<p style="font-size: 1.1rem; opacity: 0.9;">${post.excerpt}</p>` : ''}
        </div>
    </div>
    
    <article class="article">
        <div class="meta">
            Published on ${new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })} by ${post.author || 'Oregon SMB Directory'}
        </div>
        
        <div class="content">
            ${post.content.replace(/\n/g, '<br>')}
        </div>
        
        ${tags.length > 0 ? `
            <div class="tags">
                <strong>Tags:</strong>
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : ''}

        <a href="/blog" class="back-link">← Back to Blog</a>
    </article>
    ${getFooter()}
</body>
</html>`;
}

// Shared footer component
function getFooter(): string {
  return `
    <footer style="background: #1f2937; color: white; padding: 3rem 2rem;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Oregon SMB Directory</h4>
                    <p style="color: #9ca3af;">Your trusted directory for finding verified Oregon businesses along the I-5 corridor.</p>
                    <p style="color: #9ca3af; margin-top: 1rem;">
                        <strong>Phone:</strong> (541) 450-2082<br>
                        <strong>Email:</strong> contact@oregonsmbdirectory.com
                    </p>
                </div>

                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Major Cities</h4>
                    <a href="/portland" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Portland</a>
                    <a href="/salem" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Salem</a>
                    <a href="/eugene" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Eugene</a>
                    <a href="/medford" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Medford</a>
                    <a href="/grants-pass" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Grants Pass</a>
                    <a href="/roseburg" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Roseburg</a>
                </div>

                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Business Services</h4>
                    <a href="/get-listed" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Get Listed</a>
                    <a href="/blog" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Blog & Resources</a>
                    <a href="/contact" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Contact Us</a>
                    <a href="/about" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">About Us</a>
                </div>

                <div>
                    <h4 style="margin-bottom: 1rem; color: #f3f4f6;">Legal</h4>
                    <a href="/privacy" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Privacy Policy</a>
                    <a href="/faq" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">FAQ</a>
                    <a href="/contact" style="color: #9ca3af; text-decoration: none; display: block; margin-bottom: 0.5rem;">Support</a>
                </div>
            </div>

            <div style="border-top: 1px solid #374151; margin-top: 2rem; padding-top: 2rem; text-align: center; color: #9ca3af;">
                <p>&copy; 2025 Oregon SMB Directory. Powered by LEVERAGEAI LLC. All rights reserved.</p>
            </div>
        </div>
    </footer>
  `;
}

// Contact page
function getContactPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Oregon SMB Directory</title>
    <meta name="description" content="Contact Oregon SMB Directory. Phone: (541) 450-2082. Get in touch for business listings, directory services, and support.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 2rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .contact-section { padding: 3rem 2rem; background: white; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; margin: 2rem 0; }
        .contact-card { background: #f8fafc; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .contact-icon { font-size: 3rem; margin-bottom: 1rem; }
        .contact-card h3 { margin: 1rem 0; color: #1f2937; }
        .contact-card p { color: #6b7280; margin: 0.5rem 0; }
        .contact-card a { color: #4F46E5; text-decoration: none; font-weight: 600; }
        .contact-card a:hover { text-decoration: underline; }
        .form-section { background: #f9fafb; padding: 3rem 2rem; }
        .form-container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
        .form-group textarea { min-height: 120px; resize: vertical; }
        .btn { background: #4F46E5; color: white; padding: 0.75rem 2rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn:hover { background: #4338CA; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>Contact Us</strong>
        </div>
    </div>

    <div class="header">
        <div class="container">
            <h1>Get In Touch</h1>
            <p>Ready to get your business listed or need support? We're here to help you succeed.</p>
        </div>
    </div>

    <div class="contact-section">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-card">
                    <div class="contact-icon">📞</div>
                    <h3>Phone</h3>
                    <p><a href="tel:5414502082">(541) 450-2082</a></p>
                    <p>Mon-Fri 8:00 AM - 6:00 PM PST</p>
                </div>

                <div class="contact-card">
                    <div class="contact-icon">✉️</div>
                    <h3>Email</h3>
                    <p><a href="mailto:contact@oregonsmbdirectory.com">contact@oregonsmbdirectory.com</a></p>
                    <p>Response within 24 hours</p>
                </div>

                <div class="contact-card">
                    <div class="contact-icon">📍</div>
                    <h3>Location</h3>
                    <p>Serving all of Oregon</p>
                    <p>I-5 Corridor: Portland to Ashland</p>
                </div>
            </div>
        </div>
    </div>

    <div class="form-section">
        <div class="container">
            <div class="form-container">
                <h2 style="text-align: center; margin-bottom: 2rem;">Send Us a Message</h2>
                <form id="contactForm">
                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone">
                    </div>

                    <div class="form-group">
                        <label for="company">Company Name</label>
                        <input type="text" id="company" name="company">
                    </div>

                    <div class="form-group">
                        <label for="inquiryType">Inquiry Type *</label>
                        <select id="inquiryType" name="inquiryType" required>
                            <option value="">Select an option</option>
                            <option value="business-listing">Business Listing</option>
                            <option value="directory-services">Directory Services</option>
                            <option value="technical-support">Technical Support</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="general">General Inquiry</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="message">Message *</label>
                        <textarea id="message" name="message" placeholder="How can we help you?" required></textarea>
                    </div>

                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>
    </div>

    ${getFooter()}

    <script>
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const contactData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactData)
                });

                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. We\\'ll get back to you within 24 hours.');
                    this.reset();
                } else {
                    alert('There was an error sending your message. Please try calling us directly at (541) 450-2082.');
                }
            } catch (error) {
                alert('There was an error sending your message. Please try calling us directly at (541) 450-2082.');
            }
        });
    </script>
</body>
</html>`;
}

// Get Listed page with business submission form
function getGetListedPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Get Your Business Listed - Oregon SMB Directory</title>
    <meta name="description" content="Get your Oregon business listed in our verified directory. Reach more customers along the I-5 corridor from Portland to Ashland.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 4rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .section { padding: 4rem 2rem; }
        .section-alt { background: #f9fafb; }
        .form-section { background: white; padding: 4rem 2rem; }
        .form-container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
        .form-group textarea { min-height: 120px; resize: vertical; }
        .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
        .checkbox-group input { width: auto; }
        .btn { background: #10b981; color: white; padding: 0.75rem 2rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.2s; width: 100%; }
        .btn:hover { background: #059669; }
        .requirements { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; }
        .requirements h4 { margin-top: 0; color: #92400e; }
        .requirements ul { margin: 0; color: #92400e; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>Get Listed</strong>
        </div>
    </div>

    <div class="hero">
        <div class="container">
            <h1>Get Your Business<br><span style="color: #fbbf24;">Listed Today</span></h1>
            <p>Join thousands of verified Oregon businesses and reach more customers along the I-5 corridor.</p>
            <a href="#get-started" class="btn" style="background: white; color: #059669;">Start Your Listing</a>
        </div>
    </div>

    <div class="form-section" id="get-started">
        <div class="container">
            <div class="form-container">
                <h2 style="text-align: center; margin-bottom: 1rem;">Get Your Business Listed</h2>
                <p style="text-align: center; color: #6b7280; margin-bottom: 2rem;">Fill out the form below to start your business listing. We'll review your information and get you listed within 24-48 hours.</p>

                <div class="requirements">
                    <h4>📋 Listing Requirements</h4>
                    <ul>
                        <li>Valid Oregon business license or registration</li>
                        <li>Physical business address or service area in Oregon</li>
                        <li>Active phone number and email address</li>
                        <li>Professional business website (recommended)</li>
                        <li>Appropriate licensing for your industry (contractors, etc.)</li>
                    </ul>
                </div>

                <form id="listingForm">
                    <div class="form-group">
                        <label for="businessName">Business Name *</label>
                        <input type="text" id="businessName" name="businessName" required>
                    </div>

                    <div class="form-group">
                        <label for="ownerName">Owner/Contact Name *</label>
                        <input type="text" id="ownerName" name="ownerName" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>

                    <div class="form-group">
                        <label for="website">Website URL</label>
                        <input type="url" id="website" name="website">
                    </div>

                    <div class="form-group">
                        <label for="address">Business Address *</label>
                        <input type="text" id="address" name="address" required>
                    </div>

                    <div class="form-group">
                        <label for="city">City *</label>
                        <select id="city" name="city" required>
                            <option value="">Select your city</option>
                            <option value="portland">Portland</option>
                            <option value="salem">Salem</option>
                            <option value="eugene">Eugene</option>
                            <option value="medford">Medford</option>
                            <option value="grants-pass">Grants Pass</option>
                            <option value="roseburg">Roseburg</option>
                            <option value="other">Other Oregon City</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="industry">Industry/Category *</label>
                        <select id="industry" name="industry" required>
                            <option value="">Select your industry</option>
                            <option value="electricians">Electricians</option>
                            <option value="general-contractors">General Contractors</option>
                            <option value="real-estate">Real Estate</option>
                            <option value="plumbers">Plumbers</option>
                            <option value="lawyers">Law Firms</option>
                            <option value="roofers">Roofers</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="services">Services Offered *</label>
                        <textarea id="services" name="services" placeholder="Describe the main services your business offers..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="yearsInBusiness">Years in Business</label>
                        <input type="number" id="yearsInBusiness" name="yearsInBusiness" min="0" max="100">
                    </div>

                    <div class="form-group">
                        <label for="licenseNumber">License Number (if applicable)</label>
                        <input type="text" id="licenseNumber" name="licenseNumber">
                    </div>

                    <div class="form-group">
                        <label for="listingPlan">Desired Listing Plan *</label>
                        <select id="listingPlan" name="listingPlan" required>
                            <option value="">Select a plan</option>
                            <option value="basic">Basic - Free</option>
                            <option value="professional">Professional - $29/month</option>
                            <option value="premium">Premium - $59/month</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="emergencyService" name="emergencyService">
                            <label for="emergencyService">We offer 24/7 emergency services</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="terms" name="terms" required>
                            <label for="terms">I agree to the terms of service and privacy policy *</label>
                        </div>
                    </div>

                    <button type="submit" class="btn">Submit Listing Application</button>
                </form>
            </div>
        </div>
    </div>

    ${getFooter()}

    <script>
        document.getElementById('listingForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const listingData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/submit-listing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(listingData)
                });

                if (response.ok) {
                    alert('Thank you! Your listing application has been submitted successfully. We\\'ll review your information and contact you within 24-48 hours.');
                    this.reset();
                } else {
                    alert('There was an error submitting your application. Please try again or contact us directly at (541) 450-2082.');
                }
            } catch (error) {
                alert('There was an error submitting your application. Please try again or contact us directly at (541) 450-2082.');
            }
        });
    </script>
</body>
</html>`;
}

// Privacy Policy page
function getPrivacyPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Oregon SMB Directory</title>
    <meta name="description" content="Privacy Policy for Oregon SMB Directory. Learn how we collect, use, and protect your information.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #374151; }
        .hero { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 4rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.1rem; opacity: 0.9; }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .content { background: white; padding: 3rem 2rem; }
        .last-updated { background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: center; color: #6b7280; }
        .policy-section { margin-bottom: 3rem; }
        .policy-section h2 { color: #1f2937; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
        .policy-section p { margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>Privacy Policy</strong>
        </div>
    </div>

    <div class="hero">
        <div class="container">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🛡️</div>
            <h1>Privacy<br><span style="color: #fbbf24;">Policy</span></h1>
            <p>Your privacy is important to us. Learn how we collect, use, and protect your information.</p>
        </div>
    </div>

    <div class="content">
        <div class="container">
            <div class="last-updated">
                Last updated: January 2, 2025
            </div>

            <div class="policy-section">
                <p style="font-size: 1.1rem; text-align: center; margin-bottom: 2rem;">
                    This Privacy Policy describes how Oregon SMB Directory ("we," "our," or "us") collects, uses,
                    and protects your information when you use our website and services.
                </p>

                <h2>Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you contact us or submit a business listing. This may include your name, email address, phone number, business information, and any messages you send to us.</p>

                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to provide our directory services, respond to your inquiries, improve our website, and communicate with you about our services.</p>

                <h2>Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>

                <h2>Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

                <h2>Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at contact@oregonsmbdirectory.com or (541) 450-2082.</p>
            </div>
        </div>
    </div>

    ${getFooter()}
</body>
</html>`;
}

// FAQ page
function getFAQPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frequently Asked Questions - Oregon SMB Directory</title>
    <meta name="description" content="Find answers to common questions about Oregon SMB Directory, business listings, and our services.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 4rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; opacity: 0.9; }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .content { background: white; padding: 3rem 2rem; }
        .faq-item { background: #f9fafb; margin-bottom: 1rem; border-radius: 8px; overflow: hidden; }
        .faq-question { background: none; border: none; width: 100%; padding: 1.5rem; text-align: left; font-size: 1.1rem; font-weight: 600; color: #1f2937; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-question:hover { background: #f3f4f6; }
        .faq-answer { padding: 0 1.5rem 1.5rem; color: #4b5563; display: none; }
        .faq-answer.active { display: block; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>FAQ</strong>
        </div>
    </div>

    <div class="hero">
        <div class="container">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❓</div>
            <h1>Frequently Asked<br><span style="color: #fbbf24;">Questions</span></h1>
            <p>Find answers to common questions about our directory and services.</p>
        </div>
    </div>

    <div class="content">
        <div class="container">
            <div class="faq-item">
                <button class="faq-question">
                    How do I get my business listed?
                    <span>▼</span>
                </button>
                <div class="faq-answer">
                    <p>Visit our <a href="/get-listed" style="color: #7c3aed;">Get Listed</a> page and fill out the application form. We review all submissions within 24-48 hours and will contact you to complete the listing process.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question">
                    What areas do you cover?
                    <span>▼</span>
                </button>
                <div class="faq-answer">
                    <p>We cover the entire I-5 corridor in Oregon, including Portland, Salem, Eugene, Medford, Grants Pass, Roseburg, and surrounding communities throughout the state.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question">
                    How much does a listing cost?
                    <span>▼</span>
                </button>
                <div class="faq-answer">
                    <p>We offer free basic listings as well as premium options starting at $29/month with enhanced features like priority placement and detailed business profiles.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question">
                    How do you verify businesses?
                    <span>▼</span>
                </button>
                <div class="faq-answer">
                    <p>We verify businesses through license checks, phone verification, address confirmation, and review of business credentials to ensure customers connect with legitimate service providers.</p>
                </div>
            </div>
        </div>
    </div>

    ${getFooter()}

    <script>
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                const answer = item.querySelector('.faq-answer');
                const isActive = answer.classList.contains('active');

                // Close all other answers
                document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
                    otherAnswer.classList.remove('active');
                });

                // Toggle current answer
                if (!isActive) {
                    answer.classList.add('active');
                }
            });
        });
    </script>
    ${getFooter()}
</body>
</html>`;
}

// About page
function getAboutPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Oregon SMB Directory</title>
    <meta name="description" content="Learn about Oregon SMB Directory - your trusted partner for connecting with verified Oregon businesses along the I-5 corridor.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 4rem 2rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .section { padding: 4rem 2rem; }
        .section h2 { text-align: center; margin-bottom: 2rem; color: #1f2937; font-size: 2.5rem; }
        .section p { text-align: center; color: #6b7280; font-size: 1.1rem; max-width: 800px; margin: 0 auto 3rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .feature-card { background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature-card h3 { margin: 1rem 0; color: #1f2937; }
        .feature-card p { color: #6b7280; margin: 0; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>About Us</strong>
        </div>
    </div>

    <div class="hero">
        <div class="container">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">About<br><span style="color: #fbbf24;">Oregon SMB Directory</span></h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Your trusted directory for finding verified businesses along Oregon's I-5 corridor.</p>
        </div>
    </div>

    <div class="section">
        <div class="container">
            <h2>Your Business Connection Partner</h2>
            <p>Oregon SMB Directory is a comprehensive business directory dedicated to helping customers find verified, quality businesses throughout Oregon. We specialize in connecting people with trusted services along the I-5 corridor, from Portland to Ashland.</p>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Verified Listings</h3>
                    <p>Every business in our directory is verified for licensing, credentials, and quality standards.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>Comprehensive Coverage</h3>
                    <p>Complete business listings covering all major industries across Oregon's I-5 corridor.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📍</div>
                    <h3>Local Focus</h3>
                    <p>Based in Southern Oregon, we understand the unique needs of local businesses and communities.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>24/7 Accessibility</h3>
                    <p>Around-the-clock access to business listings and contact information.</p>
                </div>
            </div>
        </div>
    </div>

    ${getFooter()}
</body>
</html>`;
}

// Blog listing page
function getBlogListingPage(posts: BlogPost[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Oregon SMB Directory</title>
    <meta name="description" content="Latest insights and updates from Oregon SMB Directory - your trusted source for Oregon business information.">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; }
        .header { background: linear-gradient(135deg, #4F46E5, #3B82F6); color: white; padding: 3rem 2rem; text-align: center; }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 1rem; }
        .breadcrumb { padding: 1rem; background: #f9fafb; }
        .breadcrumb a { color: #4F46E5; text-decoration: none; margin-right: 0.5rem; }
        .breadcrumb a:hover { text-decoration: underline; }
        .posts-grid { display: grid; gap: 2rem; margin: 2rem 0; }
        .post-card { background: white; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .post-card:hover { transform: translateY(-2px); }
        .post-card h2 { margin: 0 0 1rem 0; color: #1f2937; }
        .post-card h2 a { color: inherit; text-decoration: none; }
        .post-card h2 a:hover { color: #4F46E5; }
        .post-card .excerpt { color: #6b7280; margin-bottom: 1rem; }
        .post-card .meta { color: #9ca3af; font-size: 0.9rem; }
        .no-posts { text-align: center; padding: 4rem; color: #6b7280; }
    </style>
</head>
<body>
    <div class="breadcrumb">
        <div class="container">
            <a href="/">Oregon SMB Directory</a> › <strong>Blog</strong>
        </div>
    </div>
    
    <div class="header">
        <div class="container">
            <h1>Oregon SMB Directory Blog</h1>
            <p>Latest insights, tips, and updates for Oregon businesses</p>
        </div>
    </div>
    
    <div class="container">
        <div class="posts-grid">
            ${posts.length > 0 ? posts.map(post => `
                <article class="post-card">
                    <h2><a href="/blog/${post.slug}">${post.title}</a></h2>
                    ${post.excerpt ? `<p class="excerpt">${post.excerpt}</p>` : ''}
                    <div class="meta">
                        Published ${new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </article>
            `).join('') : `
                <div class="no-posts">
                    <h3>No blog posts yet</h3>
                    <p>Check back soon for the latest updates and insights!</p>
                    <a href="/" style="color: #4F46E5; text-decoration: none;">← Back to Directory</a>
                </div>
            `}
        </div>
    </div>
    ${getFooter()}
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Remove trailing slash except for root
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    
    // Parse URL segments for all routes
    const segments = normalizedPath.split('/').filter(Boolean);
    
    // BLOG ROUTES (added before directory routes to avoid conflicts)
    
    // Blog admin interface with password protection
    if (normalizedPath === '/admin') {
      // Check for basic auth
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return new Response('Unauthorized', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
          },
        });
      }
      
      const base64Credentials = authHeader.slice(6);
      const credentials = atob(base64Credentials);
      const [, password] = credentials.split(':');
      
      if (password !== 'Tactics25862!') {
        return new Response('Unauthorized', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
          },
        });
      }
      
      try {
        // Get all posts for admin (both published and draft)
        const publishedPosts = await getBlogPosts(env.DB, 'published', 50);
        const draftPosts = await getBlogPosts(env.DB, 'draft', 50);
        const posts = [...publishedPosts, ...draftPosts].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        return new Response(getBlogAdminPage(posts), {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (error) {
        return new Response(getBlogAdminPage([]), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Save blog post endpoint with authentication
    if (normalizedPath === '/admin/save-post' && request.method === 'POST') {
      // Check for basic auth
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const base64Credentials = authHeader.slice(6);
      const credentials = atob(base64Credentials);
      const [, password] = credentials.split(':');
      
      if (password !== 'Tactics25862!') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      try {
        const postData = await request.json() as Partial<BlogPost>;
        
        // Process tags
        if (postData.tags && typeof postData.tags === 'string') {
          const tagsArray = postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          postData.tags = JSON.stringify(tagsArray);
        }
        
        await saveBlogPost(env.DB, postData);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to save post' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Blog listing page
    if (normalizedPath === '/blog') {
      try {
        const posts = await getBlogPosts(env.DB, 'published', 20);
        return new Response(getBlogListingPage(posts), {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (error) {
        return new Response(getBlogListingPage([]), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Blog post page: /blog/[slug]
    if (segments.length === 2 && segments[0] === 'blog') {
      const slug = segments[1];
      try {
        const post = await getBlogPostBySlug(env.DB, slug);
        if (post && post.status === 'published') {
          return new Response(getBlogPostPage(post), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      } catch (error) {
        console.error('Blog post fetch error:', error);
      }
      // If post not found or error, fall through to 404
    }

    // NEW WEBSITE PAGES

    // Contact page
    if (normalizedPath === '/contact') {
      return new Response(getContactPage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Contact form submission API
    if (normalizedPath === '/api/contact' && request.method === 'POST') {
      try {
        const contactData = await request.json() as ContactSubmission;
        await saveContactSubmission(env.DB, contactData);

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({ error: 'Failed to save contact' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Get Listed page
    if (normalizedPath === '/get-listed') {
      return new Response(getGetListedPage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Business listing submission API
    if (normalizedPath === '/api/submit-listing' && request.method === 'POST') {
      try {
        const listingData = await request.json() as ListingSubmission;
        await saveListingSubmission(env.DB, listingData);

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Listing submission error:', error);
        return new Response(JSON.stringify({ error: 'Failed to save listing' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Privacy Policy page
    if (normalizedPath === '/privacy') {
      return new Response(getPrivacyPage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // FAQ page
    if (normalizedPath === '/faq') {
      return new Response(getFAQPage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // About page
    if (normalizedPath === '/about') {
      return new Response(getAboutPage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // DIRECTORY ROUTES (existing functionality preserved)
    
    // Homepage
    if (normalizedPath === '/' || normalizedPath === '') {
      return new Response(getHomePage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // City page: /portland
    if (segments.length === 1) {
      const citySlug = segments[0];
      const city = CITIES.find(c => c.slug === citySlug);
      
      if (city) {
        return new Response(getCityPage(city), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // Industry page: /portland/electricians
    if (segments.length === 2) {
      const [citySlug, industrySlug] = segments;
      const city = CITIES.find(c => c.slug === citySlug);
      const industry = INDUSTRIES.find(i => i.slug === industrySlug);
      
      if (city && industry) {
        // Get businesses for this city/industry combination with D1 + fallback
        const businesses = await getBusinessesWithFallback(env.DB, citySlug, industrySlug, 30);

        return new Response(getIndustryPage(city, industry, businesses), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // 404 for unmatched routes
    return new Response('Page not found', { status: 404 });
  },
};