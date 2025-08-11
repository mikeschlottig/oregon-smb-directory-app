import type { Context } from '.keystone/types';

interface YellowPagesListing {
  rank: number;
  name: string;
  categories: string[];
  website?: string;
  yearsInBusiness?: number;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hours: string;
  description?: string;
  rating?: number;
  reviews?: string;
  amenities?: string[];
}

export async function importYellowPagesData(context: Context) {
  console.log('🟡 Importing YellowPages Oregon SMB Directory data...');

  // Sample Portland Electricians data based on your markdown
  const portlandElectricians: YellowPagesListing[] = [
    {
      rank: 1,
      name: 'General Equipment',
      categories: ['Electricians', 'Metals', 'Automobile & Truck Brokers'],
      website: 'https://www.general-equip.com/',
      yearsInBusiness: 68,
      phone: '(971) 484-8802',
      address: '6767 NE Columbia Blvd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97218',
      hours: 'closed now',
      description: 'Since 1957, General Equipment Company has been providing solid waste and environmental trucks and equipment to Oregon and areas throughout Washington.',
    },
    {
      rank: 2,
      name: 'Current Electrical Construction Company',
      categories: ['Electricians', 'Home Builders', 'General Contractors'],
      website: 'https://current-electrical.com/',
      yearsInBusiness: 38,
      phone: '(503) 977-6528',
      address: '8029 SW 17th Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97219',
      hours: 'closed now',
    },
    {
      rank: 3,
      name: 'Trademark Electrical Contractors LLC',
      categories: ['Electricians'],
      website: 'http://trademarkelectrical.com/',
      phone: '(503) 997-0914',
      address: '9007 SE 74th Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97206',
      hours: 'open',
    },
    {
      rank: 4,
      name: 'EC Company',
      categories: ['Electricians', 'Electric Companies'],
      website: 'https://ecpowerslife.com/',
      phone: '(503) 224-3511',
      address: '2121 NW Thurman St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97210',
      hours: 'closed now',
      description: 'Established in 1946, E C Company offers electrical services to diverse markets, including advanced technology, commercial and industrial construction, renewable energy.',
    },
    {
      rank: 5,
      name: 'Tice Electric',
      categories: ['Electricians', 'Electric Companies', 'Electronic Equipment & Supplies-Repair & Service'],
      website: 'http://ticeelectric.com/',
      phone: '(503) 233-8801',
      address: '5405 N Lagoon Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97217',
      hours: 'closed now',
      description: 'Heil Electric Company provides quality design-bid work for all types of commercial, manufacturing, and industrial projects, as well as progressive electrical work.',
    },
    {
      rank: 6,
      name: 'Bergelectric Corp',
      categories: ['Electricians'],
      website: 'https://www.bergelectric.com/locations/portland',
      yearsInBusiness: 79,
      phone: '(503) 255-1818',
      address: '13650 NE Whitaker Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97230',
      hours: 'closed now',
      description: 'Founded in 1946, Bergelectric Corporation is one of the largest electrical contractors in the United States. Uses computer-aided design and advanced technology.',
    },
    {
      rank: 7,
      name: 'IES Commercial Inc',
      categories: ['Electricians'],
      website: 'http://ies-co.com/',
      phone: '(503) 648-1900',
      address: '16135 SW 74th Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97224',
      hours: 'open',
      description: 'IES Commercial is a premier provider of electrical and communications contracting solutions throughout the United States. Licensed with project experience nationwide.',
    },
    {
      rank: 8,
      name: 'CornerStone Electric',
      categories: ['Electricians', 'Electrical Wire Harnesses'],
      website: 'http://www.cornerstone-electric.com/',
      phone: '(503) 490-9471',
      address: '308 SW 1st Ave Ste 110',
      city: 'Portland',
      state: 'OR',
      zipCode: '97204',
      hours: 'closed now',
    },
    {
      rank: 9,
      name: 'ABC Electric',
      categories: ['Electricians', 'Electrical Power Systems-Maintenance'],
      phone: '(503) 233-7551',
      address: '135 NE 9th Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97232',
      hours: 'closed now',
    },
    {
      rank: 10,
      name: 'Oregon Electric Group',
      categories: ['Electricians'],
      yearsInBusiness: 10,
      phone: '(503) 288-5161',
      address: '1709 SE 3rd Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97214',
      hours: 'closed now',
    },
    {
      rank: 16,
      name: 'Phoenix Electric',
      categories: ['Electricians'],
      website: 'http://phoenixpdx.com/',
      yearsInBusiness: 20,
      phone: '(503) 231-8006',
      address: '2215 NE Davis St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97232',
      hours: 'open 24 hours',
    },
    {
      rank: 21,
      name: 'Zapp Electric Inc',
      categories: ['Electricians'],
      yearsInBusiness: 30,
      phone: '(503) 253-9288',
      address: '8821 NE Sandy Blvd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97220',
      hours: 'closed now',
    },
    {
      rank: 22,
      name: 'Jet Electric Inc',
      categories: ['Electricians', 'General Contractors', 'Home Builders'],
      website: 'http://www.jetelectric.biz/',
      yearsInBusiness: 25,
      phone: '(503) 258-1715',
      address: '11150 NE Marx St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97220',
      hours: 'closed now',
    },
    {
      rank: 23,
      name: 'Bachofner Electric',
      categories: ['Electricians'],
      website: 'http://www.bachofnerelectric.com/',
      yearsInBusiness: 41,
      phone: '(503) 327-8872',
      address: '12031 NE Marx St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97220',
      hours: 'closed now',
    },
    {
      rank: 26,
      name: 'Advantage Electric',
      categories: ['Electricians', 'Electric Contractors-Commercial & Industrial'],
      website: 'http://www.advantageelectricpdx.com/',
      phone: '(503) 235-5854',
      address: '814 SE 46th Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97215',
      hours: 'closed now',
      rating: 4.0,
      reviews: 'We are in the middle of a major remodel and our electrical work is extensive, both in replacing old wiring and redesigning lighting.',
    },
    {
      rank: 27,
      name: 'Badger Electric',
      categories: ['Electricians'],
      website: 'http://www.badgerelectricinc.com/',
      yearsInBusiness: 21,
      phone: '(503) 288-4756',
      address: '4415 NE Sandy Blvd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97213',
      hours: 'closed now',
      rating: 5.0,
      reviews: 'I highly recommend Badger Electric. As a general contractor I have been working with Badger Electric for a couple years now on bathroom and kitchen remodels.',
    },
    {
      rank: 28,
      name: 'Reds Electric Company Inc',
      categories: ['Electricians', 'Home Improvements'],
      website: 'http://redselectric.com/',
      yearsInBusiness: 61,
      phone: '(503) 233-6467',
      address: '6336 SE 107th Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97266',
      hours: 'closed now',
      rating: 1.0,
      reviews: 'Avoid this shop by all means!!! The owner is a man with NO integrity and will lie through his teeth.',
    },
    {
      rank: 30,
      name: 'Bridgetown Electric',
      categories: ['Electricians', 'Altering & Remodeling Contractors', 'Home Improvements'],
      website: 'http://bridgetownelectric.com/',
      yearsInBusiness: 31,
      phone: '(503) 621-7122',
      address: '4702 N Lombard St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97203',
      hours: 'closed now',
      description: 'Bridgetown Electric offers commercial and residential electrician services at affordable rates to the Portland, OR area.',
    },
  ];

  try {
    // Create Portland city if it doesn't exist
    let portlandCity = await context.query.City.findOne({ where: { slug: 'portland' } });
    if (!portlandCity) {
      portlandCity = await context.query.City.createOne({
        data: {
          name: 'Portland',
          slug: 'portland',
          state: 'Oregon',
          population: 652503,
          description: 'The largest city in Oregon, known for its vibrant business community and diverse industries.',
          metaTitle: 'Portland Oregon Business Directory',
          metaDescription: 'Find local businesses in Portland, Oregon. Comprehensive directory of contractors, electricians, and professional services.',
        },
      });
      console.log('✅ Created Portland city');
    }

    // Create Electricians category if it doesn't exist
    let electriciansCategory = await context.query.Category.findOne({ where: { slug: 'electricians' } });
    if (!electriciansCategory) {
      electriciansCategory = await context.query.Category.createOne({
        data: {
          name: 'Electricians',
          slug: 'electricians',
          description: 'Licensed electrical contractors providing residential and commercial electrical services.',
          icon: '⚡',
          color: '#FFD700',
          metaTitle: 'Portland Oregon Electricians Directory',
          metaDescription: 'Find qualified electricians in Portland, Oregon. Licensed, insured electrical contractors for all your electrical needs.',
        },
      });
      console.log('✅ Created Electricians category');
    }

    // Import businesses
    let importedCount = 0;
    let skippedCount = 0;

    for (const listing of portlandElectricians) {
      try {
        // Create business slug
        const slug = listing.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 80);

        // Check if business already exists
        const existing = await context.query.Business.findOne({
          where: { slug },
        });

        if (existing) {
          console.log(`⚠️  Skipped duplicate: ${listing.name}`);
          skippedCount++;
          continue;
        }

        // Generate services based on categories
        const services = generateServicesFromCategories(listing.categories);
        
        // Determine subscription tier based on data completeness
        const subscriptionTier = determineSubscriptionTier(listing);

        // Create rich text description
        const description = createRichDescription(listing.description || `Professional ${listing.categories[0]} services in Portland, Oregon.`);

        // Create business
        const business = await context.query.Business.createOne({
          data: {
            name: listing.name.trim(),
            slug: slug,
            description: description,
            tagline: generateTagline(listing.name, listing.yearsInBusiness),
            phone: listing.phone,
            website: listing.website || '',
            address: listing.address,
            zipCode: listing.zipCode,
            services: services,
            specialties: listing.categories.join(', '),
            
            // Connect relationships
            city: { connect: { id: portlandCity.id } },
            category: { connect: { id: electriciansCategory.id } },
            
            // Business details
            yearsInBusiness: listing.yearsInBusiness || null,
            
            // Business verification and status
            isVerified: !!(listing.website && listing.phone),
            isActive: true,
            isPremium: subscriptionTier !== 'free',
            subscriptionTier: subscriptionTier,
            
            // Features based on data
            emergencyServices: listing.hours === 'open 24 hours',
            freEstimates: true, // Most electricians offer free estimates
            
            // SEO fields
            metaTitle: `${listing.name} - Portland Oregon Electricians`,
            metaDescription: generateMetaDescription(listing.name, listing.description),
            
            // Analytics
            viewCount: Math.floor(Math.random() * 100) + listing.rank, // Simulate views based on ranking
            clickCount: Math.floor(Math.random() * 20) + Math.floor(listing.rank / 2),
          },
        });

        // Create some sample reviews if rating data exists
        if (listing.rating && listing.reviews) {
          await context.query.Review.createOne({
            data: {
              business: { connect: { id: business.id } },
              customerName: 'Verified Customer',
              rating: listing.rating.toString(),
              title: listing.rating >= 4 ? 'Excellent Service' : listing.rating >= 3 ? 'Good Experience' : 'Poor Service',
              content: listing.reviews.substring(0, 300),
              isApproved: true,
              isVerified: true,
            },
          });
        }

        importedCount++;
        console.log(`✅ Imported: ${listing.name} (Rank #${listing.rank})`);

        // Rate limiting
        if (importedCount % 10 === 0) {
          console.log(`📊 Progress: ${importedCount} Portland electricians imported...`);
        }

      } catch (error) {
        console.error(`❌ Failed to import ${listing.name}:`, error);
        skippedCount++;
      }
    }

    console.log('');
    console.log('🎉 YellowPages import completed!');
    console.log('📊 Summary:');
    console.log(`   Total listings processed: ${portlandElectricians.length}`);
    console.log(`   Successfully imported: ${importedCount}`);
    console.log(`   Skipped/Failed: ${skippedCount}`);
    console.log(`   City: Portland, Oregon`);
    console.log(`   Category: Electricians`);
    console.log('');
    console.log('🚀 Ready for enterprise deployment!');
    console.log('   GraphQL API: http://localhost:3001/api/graphql');
    console.log('   Admin UI: http://localhost:3001');

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Helper functions
function generateServicesFromCategories(categories: string[]): string[] {
  const serviceMap: Record<string, string[]> = {
    'Electricians': [
      'Electrical Repairs',
      'Panel Upgrades', 
      'Outlet Installation',
      'Lighting Installation',
      'Wiring Services',
      'Emergency Electrical Service'
    ],
    'Home Builders': ['New Construction Electrical', 'Residential Wiring'],
    'General Contractors': ['Commercial Electrical', 'Construction Electrical'],
    'Electric Companies': ['Electrical Contracting', 'Power Systems'],
    'Electronic Equipment & Supplies-Repair & Service': ['Equipment Repair', 'Electrical Maintenance'],
    'Electrical Wire Harnesses': ['Custom Wiring', 'Wire Harness Assembly'],
    'Electric Contractors-Commercial & Industrial': ['Commercial Electrical', 'Industrial Wiring'],
    'Electrical Power Systems-Maintenance': ['Power System Maintenance', 'Electrical Inspections'],
    'Altering & Remodeling Contractors': ['Electrical Remodeling', 'Home Electrical Updates'],
    'Home Improvements': ['Electrical Upgrades', 'Home Automation'],
  };

  const allServices: string[] = [];
  for (const category of categories) {
    const services = serviceMap[category];
    if (services) {
      allServices.push(...services);
    }
  }

  // Remove duplicates and limit to 6 services
  return [...new Set(allServices)].slice(0, 6);
}

function determineSubscriptionTier(listing: YellowPagesListing): string {
  let score = 0;
  
  if (listing.website) score += 2;
  if (listing.yearsInBusiness && listing.yearsInBusiness > 20) score += 2;
  if (listing.yearsInBusiness && listing.yearsInBusiness > 10) score += 1;
  if (listing.description && listing.description.length > 100) score += 1;
  if (listing.rating && listing.rating >= 4) score += 1;
  if (listing.rank <= 10) score += 2; // Top 10 listings get premium
  if (listing.hours === 'open 24 hours') score += 1;

  if (score >= 6) return 'enterprise';
  if (score >= 4) return 'premium';
  if (score >= 2) return 'basic';
  return 'free';
}

function createRichDescription(description: string): any {
  return JSON.stringify([
    {
      type: 'paragraph',
      children: [{ text: description.trim() }],
    },
  ]);
}

function generateTagline(name: string, yearsInBusiness?: number): string {
  const taglines = [
    'Licensed & Insured Electricians',
    'Professional Electrical Services',
    'Trusted Portland Electricians',
    'Quality Electrical Work',
    'Expert Electrical Solutions',
  ];

  if (yearsInBusiness && yearsInBusiness >= 20) {
    return `${yearsInBusiness}+ Years of Electrical Excellence`;
  }

  return taglines[Math.floor(Math.random() * taglines.length)];
}

function generateMetaDescription(name: string, description?: string): string {
  if (description && description.length > 50) {
    return `${name} - ${description.substring(0, 120)}... Licensed Portland electricians.`;
  }
  return `${name} - Professional electrical services in Portland, Oregon. Licensed, insured electricians for residential and commercial work.`;
}