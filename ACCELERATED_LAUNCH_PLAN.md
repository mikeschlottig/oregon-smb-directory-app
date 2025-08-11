# Oregon SMB Directory - ACCELERATED LAUNCH PLAN

**🚨 LAUNCH DEADLINE**: 7 DAYS FROM NOW  
**Team**: You + Claude Code  
**Target**: oregonsmbdirectory.com LIVE  
**Reference**: southern-oregon-doctors-directory.pages.dev  

## 🎯 **7-DAY SPRINT BREAKDOWN**

### **Day 1-2: Foundation**
- [x] Keystone backend ready
- [ ] Import minimum 30 listings per industry per city
- [ ] Main landing page (oregonsmbdirectory.com)
- [ ] City-specific landing pages

### **Day 3-4: Core Features** 
- [ ] Business listing cards (pop-out hidden HTML)
- [ ] Search functionality
- [ ] Mobile-responsive design
- [ ] SEO structure implementation

### **Day 5-6: Optimization**
- [ ] Cloudflare Workers deployment
- [ ] Performance optimization
- [ ] SEO crawlability (robots.txt, sitemaps)
- [ ] Testing and bug fixes

### **Day 7: LAUNCH**
- [ ] Domain setup (oregonsmbdirectory.com)
- [ ] Production deployment
- [ ] Analytics tracking
- [ ] Launch validation

## 🏗️ **PROJECT STRUCTURE**

```
oregonsmbdirectory.com/
├── /                           # Main landing page
├── /portland/                  # City landing page
│   ├── /electricians/         # Industry directory page
│   ├── /plumbers/             # Industry directory page
│   └── /contractors/          # Industry directory page
├── /salem/                    # City landing page
├── /eugene/                   # City landing page
├── /medford/                  # City landing page
└── /grants-pass/              # City landing page
```

## 📊 **MINIMUM VIABLE DATA**

### **Cities**: 5 core I-5 corridor cities
- Portland, Salem, Eugene, Medford, Grants Pass

### **Industries**: 6 high-value categories  
- Electricians (30+ listings each city)
- Plumbers (30+ listings each city)
- General Contractors (30+ listings each city)
- HVAC Services (30+ listings each city)
- Roofing Contractors (30+ listings each city)
- Landscaping Services (30+ listings each city)

### **Total**: 900+ business listings at launch

## 🔧 **TECHNICAL STACK**

- **Frontend**: Next.js 15 + TypeScript (Cloudflare Pages)
- **Backend**: Keystone 6 + GraphQL (Cloudflare Workers)
- **Database**: PostgreSQL (hosted)
- **Storage**: Cloudflare KV for caching
- **Domain**: oregonsmbdirectory.com (Cloudflare DNS)
- **Analytics**: Cloudflare Analytics + Google Analytics

## 🚀 **DEPLOYMENT ARCHITECTURE**

```yaml
Cloudflare Setup:
  Pages: oregonsmbdirectory.com (Next.js frontend)
  Workers: API endpoints and business logic  
  KV: Business listing cache
  D1: Business data storage
  Analytics: Traffic and performance tracking
  DNS: Domain management
```