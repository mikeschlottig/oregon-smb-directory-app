export interface Industry {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tier: number;
  leadValue: 'high' | 'medium' | 'low';
  primaryDriver: 'leads' | 'reviews' | 'credentials' | 'portfolio';
  color: string;
  features: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'lawfirms',
    name: 'Lawfirms',
    slug: 'lawfirms',
    icon: '⚖️',
    tier: 1,
    leadValue: 'high',
    primaryDriver: 'credentials',
    color: 'blue',
    features: ['credential-verification', 'consultation-booking', 'case-types']
  },
  {
    id: 'roofers',
    name: 'Roofers',
    slug: 'roofers',
    icon: '🏠',
    tier: 1,
    leadValue: 'high',
    primaryDriver: 'leads',
    color: 'orange',
    features: ['emergency-service', 'license-verification', 'lead-generation']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    slug: 'real-estate',
    icon: '🏡',
    tier: 1,
    leadValue: 'high',
    primaryDriver: 'portfolio',
    color: 'green',
    features: ['property-listings', 'agent-profiles', 'market-stats']
  },
  {
    id: 'general-contractors',
    name: 'General Contractors',
    slug: 'general-contractors',
    icon: '🏗️',
    tier: 1,
    leadValue: 'high',
    primaryDriver: 'leads',
    color: 'orange',
    features: ['project-gallery', 'license-verification', 'insurance-info']
  },
  {
    id: 'plumbers',
    name: 'Plumbers',
    slug: 'plumbers',
    icon: '🔧',
    tier: 1,
    leadValue: 'high',
    primaryDriver: 'leads',
    color: 'blue',
    features: ['emergency-service', 'license-verification', 'lead-generation']
  },
  {
    id: 'electricians',
    name: 'Electricians',
    slug: 'electricians',
    icon: '⚡',
    tier: 1,
    leadValue: 'high',
    primaryDriver: 'leads',
    color: 'yellow',
    features: ['emergency-service', 'license-verification', 'lead-generation']
  }
];

export async function getIndustryData(slug: string): Promise<Industry | null> {
  return INDUSTRIES.find(industry => industry.slug === slug) || null;
}

export async function getAllIndustries(): Promise<Industry[]> {
  return INDUSTRIES;
}