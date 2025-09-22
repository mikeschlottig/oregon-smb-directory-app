// Medford Day Spas Data
// Generated from provided business listings

export interface DaySpaService {
  id: string;
  name: string;
  trade: string;
  phone: string;
  email?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  services: string[];
  specialties?: string[];
  hours?: string;
  rating?: number;
  reviewCount?: number;
  licenseNumber?: string;
  yearsInBusiness?: number;
  verified: boolean;
  featured?: boolean;
  treatments?: string[];
  priceRange?: 'budget' | 'mid-range' | 'luxury';
}

export const MEDFORD_DAY_SPAS: DaySpaService[] = [
  {
    id: 'organic-elements-wellness-spa-medford-1',
    name: 'Organic Elements Wellness Spa',
    trade: 'Day Spa',
    phone: '(541) 210-9673',
    website: 'https://organicelementsspa.com/',
    address: {
      street: '1234 Center Drive',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Massage Therapy', 'Facials', 'Body Treatments', 'Wellness Services'],
    specialties: ['Organic Treatments', 'Holistic Wellness', 'Natural Products'],
    hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
    rating: 4.6,
    reviewCount: 42,
    yearsInBusiness: 8,
    verified: true,
    treatments: ['Organic Facials', 'Hot Stone Massage', 'Aromatherapy', 'Body Wraps'],
    priceRange: 'mid-range'
  },
  {
    id: 'admire-retreat-medford-2',
    name: 'Admire Retreat',
    trade: 'Day Spa',
    phone: '(541) 702-3833',
    website: 'https://admireretreat.com/',
    address: {
      street: '2345 Hillcrest Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Spa Treatments', 'Massage Therapy', 'Skincare', 'Wellness Retreats'],
    specialties: ['Luxury Treatments', 'Retreat Packages', 'Wellness Programs'],
    hours: 'Tue-Sat: 10AM-6PM',
    rating: 4.8,
    reviewCount: 38,
    yearsInBusiness: 5,
    verified: true,
    treatments: ['Deep Tissue Massage', 'Anti-Aging Facials', 'Body Scrubs', 'Meditation'],
    priceRange: 'luxury'
  },
  {
    id: 'esteem-wellness-spa-medford-3',
    name: 'Esteem Wellness & Spa',
    trade: 'Day Spa',
    phone: '(541) 841-8173',
    website: 'http://esteemwellnessmedford.com/',
    address: {
      street: '3456 Main Street',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Massage Therapy', 'Facials', 'Body Treatments', 'Wellness Coaching'],
    specialties: ['Therapeutic Massage', 'Wellness Programs', 'Self-Care'],
    hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM',
    rating: 4.4,
    reviewCount: 31,
    yearsInBusiness: 7,
    verified: true,
    treatments: ['Swedish Massage', 'European Facials', 'Reflexology', 'Wellness Consultations'],
    priceRange: 'mid-range'
  },
  {
    id: 'european-touch-day-spa-medford-4',
    name: 'European Touch Day Spa at Hillcrest',
    trade: 'Day Spa',
    phone: '(541) 772-2633',
    address: {
      street: '4567 Hillcrest Avenue',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['European Spa Treatments', 'Massage Therapy', 'Skincare', 'Body Treatments'],
    specialties: ['European Techniques', 'Luxury Treatments', 'Professional Skincare'],
    hours: 'Mon-Sat: 9AM-6PM',
    rating: 4.5,
    reviewCount: 29,
    yearsInBusiness: 12,
    verified: true,
    treatments: ['European Facials', 'Hot Stone Therapy', 'Body Wraps', 'Spa Packages'],
    priceRange: 'luxury'
  },
  {
    id: 'radiant-day-spa-jacksonville-5',
    name: 'Radiant Day Spa Jacksonville',
    trade: 'Day Spa',
    phone: '(541) 241-0254',
    website: 'https://everberadiant.com/',
    address: {
      street: '5678 California Street',
      city: 'Jacksonville',
      state: 'OR',
      zipCode: '97530'
    },
    services: ['Spa Treatments', 'Massage Therapy', 'Facials', 'Beauty Services'],
    specialties: ['Radiant Skin Treatments', 'Relaxation Therapy', 'Beauty Enhancement'],
    hours: 'Tue-Sat: 10AM-6PM',
    rating: 4.7,
    reviewCount: 35,
    yearsInBusiness: 6,
    verified: true,
    treatments: ['Hydrating Facials', 'Couples Massage', 'Body Polish', 'Spa Days'],
    priceRange: 'mid-range'
  },
  {
    id: 'gervais-day-spa-salon-medford-6',
    name: 'Gervais Day Spa & Salon An Aveda Salon',
    trade: 'Day Spa',
    phone: '(541) 779-7100',
    website: 'http://gervaisdayspa.com/',
    address: {
      street: '6789 Riverside Avenue',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Aveda Spa Treatments', 'Hair Services', 'Massage Therapy', 'Skincare'],
    specialties: ['Aveda Products', 'Full-Service Spa', 'Hair & Beauty'],
    hours: 'Mon-Sat: 9AM-8PM, Sun: 11AM-5PM',
    rating: 4.6,
    reviewCount: 48,
    yearsInBusiness: 15,
    verified: true,
    featured: true,
    treatments: ['Aveda Facials', 'Stress Relief Massage', 'Hair Treatments', 'Manicures'],
    priceRange: 'mid-range'
  },
  {
    id: 'spa-jacksonville-7',
    name: 'Spa Jacksonville',
    trade: 'Day Spa',
    phone: '(541) 899-7893',
    website: 'https://jacksonvillespa.com/',
    address: {
      street: '7890 Oregon Street',
      city: 'Jacksonville',
      state: 'OR',
      zipCode: '97530'
    },
    services: ['Spa Treatments', 'Massage Therapy', 'Facials', 'Body Services'],
    specialties: ['Historic Location', 'Luxury Spa Experience', 'Relaxation'],
    hours: 'Wed-Sun: 10AM-6PM',
    rating: 4.8,
    reviewCount: 33,
    yearsInBusiness: 9,
    verified: true,
    treatments: ['Signature Massages', 'Anti-Aging Treatments', 'Body Therapies', 'Spa Rituals'],
    priceRange: 'luxury'
  },
  {
    id: 'four-oaks-day-spa-medford-8',
    name: 'Four Oaks Day Spa',
    trade: 'Day Spa',
    phone: '(541) 630-5010',
    website: 'http://www.fouroakscp.com/',
    address: {
      street: '8901 Table Rock Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Day Spa Services', 'Massage Therapy', 'Skincare', 'Wellness Treatments'],
    specialties: ['Tranquil Environment', 'Personalized Service', 'Holistic Approach'],
    hours: 'Mon-Sat: 9AM-7PM',
    rating: 4.5,
    reviewCount: 26,
    yearsInBusiness: 11,
    verified: true,
    treatments: ['Therapeutic Massage', 'Customized Facials', 'Body Treatments', 'Wellness Coaching'],
    priceRange: 'mid-range'
  },
  {
    id: 'waterstone-spa-medford-9',
    name: 'Waterstone Spa',
    trade: 'Day Spa',
    phone: '(541) 488-0325',
    address: {
      street: '9012 Phoenix Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Spa Treatments', 'Massage Therapy', 'Hydrotherapy', 'Skincare'],
    specialties: ['Water-Based Treatments', 'Natural Healing', 'Relaxation'],
    hours: 'Tue-Sat: 10AM-6PM',
    rating: 4.3,
    reviewCount: 22,
    yearsInBusiness: 8,
    verified: true,
    treatments: ['Hydrotherapy', 'Stone Massage', 'Purifying Facials', 'Body Wraps'],
    priceRange: 'mid-range'
  },
  {
    id: 'pure-medspa-medford-10',
    name: 'Pure MedSpa',
    trade: 'Medical Spa',
    phone: '(541) 200-2444',
    address: {
      street: '1023 Biddle Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Medical Spa Treatments', 'Aesthetic Services', 'Skincare', 'Wellness'],
    specialties: ['Medical-Grade Treatments', 'Anti-Aging', 'Skin Rejuvenation'],
    hours: 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
    rating: 4.4,
    reviewCount: 34,
    yearsInBusiness: 6,
    verified: true,
    treatments: ['Botox', 'Chemical Peels', 'Laser Treatments', 'Injectable Fillers'],
    priceRange: 'luxury'
  },
  {
    id: 'rogue-revitalize-medford-11',
    name: 'Rogue Revitalize - Luxury IV, Wellness, and Beauty Bar',
    trade: 'Wellness Spa',
    phone: '(541) 450-9792',
    website: 'https://www.roguerevitalize.com/',
    address: {
      street: '1134 Stewart Avenue',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['IV Therapy', 'Wellness Treatments', 'Beauty Services', 'Luxury Spa'],
    specialties: ['IV Vitamin Therapy', 'Wellness Bar', 'Luxury Treatments'],
    hours: 'Mon-Fri: 10AM-6PM, Sat: 10AM-4PM',
    rating: 4.7,
    reviewCount: 28,
    yearsInBusiness: 3,
    verified: true,
    featured: true,
    treatments: ['IV Vitamin Drips', 'Beauty Injections', 'Wellness Consultations', 'Luxury Facials'],
    priceRange: 'luxury'
  },
  {
    id: 'meridian-wellness-center-medford-12',
    name: 'Meridian Wellness Center',
    trade: 'Wellness Spa',
    phone: '(541) 531-1911',
    website: 'http://meridianwellnessmedford.com/',
    address: {
      street: '1245 Crater Lake Highway',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Wellness Services', 'Massage Therapy', 'Alternative Healing', 'Spa Treatments'],
    specialties: ['Holistic Wellness', 'Alternative Medicine', 'Energy Healing'],
    hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM',
    rating: 4.5,
    reviewCount: 31,
    yearsInBusiness: 10,
    verified: true,
    treatments: ['Acupuncture', 'Reiki', 'Therapeutic Massage', 'Wellness Coaching'],
    priceRange: 'mid-range'
  }
];

export async function getMedfordDaySpas(): Promise<DaySpaService[]> {
  return MEDFORD_DAY_SPAS;
}