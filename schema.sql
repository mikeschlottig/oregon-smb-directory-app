-- Oregon SMB Directory Database Schema
-- This will store all 2,482 businesses from the JSON file

CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'OR',
    industry TEXT NOT NULL,
    services TEXT NOT NULL, -- JSON array stored as text
    verified BOOLEAN NOT NULL DEFAULT true,
    website TEXT,
    yearsInBusiness INTEGER,
    phone TEXT,
    address TEXT,
    email TEXT,
    rating REAL,
    reviewCount INTEGER,
    licenseNumber TEXT,
    bbbRating TEXT,
    emergencyService BOOLEAN DEFAULT false,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_city_industry ON businesses(city, industry);
CREATE INDEX IF NOT EXISTS idx_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_industry ON businesses(industry);
CREATE INDEX IF NOT EXISTS idx_verified ON businesses(verified);
CREATE INDEX IF NOT EXISTS idx_rating ON businesses(rating);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    status TEXT DEFAULT 'draft', -- 'draft' or 'published'
    featured_image TEXT,
    author TEXT,
    tags TEXT, -- JSON array stored as text
    meta_title TEXT,
    meta_description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    published_at TEXT
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    inquiry_type TEXT,
    message TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new'
);

-- Business listing submissions table
CREATE TABLE IF NOT EXISTS listing_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    website TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    industry TEXT NOT NULL,
    services TEXT NOT NULL,
    years_in_business INTEGER,
    license_number TEXT,
    listing_plan TEXT NOT NULL,
    emergency_service BOOLEAN DEFAULT FALSE,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending'
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_listing_status ON listing_submissions(status);