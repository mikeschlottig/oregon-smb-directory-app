/**
 * Oregon SMB Directory Test Worker
 * Sample directory with 2 pages of listings, search, header, and footer
 */

// Sample business data - 2 pages worth
const SAMPLE_BUSINESSES = [
  // Page 1 - Electricians
  {
    id: 'abc-electric-medford',
    name: 'ABC Electric Company',
    trade: 'Electrician',
    phone: '(541) 555-0123',
    website: 'www.abcelectric.com',
    address: '123 Main St, Medford, OR 97501',
    services: ['Residential Electrical', 'Commercial Electrical', 'Emergency Repairs', 'Panel Upgrades', 'LED Lighting', 'Smart Home Systems'],
    specialties: ['Solar Installation', 'EV Charger Installation'],
    hours: 'Mon-Fri: 7AM-5PM',
    rating: 4.8,
    reviewCount: 47,
    licenseNumber: '123456',
    yearsInBusiness: 15,
    verified: true,
    emergencyService: true,
    bbbRating: 'A+',
    featured: true
  },
  {
    id: 'medford-power-pros',
    name: 'Medford Power Pros',
    trade: 'Electrician',
    phone: '(541) 555-0234',
    website: 'www.medfordpowerpros.com',
    address: '456 Riverside Ave, Medford, OR 97504',
    services: ['Electrical Installations', 'Wiring Services', 'Generator Installation', 'Electrical Inspections', 'Troubleshooting'],
    hours: 'Mon-Sat: 6AM-6PM',
    rating: 4.9,
    reviewCount: 89,
    licenseNumber: '234567',
    yearsInBusiness: 22,
    verified: true,
    emergencyService: true
  },
  {
    id: 'rogue-valley-electric',
    name: 'Rogue Valley Electric Services',
    trade: 'Electrician',
    phone: '(541) 555-0345',
    address: '789 Crater Lake Hwy, Medford, OR 97504',
    services: ['Residential Rewiring', 'Commercial Electrical', 'Outlet Installation', 'Ceiling Fan Installation', 'Code Compliance'],
    hours: '24/7 Emergency Service',
    rating: 4.6,
    reviewCount: 34,
    licenseNumber: '345678',
    yearsInBusiness: 8,
    verified: true,
    emergencyService: true
  },
  {
    id: 'southern-oregon-electric',
    name: 'Southern Oregon Electric Co',
    trade: 'Electrician',
    phone: '(541) 555-0456',
    website: 'www.soelectric.com',
    address: '321 Phoenix Rd, Phoenix, OR 97535',
    services: ['Industrial Electrical', 'Motor Control', 'Lighting Design', 'Electrical Maintenance', 'Safety Inspections'],
    hours: 'Mon-Fri: 8AM-4PM',
    rating: 4.7,
    reviewCount: 56,
    licenseNumber: '456789',
    yearsInBusiness: 18,
    verified: true,
    bbbRating: 'A'
  },
  // Page 2 - Mixed Contractors
  {
    id: 'grants-pass-plumbing',
    name: 'Grants Pass Plumbing Plus',
    trade: 'Plumber',
    phone: '(541) 555-0567',
    website: 'www.gpplumbing.com',
    address: '123 NE 6th St, Grants Pass, OR 97526',
    services: ['Drain Cleaning', 'Water Heater Installation', 'Pipe Repair', 'Bathroom Remodeling', 'Emergency Plumbing'],
    specialties: ['Tankless Water Heaters', 'Sewer Line Repair'],
    hours: '24/7 Emergency Service',
    rating: 4.8,
    reviewCount: 73,
    licenseNumber: '567890',
    yearsInBusiness: 12,
    verified: true,
    emergencyService: true,
    featured: true
  },
  {
    id: 'rogue-valley-hvac',
    name: 'Rogue Valley HVAC Solutions',
    trade: 'HVAC',
    phone: '(541) 555-0678',
    address: '456 SW 7th St, Grants Pass, OR 97526',
    services: ['AC Installation', 'Furnace Repair', 'Duct Cleaning', 'Heat Pump Service', 'Indoor Air Quality'],
    hours: 'Mon-Fri: 7AM-6PM, Sat: 8AM-4PM',
    rating: 4.5,
    reviewCount: 42,
    licenseNumber: '678901',
    yearsInBusiness: 10,
    verified: true,
    bbbRating: 'B+'
  },
  {
    id: 'ashland-contractors',
    name: 'Ashland General Contractors',
    trade: 'Contractor',
    phone: '(541) 555-0789',
    website: 'www.ashlandgc.com',
    address: '789 Siskiyou Blvd, Ashland, OR 97520',
    services: ['Home Additions', 'Kitchen Remodeling', 'Bathroom Renovation', 'Deck Construction', 'Roofing'],
    hours: 'Mon-Fri: 7AM-5PM',
    rating: 4.9,
    reviewCount: 91,
    licenseNumber: '789012',
    yearsInBusiness: 25,
    verified: true,
    emergencyService: false
  },
  {
    id: 'handyman-specialists',
    name: 'Southern Oregon Handyman Specialists',
    trade: 'Handyman',
    phone: '(541) 555-0890',
    address: '321 Main St, Jacksonville, OR 97530',
    services: ['Home Repairs', 'Painting', 'Drywall Repair', 'Fixture Installation', 'Minor Plumbing', 'Basic Electrical'],
    hours: 'Mon-Sat: 8AM-5PM',
    rating: 4.4,
    reviewCount: 28,
    yearsInBusiness: 5,
    verified: true
  }
];

