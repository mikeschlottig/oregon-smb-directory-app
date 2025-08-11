export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  category: string;
  tags: string[];
  image?: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  createdAt: Date;
  approved: boolean;
  parentId?: string; // for replies
}

// Sample blog posts
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Finding the Right Contractor for Your Oregon Home Project',
    slug: 'finding-right-contractor-oregon-home-project',
    excerpt: 'Essential tips for homeowners in Oregon when selecting contractors for roofing, electrical, and plumbing projects. Learn what questions to ask and red flags to avoid.',
    content: `
# Finding the Right Contractor for Your Oregon Home Project

When it comes to home improvement projects in Oregon, finding the right contractor can make the difference between a successful renovation and a costly nightmare. Whether you're looking for roofers, electricians, or plumbers, here's your comprehensive guide to making the right choice.

## Research and Verification

### Check Licensing and Insurance
In Oregon, most contractors must be licensed through the Construction Contractors Board (CCB). Always verify:
- Current CCB license number
- Liability insurance coverage
- Workers' compensation insurance
- Better Business Bureau rating

### Local Expertise Matters
Oregon's climate and building codes have unique requirements:
- Rain and moisture considerations
- Seismic building standards
- Energy efficiency regulations
- Local permit processes

## Getting Quality Quotes

### Multiple Estimates
Get at least three detailed quotes that include:
- Materials specifications
- Labor breakdown
- Project timeline
- Cleanup responsibilities
- Warranty information

### Red Flags to Avoid
Watch out for contractors who:
- Go door-to-door soliciting work
- Demand full payment upfront
- Pressure you to sign immediately
- Can't provide local references
- Quote significantly below market rate

## Questions to Ask

1. How many similar projects have you completed in Oregon?
2. Can you provide references from recent local customers?
3. What permits will be required and who obtains them?
4. How do you handle weather delays?
5. What is your warranty policy?

## Making the Final Decision

Don't choose based on price alone. Consider:
- Professional communication
- Detailed written proposals
- Timeline reliability
- Local reputation
- Quality of references

Remember, the cheapest bid often becomes the most expensive in the long run. Invest in quality work that will protect your Oregon home for years to come.
    `,
    author: 'Oregon SMB Directory Team',
    publishedAt: new Date('2025-01-15'),
    category: 'Home Improvement',
    tags: ['contractors', 'home-improvement', 'oregon', 'tips'],
    image: '/images/blog/contractor-tips.jpg',
    readTime: 5,
    featured: true,
    published: true,
    commentCount: 12
  },
  {
    id: '2',
    title: 'Emergency Electrical Services: When to Call a Professional',
    slug: 'emergency-electrical-services-when-call-professional',
    excerpt: 'Learn to identify electrical emergencies that require immediate professional attention and how to stay safe until help arrives.',
    content: `
# Emergency Electrical Services: When to Call a Professional

Electrical emergencies can happen at any time and pose serious risks to your safety and property. Knowing when to call a professional electrician immediately can prevent fires, injuries, and costly damage.

## Signs You Need Emergency Electrical Service

### Immediate Dangers
Call an electrician right away if you experience:
- Sparks from outlets or electrical panels
- Burning smells from electrical sources
- Frequent circuit breaker trips
- Flickering lights throughout the house
- Electric shocks from switches or outlets

### Power Outage Situations
Contact emergency electrical services when:
- Your neighbors have power but you don't
- Only part of your home has power
- Power goes out after using a specific appliance
- You see power lines down on your property

## Safety First

### Before the Electrician Arrives
1. Turn off power at the main breaker if safe to do so
2. Unplug appliances and electronics
3. Stay away from water sources
4. Keep family and pets away from the problem area
5. Use flashlights, not candles

### What NOT to Do
- Don't touch exposed wires
- Don't use water near electrical issues
- Don't attempt DIY electrical repairs
- Don't ignore burning smells

## Finding 24/7 Electrical Services in Oregon

Many Oregon electrical contractors offer emergency services. Look for:
- 24/7 availability
- Licensed and insured professionals
- Quick response times
- Transparent pricing
- Local reputation

## Prevention Tips

Regular electrical maintenance can prevent many emergencies:
- Annual electrical inspections
- GFCI outlet testing
- Circuit breaker maintenance
- Outlet and switch replacement when worn

Remember, when it comes to electrical emergencies, it's always better to be safe than sorry. Don't hesitate to call a professional when you're unsure about electrical safety.
    `,
    author: 'Sarah Martinez',
    publishedAt: new Date('2025-01-10'),
    category: 'Electrical Safety',
    tags: ['electrical', 'emergency', 'safety', 'home-maintenance'],
    image: '/images/blog/electrical-emergency.jpg',
    readTime: 4,
    featured: false,
    published: true,
    commentCount: 8
  },
  {
    id: '3',
    title: 'Oregon Plumbing Winterization: Protecting Your Pipes',
    slug: 'oregon-plumbing-winterization-protecting-pipes',
    excerpt: 'Essential winterization tips for Oregon homeowners to prevent frozen pipes and costly water damage during cold snaps.',
    content: `
# Oregon Plumbing Winterization: Protecting Your Pipes

Oregon winters can be unpredictable, with sudden cold snaps that catch homeowners off guard. Proper plumbing winterization is essential to prevent frozen pipes and costly water damage.

## Understanding Oregon's Winter Risks

### Climate Variations
Oregon's diverse climate zones mean different winterization needs:
- Coast Range: Mild but wet winters
- Willamette Valley: Occasional freezing temperatures
- Eastern Oregon: Harsh winters with sustained cold
- Mountain regions: Heavy snow and extended freezes

### Vulnerable Areas
Pay special attention to:
- Crawl spaces and basements
- Exterior walls with plumbing
- Unheated garages
- Vacation homes and rental properties

## Winterization Checklist

### Before the Cold Hits
1. **Insulate Exposed Pipes**: Use foam pipe insulation on pipes in unheated areas
2. **Seal Gaps**: Close foundation vents and seal cracks where cold air enters
3. **Service Water Heater**: Annual maintenance prevents winter failures
4. **Clean Gutters**: Proper drainage prevents ice dam formation
5. **Test Shut-off Valves**: Know where your main water shut-off is located

### Outdoor Preparations
- Disconnect garden hoses
- Shut off and drain outdoor water spigots
- Install insulated spigot covers
- Drain sprinkler systems completely

## Emergency Preparedness

### If Pipes Freeze
1. Keep faucets slightly open to relieve pressure
2. Apply heat to frozen sections with a hair dryer
3. Never use open flame or electric heaters
4. Call a plumber if pipes burst

### Winter Plumbing Kit
Keep these items handy:
- Pipe insulation materials
- Electrical heating tape
- Hair dryer for thawing
- Plumber's contact information

## Professional Services

Consider professional winterization if you have:
- Complex plumbing systems
- Multiple rental properties
- Limited DIY experience
- Previous freeze damage

Many Oregon plumbers offer winterization services including:
- Comprehensive system inspection
- Professional pipe insulation
- Water heater maintenance
- Emergency repair services

## Spring Preparation

Don't forget to reverse winterization steps:
- Remove pipe insulation if temporary
- Reconnect outdoor water sources
- Test all plumbing fixtures
- Schedule spring maintenance check

Taking these preventive measures can save you thousands in repairs and keep your Oregon home comfortable all winter long.
    `,
    author: 'Mike Thompson',
    publishedAt: new Date('2025-01-05'),
    category: 'Seasonal Maintenance',
    tags: ['plumbing', 'winterization', 'maintenance', 'oregon-weather'],
    readTime: 6,
    featured: false,
    published: true,
    commentCount: 15
  }
];

