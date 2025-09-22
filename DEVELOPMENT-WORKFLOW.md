# Oregon SMB Directory - Development Workflow

## Remote Database Development Setup

This project is configured to use the **remote Cloudflare D1 database** during development to ensure you're working with the latest business listings and blog posts.

## Quick Start

```bash
# Start development with remote database (recommended)
npm run dev

# Alternative: Direct wrangler command
wrangler dev --remote --env dev
```

## Available Commands

### Development
- `npm run dev` - Start development server with remote database (recommended)
- `npm run dev:local` - Start with local database (may be outdated)
- `./dev-remote.sh` - Direct script execution with connection testing

### Database Operations
- `npm run db:remote -- --command="SELECT * FROM businesses LIMIT 5;"` - Query remote database
- `npm run db:local -- --command="SELECT * FROM businesses LIMIT 5;"` - Query local database
- `npm run db:backup` - Export remote database

### Deployment
- `npm run deploy` - Deploy to development environment
- `npm run deploy:prod` - Deploy to production

## Database Information

- **Database ID**: `7fc369ad-7c69-4a2d-b5e0-825535c6a094`
- **Remote Business Count**: ~2,282+ businesses
- **Local Business Count**: 2,282 (may be outdated)
- **Blog Posts**: Available in remote database only

## Development Environment

- **Development Worker**: `oregon-smb-directory-dev`
- **Production Worker**: `oregon-smb-directory-prod`
- **Local Server**: `http://localhost:8787`

## Authentication Required

Ensure you're authenticated with Cloudflare:
```bash
wrangler login
wrangler whoami  # Verify authentication
```

## Troubleshooting

### Database Connection Issues
1. Verify authentication: `wrangler whoami`
2. Test database access: `npm run db:remote -- --command="SELECT COUNT(*) FROM businesses;"`
3. Check worker status: `wrangler dev --remote --env dev`

### Local vs Remote Database
- **Remote**: Always current, requires internet connection
- **Local**: Faster, but may have outdated data
- **Recommendation**: Use remote for development, local for testing only

### Blog Posts Missing
Blog posts are only available in the remote database. If you see 0 blog posts, ensure you're using `--remote` flag or the `npm run dev` command.

## Recent Changes

- Modified package.json scripts to default to remote database
- Added development environment configuration
- Created automated development script with connection testing
- Set up database operation shortcuts

## Next Steps

1. Run `npm run dev` to start development
2. Access `http://localhost:8787` to view the directory
3. Test database queries with `npm run db:remote`
4. Deploy changes with `npm run deploy`