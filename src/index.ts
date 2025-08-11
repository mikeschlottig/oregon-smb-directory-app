/**
 * Oregon SMB Directory - Cloudflare Worker
 * Dynamic business directory for I-5 corridor
 */

export interface Env {
  // Define your bindings here
  // KV_BINDING?: KVNamespace;
  // D1_DATABASE?: D1Database;
}

// City data
const CITIES = [
  { slug: 'portland', name: 'Portland', county: 'Multnomah' },
  { slug: 'salem', name: 'Salem', county: 'Marion' },
  { slug: 'eugene', name: 'Eugene', county: 'Lane' },
  { slug: 'medford', name: 'Medford', county: 'Jackson' },
  { slug: 'grants-pass', name: 'Grants Pass', county: 'Josephine' }
];

// Industry data
const INDUSTRIES = [
  { slug: 'electricians', name: 'Electricians', icon: '⚡' },
  { slug: 'plumbers', name: 'Plumbers', icon: '🔧' },
  { slug: 'hvac', name: 'HVAC', icon: '🌡️' },
  { slug: 'contractors', name: 'Contractors', icon: '🏗️' },
  { slug: 'restaurants', name: 'Restaurants', icon: '🍽️' },
  { slug: 'dentists', name: 'Dentists', icon: '🦷' }
];

// Sample Portland Electricians data
const PORTLAND_ELECTRICIANS = [
  {
    id: 'abc-electric-portland',
    name: 'ABC Electric Company',
    trade: 'Electrician',
    phone: '(503) 555-0123',
    website: 'www.abcelectric.com',
    address: '123 NW Industrial Way, Portland, OR 97210',
    services: ['Residential Electrical', 'Commercial Electrical', 'Emergency Repairs', 'Panel Upgrades', 'LED Lighting', 'Smart Home Systems'],
    hours: 'Mon-Fri: 7AM-5PM',
    rating: 4.8,
    reviewCount: 47,
    licenseNumber: '123456',
    yearsInBusiness: 15,
    verified: true,
    emergencyService: true,
    bbbRating: 'A+'
  },
  {
    id: 'portland-power-pros',
    name: 'Portland Power Pros',
    trade: 'Electrician',
    phone: '(503) 555-0234',
    website: 'www.portlandpowerpros.com',
    address: '456 SE Division St, Portland, OR 97202',
    services: ['Electrical Installations', 'Wiring Services', 'Generator Installation', 'EV Charger Installation', 'Electrical Inspections'],
    hours: 'Mon-Sat: 6AM-6PM',
    rating: 4.9,
    reviewCount: 89,
    licenseNumber: '234567',
    yearsInBusiness: 22,
    verified: true,
    emergencyService: true,
    featured: true
  },
  {
    id: 'citywide-electric-portland',
    name: 'Citywide Electric Services',
    trade: 'Electrician',
    phone: '(503) 555-0345',
    address: '789 NE Sandy Blvd, Portland, OR 97232',
    services: ['Residential Rewiring', 'Commercial Electrical', 'Troubleshooting', 'Outlet Installation', 'Ceiling Fan Installation'],
    hours: '24/7 Emergency Service',
    rating: 4.6,
    reviewCount: 34,
    licenseNumber: '345678',
    yearsInBusiness: 8,
    verified: true,
    emergencyService: true
  }
];

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
    
    <footer style="background: #1f2937; color: white; padding: 2rem; text-align: center; margin-top: 3rem;">
        <p>&copy; 2025 Oregon SMB Directory. Powered by LEVERAGEAI LLC.</p>
        <p style="color: #9ca3af;">Serving the entire I-5 corridor from Portland to Ashland.</p>
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
                ${businesses.map(business => `
                    <div class="business-card">
                        <div class="card-header">
                            <div style="display: flex; justify-content: between; align-items: start;">
                                <div>
                                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">${business.name}</h3>
                                    <p style="margin: 0; opacity: 0.9;">Licensed ${business.trade}</p>
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
                                <p><strong>📞</strong> ${business.phone}</p>
                                <p><strong>📍</strong> ${business.address}</p>
                                ${business.hours ? `<p><strong>🕒</strong> ${business.hours}</p>` : ''}
                                ${business.website ? `<p><strong>🌐</strong> <a href="https://${business.website}" target="_blank">${business.website}</a></p>` : ''}
                            </div>
                            
                            <h4>Services Offered</h4>
                            <div class="services">
                                ${business.services.slice(0, 6).map(service => `
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
                                <a href="tel:${business.phone}" class="btn btn-primary">Call Now</a>
                                <a href="https://maps.google.com/maps?q=${encodeURIComponent(business.address)}" target="_blank" class="btn btn-secondary">Get Directions</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
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
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Remove trailing slash except for root
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    
    // Homepage
    if (normalizedPath === '') {
      return new Response(getHomePage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Parse URL segments
    const segments = normalizedPath.split('/').filter(Boolean);

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
        // Get businesses for this city/industry combination
        let businesses: any[] = [];
        if (citySlug === 'portland' && industrySlug === 'electricians') {
          businesses = PORTLAND_ELECTRICIANS;
        }
        
        return new Response(getIndustryPage(city, industry, businesses), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // 404 for unmatched routes
    return new Response('Page not found', { status: 404 });
  },
};