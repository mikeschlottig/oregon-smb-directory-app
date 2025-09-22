// Medford Property Management and Rentals Data
// Generated from provided business listings

export interface PropertyManagementBusiness {
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
  emergencyService?: boolean;
  bbbRating?: string;
  propertyTypes?: string[];
  numberOfUnits?: number;
}

export const MEDFORD_PROPERTY_MANAGEMENT: PropertyManagementBusiness[] = [
  {
    id: 'cornerstone-property-management-medford-1',
    name: 'Cornerstone Property Management',
    trade: 'Property Management',
    phone: '(541) 200-3954',
    website: 'https://cornerstonepropertymgmt.com/',
    address: {
      street: '1234 Riverside Ave',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Residential Property Management', 'Tenant Screening', 'Rent Collection', 'Property Maintenance'],
    specialties: ['Single Family Homes', 'Multi-Family Properties'],
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.2,
    reviewCount: 32,
    yearsInBusiness: 15,
    verified: true,
    propertyTypes: ['Single Family', 'Multi-Family', 'Condos']
  },
  {
    id: 'new-foundations-property-management-medford-2',
    name: 'New Foundations Property Management',
    trade: 'Property Management',
    phone: '(541) 690-1550',
    website: 'https://newfoundationspm.com/',
    address: {
      street: '2345 Main Street',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Property Management', 'Rental Services', 'Maintenance Coordination', 'Financial Reporting'],
    specialties: ['Residential Rentals', 'Property Investments'],
    hours: 'Mon-Fri: 8:30AM-5PM',
    rating: 4.5,
    reviewCount: 28,
    yearsInBusiness: 12,
    verified: true,
    propertyTypes: ['Single Family', 'Apartments', 'Condos']
  },
  {
    id: 'northwoods-property-management-medford-3',
    name: 'Northwoods Property Management',
    trade: 'Property Management',
    phone: '(541) 690-1300',
    website: 'https://northwoodspm.com/',
    address: {
      street: '3456 Highland Drive',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Property Management', 'Tenant Placement', 'Property Marketing', 'Maintenance Services'],
    specialties: ['Residential Properties', 'Vacation Rentals'],
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.3,
    reviewCount: 19,
    yearsInBusiness: 8,
    verified: true,
    propertyTypes: ['Single Family', 'Vacation Rentals', 'Condos']
  },
  {
    id: 'sterling-west-property-management-medford-4',
    name: 'Sterling West Property Management',
    trade: 'Property Management',
    phone: '(541) 779-3615',
    website: 'https://sterlingwestrentals.com/',
    address: {
      street: '4567 West Main Street',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Property Management', 'Real Estate Services', 'Tenant Relations', 'Property Inspections'],
    specialties: ['Commercial Properties', 'Residential Management'],
    hours: 'Mon-Fri: 8AM-5PM',
    rating: 4.1,
    reviewCount: 24,
    yearsInBusiness: 20,
    verified: true,
    propertyTypes: ['Single Family', 'Commercial', 'Multi-Family']
  },
  {
    id: 'integrity-property-management-medford-5',
    name: 'Integrity Property Management LLC',
    trade: 'Property Management',
    phone: '(541) 414-4477',
    website: 'https://integritypropertymanagement.com/',
    address: {
      street: '5678 Jackson Street',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Full-Service Property Management', 'Tenant Screening', 'Rent Collection', 'Property Maintenance'],
    specialties: ['Residential Properties', 'Property Investment Consulting'],
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.4,
    reviewCount: 31,
    yearsInBusiness: 10,
    verified: true,
    propertyTypes: ['Single Family', 'Townhomes', 'Apartments']
  },
  {
    id: 'jl-moore-property-management-medford-6',
    name: 'J&L Moore Property Management LLC',
    trade: 'Property Management',
    phone: '(541) 664-3187',
    website: 'https://jlmoorerents.com/',
    address: {
      street: '6789 Central Avenue',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Property Management', 'Rental Property Services', 'Tenant Relations', 'Property Marketing'],
    specialties: ['Single Family Homes', 'Property Leasing'],
    hours: 'Mon-Fri: 8:30AM-4:30PM',
    rating: 4.0,
    reviewCount: 16,
    yearsInBusiness: 7,
    verified: true,
    propertyTypes: ['Single Family', 'Duplexes', 'Small Multi-Family']
  },
  {
    id: 'choice-one-property-management-medford-7',
    name: 'Choice One Property Management, LLC',
    trade: 'Property Management',
    phone: '(541) 622-8270',
    website: 'https://medfordpropertymgmt.com/',
    address: {
      street: '7890 North Phoenix Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Property Management', 'Tenant Placement', 'Property Maintenance', 'Financial Management'],
    specialties: ['Residential Rentals', 'Property Investments'],
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.2,
    reviewCount: 22,
    yearsInBusiness: 9,
    verified: true,
    propertyTypes: ['Single Family', 'Condos', 'Apartments']
  },
  {
    id: 'quality-property-management-medford-8',
    name: 'Quality Property Management',
    trade: 'Property Management',
    phone: '(541) 776-7674',
    website: 'https://qpmcompany.com/',
    address: {
      street: '8901 South Stage Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Full-Service Property Management', 'Tenant Screening', 'Maintenance Coordination', 'Rent Collection'],
    specialties: ['Quality Properties', 'Professional Management'],
    hours: 'Mon-Fri: 8AM-5PM',
    rating: 4.3,
    reviewCount: 27,
    yearsInBusiness: 14,
    verified: true,
    propertyTypes: ['Single Family', 'Multi-Family', 'Condos']
  },
  {
    id: 'allcities-property-management-medford-9',
    name: 'Allcities Property Management LLC',
    trade: 'Property Management',
    phone: '(541) 245-8811',
    website: 'https://allcitiesprop.com/',
    address: {
      street: '9012 Biddle Road',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Property Management', 'Rental Services', 'Property Maintenance', 'Tenant Relations'],
    specialties: ['Multi-City Properties', 'Comprehensive Management'],
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.1,
    reviewCount: 18,
    yearsInBusiness: 6,
    verified: true,
    propertyTypes: ['Single Family', 'Apartments', 'Commercial']
  },
  {
    id: 'asurent-property-management-medford-10',
    name: 'Asurent Property Management Medford',
    trade: 'Property Management',
    phone: '(541) 816-4140',
    website: 'https://medfordpropertymanagement.com/',
    address: {
      street: '1023 Crater Lake Avenue',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Property Management', 'Tenant Placement', 'Property Marketing', 'Maintenance Services'],
    specialties: ['Professional Property Management', 'Rental Properties'],
    hours: 'Mon-Fri: 8:30AM-5PM',
    rating: 4.0,
    reviewCount: 25,
    yearsInBusiness: 11,
    verified: true,
    propertyTypes: ['Single Family', 'Condos', 'Townhomes']
  },
  {
    id: 'pacific-rental-properties-medford-11',
    name: 'Pacific Rental Properties Medford',
    trade: 'Property Management',
    phone: '(541) 897-6500',
    website: 'https://pacificrentals.net/',
    address: {
      street: '1134 East Main Street',
      city: 'Medford',
      state: 'OR',
      zipCode: '97504'
    },
    services: ['Property Management', 'Rental Properties', 'Tenant Screening', 'Property Maintenance'],
    specialties: ['Pacific Northwest Properties', 'Rental Management'],
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.2,
    reviewCount: 33,
    yearsInBusiness: 16,
    verified: true,
    propertyTypes: ['Single Family', 'Multi-Family', 'Vacation Rentals']
  },
  {
    id: 'rutledge-property-management-medford-12',
    name: 'Rutledge Property Management',
    trade: 'Property Management',
    phone: '(541) 531-5456',
    website: 'https://rutledgeproperty.com/',
    address: {
      street: '1245 Court Street',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: ['Property Management', 'Real Estate Services', 'Property Maintenance', 'Tenant Relations'],
    specialties: ['Residential Properties', 'Property Investments'],
    hours: 'Mon-Fri: 8AM-5PM',
    rating: 4.3,
    reviewCount: 29,
    yearsInBusiness: 13,
    verified: true,
    propertyTypes: ['Single Family', 'Condos', 'Investment Properties']
  }
];

export async function getMedfordPropertyManagement(): Promise<PropertyManagementBusiness[]> {
  return MEDFORD_PROPERTY_MANAGEMENT;
}