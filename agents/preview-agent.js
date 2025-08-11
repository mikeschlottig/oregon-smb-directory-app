#!/usr/bin/env node

/**
 * Oregon SMB Directory - Preview Agent
 * 
 * Comprehensive testing and preview system for validating the application
 * with real business data before final deployment.
 * 
 * Features:
 * - Live development server management
 * - Automated testing of all routes and pages
 * - Business modal functionality testing
 * - SEO metadata validation
 * - Performance metrics collection
 * - Mobile responsiveness testing
 * - Data integrity verification
 * - Preview report generation
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

class PreviewAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.testResults = {
      routes: [],
      performance: {},
      seo: {},
      accessibility: {},
      mobile: {},
      dataIntegrity: [],
      issues: [],
      summary: {}
    };
    this.server = null;
    this.browser = null;
    this.serverPort = 3000;
    this.baseUrl = `http://localhost:${this.serverPort}`;
    
    // Test configuration
    this.cities = ['portland', 'salem', 'eugene', 'bend', 'medford', 'grants-pass'];
    this.industries = ['restaurants', 'retail', 'services', 'healthcare', 'automotive', 'professional'];
    
    console.log('🔍 Oregon SMB Directory Preview Agent Initialized');
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log('\n🚀 Starting Preview Agent Test Suite...\n');
      
      await this.validateProject();
      await this.startDevelopmentServer();
      await this.initializeBrowser();
      
      await this.testAllRoutes();
      await this.testBusinessModals();
      await this.validateDataIntegrity();
      await this.runPerformanceTests();
      await this.testMobileResponsiveness();
      await this.validateSEOCompliance();
      
      await this.generatePreviewReport();
      await this.cleanup();
      
      console.log('\n✅ Preview Agent Test Suite Complete!');
      console.log('📊 Check the generated preview report for detailed results.');
      
    } catch (error) {
      console.error('❌ Preview Agent Error:', error.message);
      await this.cleanup();
      process.exit(1);
    }
  }

  /**
   * Validate project structure and dependencies
   */
  async validateProject() {
    console.log('🔍 Validating project structure...');
    
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'lib/data/businesses.ts',
      'components/BusinessModal.tsx',
      'app/layout.tsx'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      try {
        await fs.access(filePath);
        console.log(`  ✅ ${file} found`);
      } catch (error) {
        this.testResults.issues.push(`Missing required file: ${file}`);
        console.log(`  ❌ ${file} missing`);
      }
    }

    // Check if businesses data is populated
    try {
      const businessesPath = path.join(this.projectRoot, 'lib/data/businesses.ts');
      const businessesContent = await fs.readFile(businessesPath, 'utf8');
      
      if (businessesContent.includes('// TODO') || businessesContent.length < 1000) {
        this.testResults.issues.push('Businesses data appears to be placeholder or incomplete');
        console.log('  ⚠️  Businesses data may be incomplete');
      } else {
        console.log('  ✅ Businesses data appears populated');
      }
    } catch (error) {
      this.testResults.issues.push('Could not validate businesses data');
    }
  }

  /**
   * Start Next.js development server
   */
  async startDevelopmentServer() {
    return new Promise((resolve, reject) => {
      console.log('🚀 Starting development server...');
      
      this.server = spawn('npm', ['run', 'dev'], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      let serverReady = false;
      
      this.server.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready') || output.includes('started server')) {
          if (!serverReady) {
            serverReady = true;
            console.log('  ✅ Development server started');
            setTimeout(resolve, 2000); // Give server time to fully initialize
          }
        }
      });

      this.server.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('Error') && !serverReady) {
          console.error('  ❌ Server startup error:', error);
          reject(new Error('Failed to start development server'));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server startup timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Initialize Puppeteer browser
   */
  async initializeBrowser() {
    console.log('🌐 Initializing browser for testing...');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    console.log('  ✅ Browser initialized');
  }

  /**
   * Test all application routes
   */
  async testAllRoutes() {
    console.log('🔗 Testing all application routes...');
    
    const routes = this.generateRoutes();
    const page = await this.browser.newPage();
    
    for (const route of routes) {
      try {
        console.log(`  Testing: ${route.path}`);
        
        const startTime = Date.now();
        const response = await page.goto(`${this.baseUrl}${route.path}`, {
          waitUntil: 'networkidle2',
          timeout: 10000
        });
        
        const loadTime = Date.now() - startTime;
        const status = response.status();
        
        // Check for page content
        const title = await page.title();
        const hasContent = await page.$eval('body', el => el.textContent.trim().length > 0);
        
        const routeResult = {
          path: route.path,
          type: route.type,
          status,
          loadTime,
          title,
          hasContent,
          success: status === 200 && hasContent
        };
        
        this.testResults.routes.push(routeResult);
        
        if (!routeResult.success) {
          this.testResults.issues.push(`Route failed: ${route.path} (Status: ${status})`);
          console.log(`    ❌ Failed (Status: ${status})`);
        } else {
          console.log(`    ✅ Success (${loadTime}ms)`);
        }
        
        // Brief pause between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
        this.testResults.issues.push(`Route error: ${route.path} - ${error.message}`);
        
        this.testResults.routes.push({
          path: route.path,
          type: route.type,
          status: 0,
          loadTime: 0,
          title: '',
          hasContent: false,
          success: false,
          error: error.message
        });
      }
    }
    
    await page.close();
    
    const successfulRoutes = this.testResults.routes.filter(r => r.success).length;
    const totalRoutes = this.testResults.routes.length;
    
    console.log(`  📊 Routes tested: ${successfulRoutes}/${totalRoutes} successful`);
  }

  /**
   * Generate all application routes for testing
   */
  generateRoutes() {
    const routes = [
      { path: '/', type: 'home' }
    ];

    // Generate city/industry combination routes
    for (const city of this.cities) {
      for (const industry of this.industries) {
        routes.push({
          path: `/${city}/${industry}`,
          type: 'city-industry'
        });
      }
    }

    // Add individual city pages
    for (const city of this.cities) {
      routes.push({
        path: `/${city}`,
        type: 'city'
      });
    }

    return routes;
  }

  /**
   * Test business modal functionality
   */
  async testBusinessModals() {
    console.log('🏢 Testing business modal functionality...');
    
    const page = await this.browser.newPage();
    let modalsTest = 0;
    let modalsSuccess = 0;
    
    try {
      // Test modals on a city/industry page
      await page.goto(`${this.baseUrl}/portland/restaurants`, {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      // Wait for business cards to load
      await page.waitForSelector('[data-testid="business-card"], .business-card, .cursor-pointer', {
        timeout: 5000
      });
      
      // Find clickable business elements
      const businessElements = await page.$$('[data-testid="business-card"], .business-card, .cursor-pointer');
      
      if (businessElements.length === 0) {
        this.testResults.issues.push('No clickable business elements found');
        console.log('  ❌ No business elements found to test modals');
      } else {
        console.log(`  Found ${businessElements.length} business elements to test`);
        
        // Test first few business modals
        const elementsToTest = Math.min(5, businessElements.length);
        
        for (let i = 0; i < elementsToTest; i++) {
          try {
            modalsTest++;
            console.log(`    Testing modal ${i + 1}...`);
            
            await businessElements[i].click();
            
            // Wait for modal to appear
            await page.waitForSelector('[data-testid="business-modal"], .modal, [role="dialog"]', {
              timeout: 3000
            });
            
            // Check modal content
            const modalContent = await page.$eval(
              '[data-testid="business-modal"], .modal, [role="dialog"]',
              el => el.textContent.trim().length
            );
            
            if (modalContent > 50) { // Modal has substantial content
              modalsSuccess++;
              console.log(`      ✅ Modal ${i + 1} loaded successfully`);
            } else {
              this.testResults.issues.push(`Modal ${i + 1} has insufficient content`);
            }
            
            // Close modal (try multiple methods)
            const closeButton = await page.$('[data-testid="close-modal"], .close, button:contains("Close")');
            if (closeButton) {
              await closeButton.click();
            } else {
              // Try clicking outside modal
              await page.keyboard.press('Escape');
            }
            
            // Wait for modal to close
            await page.waitForFunction(
              () => !document.querySelector('[data-testid="business-modal"], .modal, [role="dialog"]'),
              { timeout: 2000 }
            );
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (error) {
            console.log(`      ❌ Modal ${i + 1} test failed: ${error.message}`);
            this.testResults.issues.push(`Modal test failed: ${error.message}`);
            
            // Try to recover by refreshing
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForSelector('[data-testid="business-card"], .business-card, .cursor-pointer');
          }
        }
      }
      
    } catch (error) {
      console.log(`  ❌ Modal testing failed: ${error.message}`);
      this.testResults.issues.push(`Modal testing failed: ${error.message}`);
    }
    
    await page.close();
    
    console.log(`  📊 Modals tested: ${modalsSuccess}/${modalsTest} successful`);
    this.testResults.summary.modalTests = { success: modalsSuccess, total: modalsTest };
  }

  /**
   * Validate data integrity
   */
  async validateDataIntegrity() {
    console.log('📊 Validating data integrity...');
    
    const page = await this.browser.newPage();
    const dataIssues = [];
    
    try {
      // Test data on multiple pages
      for (const city of ['portland', 'salem', 'eugene']) {
        for (const industry of ['restaurants', 'retail']) {
          try {
            await page.goto(`${this.baseUrl}/${city}/${industry}`);
            
            // Check for business data
            const businessCount = await page.$$eval(
              '[data-testid="business-card"], .business-card',
              elements => elements.length
            );
            
            if (businessCount === 0) {
              dataIssues.push(`No businesses found for ${city}/${industry}`);
            } else {
              console.log(`  ✅ ${city}/${industry}: ${businessCount} businesses`);
            }
            
            // Check for required business information
            const businessData = await page.evaluate(() => {
              const cards = document.querySelectorAll('[data-testid="business-card"], .business-card');
              const issues = [];
              
              cards.forEach((card, index) => {
                const text = card.textContent || '';
                
                if (!text.includes('@') && !text.includes('phone') && !text.includes('contact')) {
                  issues.push(`Business ${index + 1} missing contact information`);
                }
                
                if (text.length < 50) {
                  issues.push(`Business ${index + 1} has insufficient content`);
                }
              });
              
              return issues;
            });
            
            dataIssues.push(...businessData);
            
          } catch (error) {
            dataIssues.push(`Data validation failed for ${city}/${industry}: ${error.message}`);
          }
        }
      }
      
    } catch (error) {
      dataIssues.push(`Data integrity validation failed: ${error.message}`);
    }
    
    await page.close();
    
    this.testResults.dataIntegrity = dataIssues;
    console.log(`  📊 Data integrity issues found: ${dataIssues.length}`);
    
    if (dataIssues.length > 0) {
      console.log('  Issues:');
      dataIssues.slice(0, 5).forEach(issue => console.log(`    - ${issue}`));
      if (dataIssues.length > 5) {
        console.log(`    ... and ${dataIssues.length - 5} more`);
      }
    }
  }

  /**
   * Run performance tests using Lighthouse
   */
  async runPerformanceTests() {
    console.log('⚡ Running performance tests...');
    
    const testUrls = [
      { url: '/', name: 'homepage' },
      { url: '/portland/restaurants', name: 'city-industry-page' },
      { url: '/salem', name: 'city-page' }
    ];
    
    for (const testUrl of testUrls) {
      try {
        console.log(`  Testing performance: ${testUrl.name}`);
        
        const result = await lighthouse(`${this.baseUrl}${testUrl.url}`, {
          port: 0, // Use headless Chrome
          output: 'json',
          quiet: true,
          chromeFlags: ['--headless', '--no-sandbox']
        });
        
        const scores = result.lhr.categories;
        const metrics = result.lhr.audits;
        
        const performanceData = {
          url: testUrl.url,
          name: testUrl.name,
          performance: Math.round(scores.performance.score * 100),
          accessibility: Math.round(scores.accessibility.score * 100),
          bestPractices: Math.round(scores['best-practices'].score * 100),
          seo: Math.round(scores.seo.score * 100),
          firstContentfulPaint: metrics['first-contentful-paint']?.displayValue || 'N/A',
          largestContentfulPaint: metrics['largest-contentful-paint']?.displayValue || 'N/A',
          cumulativeLayoutShift: metrics['cumulative-layout-shift']?.displayValue || 'N/A'
        };
        
        this.testResults.performance[testUrl.name] = performanceData;
        
        console.log(`    ✅ Performance: ${performanceData.performance}%`);
        console.log(`    ✅ Accessibility: ${performanceData.accessibility}%`);
        console.log(`    ✅ SEO: ${performanceData.seo}%`);
        
        // Flag performance issues
        if (performanceData.performance < 70) {
          this.testResults.issues.push(`Poor performance score for ${testUrl.name}: ${performanceData.performance}%`);
        }
        
      } catch (error) {
        console.log(`    ❌ Performance test failed for ${testUrl.name}: ${error.message}`);
        this.testResults.issues.push(`Performance test failed: ${testUrl.name}`);
      }
    }
  }

  /**
   * Test mobile responsiveness
   */
  async testMobileResponsiveness() {
    console.log('📱 Testing mobile responsiveness...');
    
    const page = await this.browser.newPage();
    const mobileViewports = [
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'Android Phone', width: 412, height: 869 },
      { name: 'Tablet', width: 768, height: 1024 }
    ];
    
    const testPages = ['/', '/portland/restaurants'];
    
    for (const viewport of mobileViewports) {
      try {
        console.log(`  Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await page.setViewport({
          width: viewport.width,
          height: viewport.height
        });
        
        for (const testPage of testPages) {
          try {
            await page.goto(`${this.baseUrl}${testPage}`, {
              waitUntil: 'networkidle2'
            });
            
            // Check for mobile-specific issues
            const mobileIssues = await page.evaluate(() => {
              const issues = [];
              
              // Check for horizontal scrolling
              if (document.body.scrollWidth > window.innerWidth) {
                issues.push('Horizontal scrolling detected');
              }
              
              // Check for tiny text
              const elements = document.querySelectorAll('*');
              let tinyTextCount = 0;
              elements.forEach(el => {
                const fontSize = window.getComputedStyle(el).fontSize;
                if (fontSize && parseFloat(fontSize) < 12) {
                  tinyTextCount++;
                }
              });
              
              if (tinyTextCount > 10) {
                issues.push('Multiple elements with very small text detected');
              }
              
              // Check for clickable elements too close together
              const clickable = document.querySelectorAll('button, a, [onclick], .cursor-pointer');
              let closeElementsCount = 0;
              
              for (let i = 0; i < clickable.length - 1; i++) {
                const rect1 = clickable[i].getBoundingClientRect();
                const rect2 = clickable[i + 1].getBoundingClientRect();
                
                const distance = Math.sqrt(
                  Math.pow(rect2.left - rect1.left, 2) + Math.pow(rect2.top - rect1.top, 2)
                );
                
                if (distance < 44) { // Apple's recommended 44px touch target
                  closeElementsCount++;
                }
              }
              
              if (closeElementsCount > 3) {
                issues.push('Multiple touch targets too close together');
              }
              
              return issues;
            });
            
            const pageKey = `${viewport.name}-${testPage}`;
            this.testResults.mobile[pageKey] = {
              viewport: viewport.name,
              page: testPage,
              issues: mobileIssues
            };
            
            if (mobileIssues.length > 0) {
              console.log(`    ⚠️  Issues found: ${mobileIssues.join(', ')}`);
              this.testResults.issues.push(...mobileIssues.map(issue => 
                `${viewport.name} - ${testPage}: ${issue}`
              ));
            } else {
              console.log(`    ✅ No mobile issues detected`);
            }
            
          } catch (error) {
            console.log(`    ❌ Mobile test failed for ${testPage}: ${error.message}`);
          }
        }
        
      } catch (error) {
        console.log(`  ❌ Mobile viewport test failed: ${viewport.name}`);
      }
    }
    
    await page.close();
  }

  /**
   * Validate SEO compliance
   */
  async validateSEOCompliance() {
    console.log('🔍 Validating SEO compliance...');
    
    const page = await this.browser.newPage();
    const seoResults = {};
    
    const testPages = [
      { url: '/', name: 'homepage' },
      { url: '/portland/restaurants', name: 'city-industry' },
      { url: '/salem', name: 'city' }
    ];
    
    for (const testPage of testPages) {
      try {
        console.log(`  Testing SEO: ${testPage.name}`);
        
        await page.goto(`${this.baseUrl}${testPage.url}`, {
          waitUntil: 'networkidle2'
        });
        
        const seoData = await page.evaluate(() => {
          const getSeoData = () => {
            return {
              title: document.title || '',
              metaDescription: document.querySelector('meta[name="description"]')?.content || '',
              h1Count: document.querySelectorAll('h1').length,
              h1Text: document.querySelector('h1')?.textContent || '',
              hasCanonical: !!document.querySelector('link[rel="canonical"]'),
              hasViewport: !!document.querySelector('meta[name="viewport"]'),
              images: Array.from(document.querySelectorAll('img')).map(img => ({
                hasAlt: !!img.alt,
                src: img.src
              })),
              internalLinks: document.querySelectorAll('a[href^="/"]').length,
              externalLinks: document.querySelectorAll('a[href^="http"]:not([href*="localhost"])').length
            };
          };
          
          return getSeoData();
        });
        
        // SEO validation
        const seoIssues = [];
        
        if (!seoData.title || seoData.title.length < 10) {
          seoIssues.push('Missing or too short page title');
        }
        
        if (!seoData.metaDescription || seoData.metaDescription.length < 50) {
          seoIssues.push('Missing or too short meta description');
        }
        
        if (seoData.h1Count !== 1) {
          seoIssues.push(`Should have exactly 1 H1 tag (found ${seoData.h1Count})`);
        }
        
        if (!seoData.hasViewport) {
          seoIssues.push('Missing viewport meta tag');
        }
        
        const imagesWithoutAlt = seoData.images.filter(img => !img.hasAlt).length;
        if (imagesWithoutAlt > 0) {
          seoIssues.push(`${imagesWithoutAlt} images missing alt text`);
        }
        
        seoResults[testPage.name] = {
          ...seoData,
          issues: seoIssues
        };
        
        if (seoIssues.length > 0) {
          console.log(`    ⚠️  SEO issues: ${seoIssues.length}`);
          this.testResults.issues.push(...seoIssues.map(issue => `${testPage.name}: ${issue}`));
        } else {
          console.log(`    ✅ No SEO issues found`);
        }
        
      } catch (error) {
        console.log(`    ❌ SEO test failed for ${testPage.name}: ${error.message}`);
      }
    }
    
    this.testResults.seo = seoResults;
    await page.close();
  }

  /**
   * Generate comprehensive preview report
   */
  async generatePreviewReport() {
    console.log('📊 Generating preview report...');
    
    const timestamp = new Date().toISOString();
    const successfulRoutes = this.testResults.routes.filter(r => r.success).length;
    const totalRoutes = this.testResults.routes.length;
    const routeSuccessRate = totalRoutes > 0 ? (successfulRoutes / totalRoutes * 100).toFixed(1) : 0;
    
    // Calculate average performance scores
    const performanceScores = Object.values(this.testResults.performance);
    const avgPerformance = performanceScores.length > 0 
      ? (performanceScores.reduce((sum, score) => sum + score.performance, 0) / performanceScores.length).toFixed(1)
      : 'N/A';
    
    const avgSEO = performanceScores.length > 0 
      ? (performanceScores.reduce((sum, score) => sum + score.seo, 0) / performanceScores.length).toFixed(1)
      : 'N/A';
    
    // Generate report
    const report = {
      timestamp,
      summary: {
        routeSuccessRate: `${routeSuccessRate}%`,
        routesTestedSuccessfully: `${successfulRoutes}/${totalRoutes}`,
        averagePerformanceScore: `${avgPerformance}%`,
        averageSEOScore: `${avgSEO}%`,
        totalIssuesFound: this.testResults.issues.length,
        modalTestResults: this.testResults.summary.modalTests || { success: 0, total: 0 }
      },
      routes: this.testResults.routes,
      performance: this.testResults.performance,
      seo: this.testResults.seo,
      mobile: this.testResults.mobile,
      dataIntegrity: this.testResults.dataIntegrity,
      issues: this.testResults.issues,
      recommendations: this.generateRecommendations()
    };
    
    // Save report to file
    const reportPath = path.join(this.projectRoot, 'preview-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable summary
    const summaryPath = path.join(this.projectRoot, 'preview-summary.md');
    const summaryContent = this.generateSummaryMarkdown(report);
    await fs.writeFile(summaryPath, summaryContent);
    
    console.log('  ✅ Reports generated:');
    console.log(`    - Detailed JSON report: ${reportPath}`);
    console.log(`    - Summary report: ${summaryPath}`);
    
    // Print summary to console
    console.log('\n📋 PREVIEW SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`Routes Success Rate: ${routeSuccessRate}%`);
    console.log(`Performance Score: ${avgPerformance}%`);
    console.log(`SEO Score: ${avgSEO}%`);
    console.log(`Total Issues: ${this.testResults.issues.length}`);
    
    if (this.testResults.issues.length > 0) {
      console.log('\nTop Issues:');
      this.testResults.issues.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    console.log('═'.repeat(50));
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Route recommendations
    const failedRoutes = this.testResults.routes.filter(r => !r.success);
    if (failedRoutes.length > 0) {
      recommendations.push({
        category: 'Routes',
        priority: 'High',
        issue: `${failedRoutes.length} routes are failing`,
        recommendation: 'Fix failed routes before deployment. Check for missing pages or broken navigation.'
      });
    }
    
    // Performance recommendations
    const performanceScores = Object.values(this.testResults.performance);
    const lowPerformancePages = performanceScores.filter(score => score.performance < 70);
    if (lowPerformancePages.length > 0) {
      recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: `${lowPerformancePages.length} pages have poor performance scores`,
        recommendation: 'Optimize images, reduce bundle size, and implement code splitting.'
      });
    }
    
    // SEO recommendations
    const seoIssues = Object.values(this.testResults.seo).flatMap(page => page.issues || []);
    if (seoIssues.length > 0) {
      recommendations.push({
        category: 'SEO',
        priority: 'Medium',
        issue: `${seoIssues.length} SEO issues found`,
        recommendation: 'Add missing meta tags, fix heading structure, and add alt text to images.'
      });
    }
    
    // Data integrity recommendations
    if (this.testResults.dataIntegrity.length > 0) {
      recommendations.push({
        category: 'Data',
        priority: 'High',
        issue: `${this.testResults.dataIntegrity.length} data integrity issues`,
        recommendation: 'Verify business data completeness and accuracy. Ensure all required fields are populated.'
      });
    }
    
    // Mobile recommendations
    const mobileIssues = Object.values(this.testResults.mobile).flatMap(test => test.issues || []);
    if (mobileIssues.length > 0) {
      recommendations.push({
        category: 'Mobile',
        priority: 'Medium',
        issue: `${mobileIssues.length} mobile responsiveness issues`,
        recommendation: 'Fix mobile layout issues, ensure proper touch target sizes, and prevent horizontal scrolling.'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate human-readable summary markdown
   */
  generateSummaryMarkdown(report) {
    return `# Oregon SMB Directory - Preview Report

Generated: ${new Date(report.timestamp).toLocaleString()}

## Summary
- **Routes Success Rate**: ${report.summary.routeSuccessRate}
- **Routes Tested**: ${report.summary.routesTestedSuccessfully}
- **Average Performance Score**: ${report.summary.averagePerformanceScore}
- **Average SEO Score**: ${report.summary.averageSEOScore}
- **Total Issues Found**: ${report.summary.totalIssuesFound}
- **Modal Tests**: ${report.summary.modalTestResults.success}/${report.summary.modalTestResults.total} successful

## Performance Results
${Object.entries(report.performance).map(([name, data]) => `
### ${name}
- Performance: ${data.performance}%
- Accessibility: ${data.accessibility}%
- SEO: ${data.seo}%
- First Contentful Paint: ${data.firstContentfulPaint}
- Largest Contentful Paint: ${data.largestContentfulPaint}
`).join('')}

## Issues Found
${report.issues.length === 0 ? 'No issues found!' : report.issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}

## Recommendations
${report.recommendations.map(rec => `
### ${rec.category} (${rec.priority} Priority)
- **Issue**: ${rec.issue}
- **Recommendation**: ${rec.recommendation}
`).join('')}

## Data Integrity
${report.dataIntegrity.length === 0 ? 'All data integrity checks passed!' : report.dataIntegrity.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}

---
*Report generated by Oregon SMB Directory Preview Agent*
`;
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    console.log('🧹 Cleaning up resources...');
    
    if (this.browser) {
      await this.browser.close();
      console.log('  ✅ Browser closed');
    }
    
    if (this.server) {
      this.server.kill('SIGTERM');
      console.log('  ✅ Development server stopped');
    }
  }
}

// Execute the preview agent if run directly
if (require.main === module) {
  const agent = new PreviewAgent();
  
  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Preview Agent interrupted by user');
    await agent.cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Preview Agent terminated');
    await agent.cleanup();
    process.exit(0);
  });
  
  // Run the agent
  agent.run().catch(async (error) => {
    console.error('❌ Preview Agent failed:', error);
    await agent.cleanup();
    process.exit(1);
  });
}

module.exports = PreviewAgent;