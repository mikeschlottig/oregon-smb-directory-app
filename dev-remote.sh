#!/bin/bash

# Oregon SMB Directory - Remote Development Workflow
# This script ensures development uses the remote Cloudflare D1 database

echo "🚀 Starting Oregon SMB Directory development with remote database..."
echo "📊 Database: oregon-smb-directory (remote)"
echo "🌐 Worker: oregon-smb-directory-dev"
echo ""

# Check if wrangler is authenticated
if ! wrangler whoami > /dev/null 2>&1; then
    echo "❌ Please authenticate with Cloudflare first:"
    echo "   wrangler login"
    exit 1
fi

echo "✅ Cloudflare authentication verified"

# Quick database connectivity test
echo "🔍 Testing remote database connection..."
DB_TEST=$(wrangler d1 execute oregon-smb-directory --remote --command="SELECT COUNT(*) as count FROM businesses LIMIT 1;" 2>/dev/null)

if [[ $? -eq 0 ]]; then
    echo "✅ Remote database connected successfully"
    BUSINESS_COUNT=$(echo "$DB_TEST" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo "📈 Total businesses in database: $BUSINESS_COUNT"
else
    echo "❌ Database connection failed. Check your configuration."
    exit 1
fi

echo ""
echo "🔧 Starting development server with remote database..."
echo "   Access your worker at: http://localhost:8787"
echo "   Stop with: Ctrl+C"
echo ""

# Start development with remote database
exec wrangler dev --remote --env dev