// Sample comments
export const SAMPLE_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    name: 'Jennifer Smith',
    email: 'jennifer.smith@email.com',
    content: 'This is really helpful! I had a bad experience with a contractor last year. I wish I had read this first. The CCB license check is so important.',
    createdAt: new Date('2025-01-16'),
    approved: true
  },
  {
    id: 'c2',
    postId: '1',
    name: 'Dave Wilson',
    email: 'dave.wilson@email.com',
    content: 'Great advice about getting multiple quotes. I always get at least 3 estimates and it has saved me money every time.',
    createdAt: new Date('2025-01-17'),
    approved: true
  },
  {
    id: 'c3',
    postId: '2',
    name: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    content: 'Had a sparking outlet last month and called an emergency electrician right away. This article explains exactly why that was the right decision!',
    createdAt: new Date('2025-01-12'),
    approved: true
  }
];

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // In a real app, this would query a database
  return SAMPLE_BLOG_POSTS.filter(post => post.published)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // In a real app, this would query a database
  return SAMPLE_BLOG_POSTS.find(post => post.slug === slug && post.published) || null;
}

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
  // In a real app, this would query a database
  return SAMPLE_COMMENTS
    .filter(comment => comment.postId === postId && comment.approved)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'approved'>): Promise<Comment> {
  // In a real app, this would save to a database and require admin approval
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date(),
    approved: false // Requires admin approval
  };
  
  SAMPLE_COMMENTS.push(newComment);
  return newComment;
}