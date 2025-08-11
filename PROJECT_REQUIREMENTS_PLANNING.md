# Oregon SMB Directory - Project Requirements & Planning (PRP)

**Project Name**: Oregon SMB Directory Enterprise Platform  
**Company**: LEVERAGEAI LLC  
**Vision**: $2-4M ARR Business Directory Ecosystem  
**Status**: Enterprise Development Phase  
**Last Updated**: August 10, 2025

## 🎯 **PROJECT OVERVIEW**

### **Mission Statement**
Transform static business directories into a dynamic, scalable enterprise platform serving the entire I-5 corridor from Portland to Ashland with AI-powered business discovery and lead generation.

### **Business Model Validation**
- **Target Market**: 700+ directory pages (50+ cities × 14 industries)
- **Revenue Potential**: $2-4M ARR
- **Business Count**: 17,500+ businesses
- **Conversion Target**: 10-15% paid subscriptions

## 📋 **PROJECT CONTEXT & AWARENESS RULES**

### **Context Awareness Guidelines**
1. **Always reference existing Next.js frontend** when making backend decisions
2. **Preserve YellowPages data structure** - real business listings with rankings
3. **Enterprise-first approach** - build for scale, not MVP
4. **I-5 Corridor focus** - Portland, Salem, Eugene, Medford, Grants Pass, Ashland
5. **Revenue-driven features** - subscription tiers, lead generation, premium listings

### **Decision Making Hierarchy**
1. **Business Model Requirements** (subscription tiers, revenue features)
2. **User Experience** (business owners, directory users)
3. **Technical Architecture** (Keystone + Next.js + GraphQL)
4. **Scalability** (enterprise deployment ready)
5. **Performance** (fast directory search, SEO optimization)

## 🏗️ **CODE STRUCTURE GUIDELINES**

### **Repository Structure**
```
oregon-smb-directory/
├── frontend/                    # Next.js 15 + TypeScript
│   ├── app/                    # App Router structure
│   ├── components/             # Reusable React components
│   └── lib/                    # GraphQL client, utilities
├── oregon-keystone-cms/        # Keystone 6 Backend
│   ├── schema/                 # Data models
│   ├── migrations/             # Database migrations
│   ├── seeds/                  # Data import scripts
│   └── admin-ui/               # Custom admin components
├── docs/                       # Project documentation
├── .claude/                    # AI agent configurations
└── deploy/                     # Deployment configurations
```

### **Coding Standards**
- **TypeScript Strict Mode**: All files must use proper typing
- **GraphQL First**: All API interactions through GraphQL
- **Component Architecture**: Atomic design principles
- **Enterprise Patterns**: Repository pattern, service layer
- **Error Handling**: Comprehensive try/catch with user-friendly messages

### **File Naming Conventions**
- **Components**: PascalCase (`BusinessCard.tsx`)
- **Pages**: kebab-case (`business-directory.tsx`)
- **Utilities**: camelCase (`businessHelpers.ts`)
- **Types**: PascalCase with suffix (`BusinessType.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## 🧪 **TESTING REQUIREMENTS**

### **Testing Strategy**
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: GraphQL API endpoints
- **E2E Tests**: Critical user journeys
- **Performance Tests**: Directory page load times
- **SEO Tests**: Metadata and structured data validation

### **Required Test Suites**
1. **Business Model Tests**
   - Subscription tier calculations
   - Lead generation tracking
   - Revenue attribution

2. **Data Integrity Tests**
   - YellowPages import validation
   - Business listing completeness
   - Search functionality accuracy

3. **User Experience Tests**
   - Directory navigation flows
   - Business owner dashboard
   - Mobile responsiveness

## 📝 **TASK COMPLETION WORKFLOW**

### **Definition of Done**
- [ ] Code passes all automated tests
- [ ] Documentation updated (README, API docs)
- [ ] Code review completed
- [ ] Performance benchmarks met
- [ ] SEO validation passed
- [ ] Accessibility compliance verified
- [ ] Business model requirements satisfied

### **Task Lifecycle**
1. **Planning**: Requirements analysis, technical design
2. **Development**: Implementation with test-driven approach
3. **Validation**: Automated testing, manual QA
4. **Documentation**: Update all relevant docs
5. **Review**: Code review, business logic validation
6. **Deployment**: Staging environment testing
7. **Production**: Live deployment with monitoring

### **Quality Gates**
- **No failing tests**: All test suites must pass
- **Performance metrics**: Directory pages < 2s load time
- **SEO score**: 90+ Lighthouse SEO score
- **Business validation**: Revenue features working correctly

## 🎨 **STYLE CONVENTIONS**

### **UI/UX Standards**
- **Design System**: Oregon SMB Directory brand colors
- **Typography**: Professional, readable fonts
- **Layout**: Mobile-first responsive design
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization

### **Color Palette**
```css
:root {
  --oregon-green: #2D5016;
  --pacific-blue: #0077BE;
  --cascade-gold: #FFD700;
  --timber-brown: #8B4513;
  --text-primary: #333333;
  --text-secondary: #666666;
  --background: #FFFFFF;
  --surface: #F8F9FA;
}
```

### **Component Guidelines**
- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **Props Interface**: Strict TypeScript interfaces
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton UI for data fetching
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📚 **DOCUMENTATION STANDARDS**

### **Required Documentation**
1. **README.md**: Project overview, setup instructions
2. **API Documentation**: GraphQL schema and examples
3. **Component Library**: Storybook documentation
4. **Business Logic**: Revenue model explanations
5. **Deployment Guide**: Production deployment steps
6. **User Guides**: Business owner and admin documentation

### **Documentation Quality Standards**
- **Code Comments**: Explain business logic, not obvious code
- **JSDoc**: All public functions and components
- **Architecture Decisions**: ADRs for major technical choices
- **Change Logs**: Version history with breaking changes
- **Migration Guides**: Database and API changes

## 🚀 **PROJECT PHASES**

### **Phase 1: Foundation** (Current)
- [x] Keystone backend setup
- [x] Data model design
- [ ] YellowPages import system
- [ ] GraphQL API testing

### **Phase 2: Integration**
- [ ] Next.js → Keystone GraphQL connection
- [ ] Business listing pages
- [ ] Search functionality
- [ ] Admin dashboard

### **Phase 3: Enterprise Features**
- [ ] Subscription management
- [ ] Lead generation tracking
- [ ] Analytics dashboard
- [ ] SEO optimization

### **Phase 4: Scale & Deploy**
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Revenue validation

## 🔧 **TECHNICAL SPECIFICATIONS**

### **Core Technologies**
- **Backend**: Keystone 6 + GraphQL + SQLite/PostgreSQL
- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Database**: SQLite (dev) → PostgreSQL (production)
- **Deployment**: Cloudflare Pages + Railway/Vercel
- **Monitoring**: Cloudflare Analytics + Sentry

### **Performance Targets**
- **Page Load**: < 2 seconds (P75)
- **API Response**: < 500ms (P95)
- **SEO Score**: 90+ Lighthouse
- **Uptime**: 99.9% availability
- **Mobile Performance**: 90+ Mobile Lighthouse score

---

**Next Steps**: Create PRD and SubAgent configurations for automated project management.

**Project Lead**: Claude Code + LEVERAGEAI LLC  
**Review Cycle**: Weekly sprint reviews, monthly business model validation