// Helper functions
function getTradeIcon(trade) {
  const icons = {
    'Electrician': '⚡',
    'Plumber': '🔧',
    'HVAC': '🌡️',
    'Contractor': '🏗️',
    'Handyman': '🔨'
  };
  return icons[trade] || '🏢';
}

function getTradeColor(trade) {
  const colors = {
    'Electrician': '#F59E0B', // electrician-gold
    'Plumber': '#3B82F6', // plumber-blue
    'HVAC': '#F97316', // hvac-orange
    'Contractor': '#4F46E5', // directory-blue
    'Handyman': '#10B981' // green
  };
  return colors[trade] || '#4F46E5';
}

function filterBusinesses(query, businesses) {
  if (!query || query.length < 2) return businesses;
  
  const searchTerm = query.toLowerCase();
  return businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm) ||
    business.trade.toLowerCase().includes(searchTerm) ||
    business.services.some(service => service.toLowerCase().includes(searchTerm)) ||
    business.address.toLowerCase().includes(searchTerm)
  );
}

function getCommonStyles() {
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #f9fafb;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      /* Header Styles */
      .header {
        background: linear-gradient(135deg, #1e5f3f, #2d7a4b);
        color: white;
        padding: 1rem 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        text-decoration: none;
        color: white;
      }
      
      .nav-links {
        display: flex;
        gap: 2rem;
        list-style: none;
      }
      
      .nav-links a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.2s;
      }
      
      .nav-links a:hover {
        opacity: 0.8;
      }
      
      /* Search Section */
      .search-section {
        background: white;
        padding: 2rem 0;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .search-box {
        max-width: 600px;
        margin: 0 auto;
        position: relative;
      }
      
      .search-input {
        width: 100%;
        padding: 1rem 1.5rem;
        font-size: 1.125rem;
        border: 2px solid #d1d5db;
        border-radius: 12px;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      
      .search-input:focus {
        outline: none;
        border-color: #1e5f3f;
        box-shadow: 0 0 0 3px rgba(30, 95, 63, 0.1);
      }
      
      /* Business Cards Grid */
      .businesses-section {
        padding: 2rem 0;
      }
      
      .section-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .section-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .section-subtitle {
        color: #6b7280;
        font-size: 1.125rem;
      }
      
      .businesses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      /* Business Card Styles */
      .business-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .business-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .business-card.featured {
        border: 2px solid #F59E0B;
        position: relative;
      }
      
      .featured-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background: #F59E0B;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 0 12px 0 12px;
        font-size: 0.875rem;
        font-weight: 600;
        z-index: 10;
      }
      
      .card-header {
        color: white;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .business-info h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
      
      .business-trade {
        opacity: 0.9;
        font-size: 0.875rem;
      }
      
      .trade-icon {
        font-size: 2rem;
        margin-right: 1rem;
      }
      
      .rating-badge {
        background: rgba(255,255,255,0.2);
        padding: 0.5rem;
        border-radius: 8px;
        text-align: center;
        min-width: 60px;
      }
      
      .rating-stars {
        font-size: 0.875rem;
        margin-bottom: 0.125rem;
      }
      
      .rating-count {
        font-size: 0.75rem;
        opacity: 0.8;
      }
      
      .card-body {
        padding: 1.5rem;
      }
      
      .contact-info {
        margin-bottom: 1.5rem;
      }
      
      .contact-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
      
      .contact-icon {
        width: 16px;
        margin-right: 0.5rem;
        color: #6b7280;
      }
      
      .services-section h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: #374151;
      }
      
      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .service-item {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        color: #374151;
      }
      
      .service-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 0.5rem;
      }
      
      .badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0;
      }
      
      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .badge-verified { background: #10b981; color: white; }
      .badge-emergency { background: #ef4444; color: white; }
      .badge-bbb { background: #16a34a; color: white; }
      .badge-years { background: #6b7280; color: white; }
      .badge-license { background: #3b82f6; color: white; }
      
      .card-actions {
        display: flex;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
      }
      
      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        text-align: center;
        transition: all 0.2s;
        border: none;
        cursor: pointer;
      }
      
      .btn-primary {
        background: #1e5f3f;
        color: white;
        flex: 1;
      }
      
      .btn-primary:hover {
        background: #2d7a4b;
        transform: translateY(-1px);
      }
      
      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
        flex: 1;
      }
      
      .btn-secondary:hover {
        background: #e5e7eb;
      }
      
      .btn-icon {
        background: #f3f4f6;
        color: #374151;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .btn-icon:hover {
        background: #e5e7eb;
      }
      
      /* Pagination */
      .pagination {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 3rem 0;
      }
      
      .page-link {
        padding: 0.75rem 1.5rem;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        color: #374151;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s;
      }
      
      .page-link:hover, .page-link.active {
        background: #1e5f3f;
        color: white;
        border-color: #1e5f3f;
      }
      
      /* Footer */
      .footer {
        background: #1f2937;
        color: white;
        padding: 3rem 0 2rem;
        margin-top: 4rem;
      }
      
      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      
      .footer-section h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      .footer-links {
        list-style: none;
      }
      
      .footer-links li {
        margin-bottom: 0.5rem;
      }
      
      .footer-links a {
        color: #d1d5db;
        text-decoration: none;
        transition: color 0.2s;
      }
      
      .footer-links a:hover {
        color: white;
      }
      
      .footer-bottom {
        border-top: 1px solid #374151;
        padding-top: 2rem;
        text-align: center;
        color: #9ca3af;
      }
      
      /* Mobile Responsive */
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          text-align: center;
        }
        
        .nav-links {
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .businesses-grid {
          grid-template-columns: 1fr;
        }
        
        .card-actions {
          flex-direction: column;
        }
        
        .pagination {
          flex-wrap: wrap;
        }
      }
      
      /* Search Results */
      .search-results {
        margin-top: 1rem;
      }
      
      .results-count {
        color: #6b7280;
        margin-bottom: 1rem;
        text-align: center;
      }
      
      .no-results {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
      }
      
      .no-results h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
    </style>
  `;
}

function getBusinessCard(business) {
  const tradeIcon = getTradeIcon(business.trade);
  const tradeColor = getTradeColor(business.trade);
  
  return `
    <div class="business-card ${business.featured ? 'featured' : ''}">
      ${business.featured ? '<div class="featured-badge">⭐ FEATURED</div>' : ''}
      
      <div class="card-header" style="background: linear-gradient(135deg, ${tradeColor}, ${tradeColor}dd);">
        <div class="business-info">
          <div style="display: flex; align-items: center;">
            <span class="trade-icon">${tradeIcon}</span>
            <div>
              <h3>${business.name}</h3>
              <p class="business-trade">Licensed ${business.trade}</p>
            </div>
          </div>
        </div>
        
        ${business.rating ? `
          <div class="rating-badge">
            <div class="rating-stars">⭐ ${business.rating}</div>
            <div class="rating-count">(${business.reviewCount})</div>
          </div>
        ` : ''}
      </div>
      
      <div class="card-body">
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span>${business.phone}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span>${business.address}</span>
          </div>
          ${business.hours ? `
            <div class="contact-item">
              <span class="contact-icon">🕒</span>
              <span>${business.hours}</span>
            </div>
          ` : ''}
          ${business.website ? `
            <div class="contact-item">
              <span class="contact-icon">🌐</span>
              <a href="https://${business.website}" target="_blank" style="color: #4F46E5;">${business.website}</a>
            </div>
          ` : ''}
        </div>
        
        <div class="services-section">
          <h4>✅ Services Offered</h4>
          <div class="services-grid">
            ${business.services.slice(0, 6).map(service => `
              <div class="service-item">
                <div class="service-dot" style="background-color: ${tradeColor};"></div>
                <span>${service}</span>
              </div>
            `).join('')}
          </div>
          ${business.services.length > 6 ? `<p style="font-size: 0.875rem; color: #6b7280;">+${business.services.length - 6} more services</p>` : ''}
        </div>
        
        <div class="badges">
          ${business.verified ? '<span class="badge badge-verified">✓ 100% Verified</span>' : ''}
          ${business.emergencyService ? '<span class="badge badge-emergency">24/7 Emergency</span>' : ''}
          ${business.bbbRating ? `<span class="badge badge-bbb">BBB ${business.bbbRating}</span>` : ''}
          ${business.yearsInBusiness ? `<span class="badge badge-years">${business.yearsInBusiness}+ Years</span>` : ''}
          ${business.licenseNumber ? `<span class="badge badge-license">OR CCB #${business.licenseNumber}</span>` : ''}
        </div>
        
        <div class="card-actions">
          <a href="tel:${business.phone}" class="btn btn-primary">📞 Call Now</a>
          <a href="https://maps.google.com/maps?q=${encodeURIComponent(business.address)}" target="_blank" class="btn btn-secondary">🗺️ Directions</a>
          <a href="#" class="btn btn-icon" title="More Info">ℹ️</a>
        </div>
      </div>
    </div>
  `;
}

function getPageHTML(title, businesses, currentPage = 1, searchQuery = '', totalPages = 2) {
  const resultsText = searchQuery ? 
    `Search results for "${searchQuery}" - ${businesses.length} businesses found` :
    `Page ${currentPage} - ${businesses.length} businesses`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Oregon SMB Directory Test</title>
    <meta name="description" content="Test deployment of Oregon SMB Directory with professional business cards and search functionality.">
    ${getCommonStyles()}
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="/" class="logo">🌲 Oregon SMB Directory</a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/electricians">Electricians</a></li>
                        <li><a href="/contractors">All Contractors</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <!-- Search Section -->
    <section class="search-section">
        <div class="container">
            <div class="search-box">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Search businesses, services, or locations..." 
                    value="${searchQuery}"
                    id="searchInput"
                >
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <main class="businesses-section">
        <div class="container">
            <div class="section-header">
                <h1 class="section-title">${title}</h1>
                <p class="section-subtitle">${resultsText}</p>
            </div>
            
            ${businesses.length > 0 ? `
              <div class="businesses-grid">
                  ${businesses.map(business => getBusinessCard(business)).join('')}
              </div>
              
              ${!searchQuery ? `
                <div class="pagination">
                    ${currentPage > 1 ? `<a href="/page/${currentPage - 1}" class="page-link">← Previous</a>` : ''}
                    ${Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => `
                      <a href="${pageNum === 1 ? '/' : `/page/${pageNum}`}" 
                         class="page-link ${pageNum === currentPage ? 'active' : ''}">
                        ${pageNum}
                      </a>
                    `).join('')}
                    ${currentPage < totalPages ? `<a href="/page/${currentPage + 1}" class="page-link">Next →</a>` : ''}
                </div>
              ` : ''}
            ` : `
              <div class="no-results">
                  <h3>No businesses found</h3>
                  <p>Try adjusting your search terms or browse our categories.</p>
                  <a href="/" class="btn btn-primary" style="display: inline-block; margin-top: 1rem;">View All Businesses</a>
              </div>
            `}
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Oregon SMB Directory</h3>
                    <p style="color: #d1d5db; margin-bottom: 1rem;">Connecting Southern Oregon with trusted local businesses.</p>
                    <p style="color: #9ca3af; font-size: 0.875rem;">Test deployment showcasing professional business cards and directory functionality.</p>
                </div>
                
                <div class="footer-section">
                    <h3>Business Categories</h3>
                    <ul class="footer-links">
                        <li><a href="/electricians">⚡ Electricians</a></li>
                        <li><a href="/plumbers">🔧 Plumbers</a></li>
                        <li><a href="/hvac">🌡️ HVAC Services</a></li>
                        <li><a href="/contractors">🏗️ General Contractors</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Coverage Areas</h3>
                    <ul class="footer-links">
                        <li><a href="#">Medford</a></li>
                        <li><a href="#">Grants Pass</a></li>
                        <li><a href="#">Ashland</a></li>
                        <li><a href="#">Jacksonville</a></li>
                        <li><a href="#">Phoenix</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Contact Info</h3>
                    <ul class="footer-links">
                        <li>📧 info@oregonsmbdirectory.com</li>
                        <li>📞 (541) 555-0123</li>
                        <li>🏢 Southern Oregon</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Oregon SMB Directory. Part of LEVERAGEAI LLC.</p>
                <p style="margin-top: 0.5rem;">Test deployment - Professional directory showcase</p>
            </div>
        </div>
    </footer>

    <script>
        // Simple search functionality
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    window.location.href = '/search?q=' + encodeURIComponent(query);
                } else {
                    window.location.href = '/';
                }
            }
        });
        
        // Add some interactivity to business cards
        document.querySelectorAll('.business-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-6px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-4px)';
            });
        });
    </script>
</body>
</html>`;
}

// Main worker export
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    try {
      // Handle search requests
      if (pathname === '/search') {
        const query = searchParams.get('q') || '';
        const filteredBusinesses = filterBusinesses(query, SAMPLE_BUSINESSES);
        
        return new Response(
          getPageHTML(`Search Results`, filteredBusinesses, 1, query, 1),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }

      // Handle category pages
      if (pathname === '/electricians') {
        const electricians = SAMPLE_BUSINESSES.filter(b => b.trade === 'Electrician');
        return new Response(
          getPageHTML('Southern Oregon Electricians', electricians, 1, '', 1),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }

      if (pathname === '/contractors') {
        return new Response(
          getPageHTML('All Contractors & Services', SAMPLE_BUSINESSES, 1, '', 2),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }

      // Handle pagination
      if (pathname.startsWith('/page/')) {
        const pageNum = parseInt(pathname.split('/')[2]) || 1;
        const perPage = 4;
        const startIndex = (pageNum - 1) * perPage;
        const businesses = SAMPLE_BUSINESSES.slice(startIndex, startIndex + perPage);
        const totalPages = Math.ceil(SAMPLE_BUSINESSES.length / perPage);
        
        return new Response(
          getPageHTML('Southern Oregon Business Directory', businesses, pageNum, '', totalPages),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }

      // Home page - first 4 businesses
      const homeBusinesses = SAMPLE_BUSINESSES.slice(0, 4);
      return new Response(
        getPageHTML('Southern Oregon Business Directory', homeBusinesses, 1, '', 2),
        { headers: { 'Content-Type': 'text/html' } }
      );

    } catch (error) {
      return new Response(`Error: ${error.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};