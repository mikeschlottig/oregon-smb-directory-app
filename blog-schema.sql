-- Blog posts table for Oregon SMB Directory
-- This extends the existing database without affecting the businesses table

CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published'
    featured_image TEXT,
    author TEXT DEFAULT 'Oregon SMB Directory',
    tags TEXT, -- JSON array stored as text
    meta_title TEXT,
    meta_description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    published_at TEXT
);

-- Indexes for blog performance
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_created_at ON blog_posts(created_at);