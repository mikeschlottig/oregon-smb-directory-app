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