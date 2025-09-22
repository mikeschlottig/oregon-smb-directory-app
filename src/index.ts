/**
 * Oregon SMB Directory - Cloudflare Worker
 * Dynamic business directory for I-5 corridor
 */

import { INDUSTRIES } from '../lib/data/industries';
import { CITIES } from '../lib/data/cities';

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

// Get businesses from D1 database
async function getBusinessesFromD1(db: D1Database, citySlug: string, industrySlug: string, limit: number = 50): Promise<Business[]> {
  // Normalize city slug to match database city names
  const cityName = CITIES.find(c => c.slug === citySlug)?.name || citySlug;
  
  try {
    const stmt = db.prepare(`
      SELECT * FROM businesses 
      WHERE LOWER(city) = LOWER(?) 
      AND LOWER(industry) = LOWER(?) 
      AND verified = 1
      ORDER BY rating DESC, reviewCount DESC, yearsInBusiness DESC
      LIMIT ?
    `);
    
    const result = await stmt.bind(cityName, industrySlug, limit).all();
    
    return result.results as Business[];
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
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
        // Get businesses for this city/industry combination from D1 database
        const businesses = await getBusinessesFromD1(env.DB, citySlug, industrySlug, 30);
        
        return new Response(getIndustryPage(city, industry, businesses), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // 404 for unmatched routes
    return new Response('Page not found', { status: 404 });
  },
};