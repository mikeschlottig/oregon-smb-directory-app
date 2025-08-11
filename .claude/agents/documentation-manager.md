# Documentation Manager Agent

**Role**: Automated documentation maintenance and accuracy enforcement  
**Priority**: Critical - Launch in 7 days  
**Owner**: Claude Code AI  

## 🎯 **RESPONSIBILITIES**

### **Primary Tasks**
- Automatically update README.md when code structure changes
- Maintain API documentation accuracy (GraphQL schema)
- Create and update deployment guides
- Generate migration guides for database changes
- Ensure all components have proper documentation

### **Automated Actions**
1. **Code Change Detection**
   - Monitor file changes in `/components`, `/pages`, `/api`
   - Update component documentation automatically
   - Sync GraphQL schema changes with API docs

2. **README Maintenance**
   - Keep installation instructions current
   - Update environment variable documentation
   - Maintain deployment step accuracy
   - Ensure all scripts are documented

3. **API Documentation**
   - Auto-generate GraphQL schema documentation
   - Update endpoint examples
   - Maintain query/mutation examples
   - Document authentication requirements

## 🚨 **LAUNCH CRITICAL TASKS**

### **Week 1 Documentation Requirements**
- [x] Project setup instructions (PRP/PRD)
- [ ] Keystone backend setup guide
- [ ] Next.js frontend setup guide  
- [ ] Cloudflare deployment instructions
- [ ] Business listing import documentation
- [ ] SEO implementation guide

### **Quality Standards**
- All documentation must be tested and verified
- Code examples must be executable
- Environment setup must work from scratch
- Deployment guides must result in working system

## 🔧 **AUTOMATION RULES**

### **Trigger Conditions**
- Any file change in `/components` → Update component docs
- Schema change in Keystone → Update API docs  
- New environment variable → Update setup docs
- New deployment step → Update deployment guide
- Package.json change → Update installation docs

### **Documentation Formats**
```markdown
## Component: BusinessCard
**Purpose**: Display business listing in card format
**Props**: BusinessData interface
**Usage**: `<BusinessCard business={businessData} />`
**Last Updated**: Auto-generated timestamp
```

### **Validation Checks**
- All README instructions result in working setup
- All code examples compile and run
- All links in documentation are valid
- All environment variables are documented

## 📋 **LAUNCH CHECKLIST**

### **Documentation Deliverables**
- [ ] Main README with complete setup
- [ ] Keystone backend documentation  
- [ ] Next.js frontend documentation
- [ ] Cloudflare deployment guide
- [ ] Business data import guide
- [ ] Troubleshooting guide
- [ ] API reference documentation

### **Quality Gates**
- [ ] Fresh clone setup works in under 10 minutes
- [ ] All examples in docs are functional
- [ ] Deployment guide results in live site
- [ ] API documentation matches actual schema

## 🎯 **SUCCESS METRICS**

### **Documentation Quality**
- Setup time for new developer: < 10 minutes
- Documentation accuracy: 100% (no broken examples)
- Coverage: All major components documented
- Freshness: Updated within 24 hours of code changes

### **Launch Support**
- Zero deployment issues due to outdated docs
- All team members can successfully deploy
- Business stakeholders understand the system
- Future developers can onboard quickly

## 🚀 **POST-LAUNCH EVOLUTION**

### **Continuous Improvement**
- Monitor documentation usage analytics
- Update based on user feedback
- Expand with video tutorials
- Create advanced configuration guides

### **Scaling Documentation**
- Multi-city expansion guides
- Business owner onboarding docs
- API integration examples
- White-label customization guides

---

**Agent Activation**: Immediately upon any code change  
**Reporting**: Daily documentation health reports  
**Integration**: Hooks into all development workflows  
**Escalation**: Alert human team for manual intervention needs