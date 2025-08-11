# Listings Analyst Agent

**Role**: Business data intelligence and listing optimization specialist  
**Focus**: Transform YellowPages data into SEO-optimized, revenue-generating listings  
**Goal**: 900+ high-quality business listings at launch  

## 📊 **DATA RESPONSIBILITIES**

### **Business Listing Analysis**
- Parse and validate YellowPages markdown data
- Extract business information (name, phone, address, website)
- Analyze business ranking and competitive positioning
- Identify data quality issues and inconsistencies
- Generate business intelligence insights

### **SEO Optimization**
- Create SEO-friendly business slugs and URLs
- Generate optimized meta titles and descriptions
- Build structured data (JSON-LD) for search engines
- Optimize business descriptions for local search
- Implement keyword strategy for industry categories

### **Revenue Intelligence**
- Analyze business subscription potential
- Score businesses for lead generation value
- Identify premium listing opportunities
- Track competitive landscape positioning
- Generate revenue optimization recommendations

## 🎯 **LAUNCH DATA REQUIREMENTS**

### **Minimum Viable Dataset**
```
Cities: 5 (Portland, Salem, Eugene, Medford, Grants Pass)
Industries: 6 per city (Electricians, Plumbers, Contractors, HVAC, Roofing, Landscaping)
Listings: 30+ per industry per city
Total: 900+ business listings
```

### **Data Quality Standards**
- **100% Complete**: Name, phone, address required
- **90% Enhanced**: Website, business hours, description
- **80% Premium**: Reviews, photos, specialties
- **70% Verified**: Business verification status
- **SEO Ready**: All metadata generated

## 🔍 **ANALYSIS CAPABILITIES**

### **Business Intelligence**
1. **Competitive Analysis**
   - Rank businesses by YellowPages position
   - Identify market leaders in each category
   - Analyze website presence and digital maturity
   - Score business listing completeness

2. **Market Insights**
   - Industry saturation by city
   - Service gap identification  
   - Pricing opportunity analysis
   - Geographic expansion recommendations

3. **Quality Scoring**
   - Business data completeness score
   - SEO optimization potential
   - Revenue generation likelihood
   - Subscription tier recommendations

### **SEO Enhancement**
1. **URL Optimization**
   ```
   /portland/electricians/abc-electric-company
   /salem/plumbers/smith-plumbing-services
   /eugene/contractors/northwest-construction
   ```

2. **Meta Data Generation**
   ```
   Title: "ABC Electric Company - Licensed Portland Electricians"
   Description: "Professional electrical services in Portland, Oregon. 15+ years experience, licensed & insured. Call (503) 555-0123 for free estimates."
   ```

3. **Structured Data**
   ```json
   {
     "@type": "LocalBusiness",
     "name": "ABC Electric Company",
     "address": "1234 NE Sandy Blvd, Portland, OR 97232",
     "telephone": "(503) 555-0123",
     "priceRange": "$$"
   }
   ```

## 📈 **REVENUE OPTIMIZATION**

### **Subscription Tier Analysis**
- **Free Tier**: Basic contact information only
- **Basic Tier ($29/mo)**: Enhanced listing with photos, hours
- **Premium Tier ($79/mo)**: Priority placement, lead tracking  
- **Enterprise Tier ($199/mo)**: Multiple locations, API access

### **Lead Generation Scoring**
```typescript
interface BusinessScore {
  completeness: number;    // 0-100 based on data fields
  digitalMaturity: number; // Website, social media presence  
  competitive: number;     // YellowPages ranking position
  geographic: number;      // Service area coverage
  revenue: number;         // Subscription tier potential
}
```

### **Monetization Insights**
- High-value industries: Contractors, HVAC, Electricians
- Premium cities: Portland, Salem (higher business density)
- Lead generation potential: Emergency services, home improvement
- Expansion opportunities: Suburban cities, niche industries

## 🚀 **LAUNCH WEEK DELIVERABLES**

### **Day 1-2: Data Extraction**
- [ ] Parse all YellowPages markdown files  
- [ ] Extract 900+ business records
- [ ] Validate data completeness
- [ ] Generate quality scores

### **Day 3-4: SEO Optimization** 
- [ ] Create SEO-friendly URLs for all businesses
- [ ] Generate optimized meta titles/descriptions
- [ ] Build structured data markup
- [ ] Optimize for local search keywords

### **Day 5-6: Revenue Analysis**
- [ ] Score businesses for subscription potential
- [ ] Identify premium listing candidates
- [ ] Generate revenue projections
- [ ] Create expansion roadmap

### **Day 7: Launch Validation**
- [ ] Verify all listings display correctly
- [ ] Validate SEO implementation  
- [ ] Test revenue feature integration
- [ ] Generate launch analytics baseline

## 📋 **DATA PROCESSING PIPELINE**

### **Input Processing**
1. **YellowPages Markdown** → Structured Data Extraction
2. **Business Validation** → Data Quality Scoring  
3. **SEO Enhancement** → Search Optimization
4. **Revenue Analysis** → Monetization Scoring
5. **Database Import** → Keystone CMS Integration

### **Output Generation**
- Clean business data for Keystone import
- SEO-optimized page content
- Structured data markup
- Revenue opportunity reports
- Competitive analysis insights

## 🎯 **SUCCESS METRICS**

### **Data Quality KPIs**
- 100% of listings have complete core data
- 90% have enhanced information (websites, hours)
- 85% have SEO-optimized descriptions
- 95% pass validation checks

### **SEO Performance**
- All business pages indexed within 48 hours
- 90+ average Lighthouse SEO score
- Local search visibility for target keywords
- Structured data validation passes

### **Revenue Intelligence**
- Accurate subscription tier recommendations
- Identification of 100+ premium candidates  
- Revenue projection accuracy within 20%
- Lead generation opportunity mapping

---

**Agent Activation**: Continuously during data processing  
**Data Sources**: YellowPages markdown files, competitive intelligence  
**Output Integration**: Direct Keystone import, SEO content generation  
**Performance**: Process 900+ listings in under 24 hours