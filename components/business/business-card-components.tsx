// Business Card Components - Southern Oregon Trades Directory
// Based on southern-oregon-doctors-directory modal format

import React from 'react';
import { Phone, MapPin, Clock, Globe, Star, Shield, Award } from 'lucide-react';

// Type definitions
interface Business {
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
}

interface BusinessCardProps {
  business: Business;
  variant?: 'compact' | 'full' | 'featured';
  layout?: 'grid' | 'list';
  onCallClick?: (phone: string) => void;
  onDetailsClick?: (business: Business) => void;
  onDirectionsClick?: (address: string) => void;
}

// Trade icon mapping
const TradeIcons = {
  'Electrician': '⚡',
  'Plumber': '🔧',
  'HVAC': '🌡️',
  'Contractor': '🏗️',
  'Drywall': '🧱',
  'Painter': '🎨',
  'Handyman': '🔨'
};

// Main Business Card Component
export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  variant = 'full',
  layout = 'grid',
  onCallClick,
  onDetailsClick,
  onDirectionsClick
}) => {
  const tradeIcon = TradeIcons[business.trade as keyof typeof TradeIcons] || '🏢';
  const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zipCode}`;

  return (
    <div className={`
      business-card bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200
      ${layout === 'list' ? 'flex' : 'block'}
      ${variant === 'featured' ? 'ring-2 ring-electrician-gold shadow-xl' : ''}
    `}>
      {/* Card Header */}
      <BusinessCardHeader 
        name={business.name}
        trade={business.trade}
        tradeIcon={tradeIcon}
        rating={business.rating}
        reviewCount={business.reviewCount}
        featured={business.featured}
      />

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Contact Information */}
        <BusinessCardContact 
          phone={business.phone}
          address={fullAddress}
          website={business.website}
          hours={business.hours}
        />

        {/* Services */}
        <BusinessCardServices 
          services={business.services}
          specialties={business.specialties}
          trade={business.trade}
        />

        {/* Verification Badges */}
        <BusinessCardBadges 
          licenseNumber={business.licenseNumber}
          verified={business.verified}
          yearsInBusiness={business.yearsInBusiness}
          emergencyService={business.emergencyService}
          bbbRating={business.bbbRating}
        />

        {/* Action Buttons */}
        <BusinessCardActions 
          phone={business.phone}
          address={fullAddress}
          business={business}
          onCallClick={onCallClick}
          onDetailsClick={onDetailsClick}
          onDirectionsClick={onDirectionsClick}
        />
      </div>
    </div>
  );
};

// Card Header Component
interface BusinessCardHeaderProps {
  name: string;
  trade: string;
  tradeIcon: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
}

export const BusinessCardHeader: React.FC<BusinessCardHeaderProps> = ({
  name,
  trade,
  tradeIcon,
  rating,
  reviewCount,
  featured
}) => {
  return (
    <div className="relative">
      {featured && (
        <div className="absolute -top-2 -right-2 bg-electrician-gold text-black text-xs px-2 py-1 rounded-full font-semibold z-10">
          ⭐ FEATURED
        </div>
      )}
      
      <div className="bg-gradient-to-r from-directory-blue to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{tradeIcon}</div>
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-blue-100 text-sm">Licensed {trade}</p>
            </div>
          </div>
          
          {rating && (
            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-xs">({reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Contact Information Component
interface BusinessCardContactProps {
  phone: string;
  address: string;
  website?: string;
  hours?: string;
}

export const BusinessCardContact: React.FC<BusinessCardContactProps> = ({
  phone,
  address,
  website,
  hours
}) => {
  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Contact Information</h4>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="font-mono">{phone}</span>
          </div>
          
          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5" />
            <span>{address}</span>
          </div>
          
          {hours && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{hours}</span>
            </div>
          )}
          
          {website && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Globe className="w-4 h-4" />
              <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" 
                 className="text-directory-blue hover:underline">
                {website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Services Component
interface BusinessCardServicesProps {
  services: string[];
  specialties?: string[];
  trade: string;
}

export const BusinessCardServices: React.FC<BusinessCardServicesProps> = ({
  services,
  specialties,
  trade
}) => {
  const allServices = [...services, ...(specialties || [])];
  const displayServices = allServices.slice(0, 6); // Limit to 6 services for clean display

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-700">✅ Services Offered</h4>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {displayServices.map((service, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`
              w-2 h-2 rounded-full
              ${trade === 'Electrician' ? 'bg-electrician-gold' : 
                trade === 'Plumber' ? 'bg-plumber-blue' :
                trade === 'HVAC' ? 'bg-hvac-orange' : 'bg-directory-blue'}
            `} />
            <span className="text-sm text-gray-700">{service}</span>
          </div>
        ))}
      </div>
      
      {allServices.length > 6 && (
        <p className="text-xs text-gray-500">+{allServices.length - 6} more services</p>
      )}
    </div>
  );
};

// Verification Badges Component
interface BusinessCardBadgesProps {
  licenseNumber?: string;
  verified: boolean;
  yearsInBusiness?: number;
  emergencyService?: boolean;
  bbbRating?: string;
}

export const BusinessCardBadges: React.FC<BusinessCardBadgesProps> = ({
  licenseNumber,
  verified,
  yearsInBusiness,
  emergencyService,
  bbbRating
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {licenseNumber && (
        <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
          <Shield className="w-3 h-3" />
          <span>Oregon CCB #{licenseNumber}</span>
        </div>
      )}
      
      {bbbRating && (
        <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
          <Award className="w-3 h-3" />
          <span>BBB {bbbRating}</span>
        </div>
      )}
      
      {yearsInBusiness && (
        <div className="bg-gray-50 text-gray-700 px-2 py-1 rounded text-xs">
          {yearsInBusiness}+ Years
        </div>
      )}
      
      {emergencyService && (
        <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">
          24/7 Emergency
        </div>
      )}
      
      {verified && (
        <div className="flex items-center space-x-1 bg-verified-green text-white px-2 py-1 rounded text-xs font-semibold">
          <Shield className="w-3 h-3" />
          <span>100% Verified ✓</span>
        </div>
      )}
    </div>
  );
};

// Action Buttons Component
interface BusinessCardActionsProps {
  phone: string;
  address: string;
  business: Business;
  onCallClick?: (phone: string) => void;
  onDetailsClick?: (business: Business) => void;
  onDirectionsClick?: (address: string) => void;
}

export const BusinessCardActions: React.FC<BusinessCardActionsProps> = ({
  phone,
  address,
  business,
  onCallClick,
  onDetailsClick,
  onDirectionsClick
}) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
      <button
        onClick={() => onCallClick?.(phone)}
        className="flex-1 bg-directory-blue text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
      >
        <Phone className="w-4 h-4" />
        <span>Call Now</span>
      </button>
      
      <button
        onClick={() => onDetailsClick?.(business)}
        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
      >
        Get Details
      </button>
      
      <button
        onClick={() => onDirectionsClick?.(address)}
        className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
        title="Get Directions"
      >
        <MapPin className="w-4 h-4" />
      </button>
    </div>
  );
};

// Business Detail Modal Component (matches your doctors directory)
interface BusinessModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onCallClick?: (phone: string) => void;
  onDirectionsClick?: (address: string) => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  business,
  isOpen,
  onClose,
  onCallClick,
  onDirectionsClick
}) => {
  if (!isOpen) return null;

  const tradeIcon = TradeIcons[business.trade as keyof typeof TradeIcons] || '🏢';
  const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zipCode}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Business Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Business Info */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{tradeIcon}</div>
            <div>
              <h3 className="text-2xl font-bold">{business.name}</h3>
              <p className="text-gray-600">Licensed {business.trade}</p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{fullAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-mono">{business.phone}</span>
                </div>
                {business.hours && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{business.hours}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" 
                       className="text-directory-blue hover:underline">
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Services</h4>
              <div className="grid grid-cols-1 gap-1 text-sm">
                {business.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="text-electrician-gold">{tradeIcon}</div>
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div>
            <h4 className="font-semibold text-lg mb-3">✅ Certifications & Verification</h4>
            <BusinessCardBadges 
              licenseNumber={business.licenseNumber}
              verified={business.verified}
              yearsInBusiness={business.yearsInBusiness}
              emergencyService={business.emergencyService}
              bbbRating={business.bbbRating}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={() => onCallClick?.(business.phone)}
              className="flex-1 bg-directory-blue text-white px-6 py-3 rounded font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call {business.phone}</span>
            </button>
            
            <button
              onClick={() => onDirectionsClick?.(fullAddress)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage with sample data
export const ExampleUsage = () => {
  const sampleElectrician: Business = {
    id: 'abc-electric-123',
    name: 'ABC Electric Company',
    trade: 'Electrician',
    phone: '(541) 555-0123',
    website: 'www.abcelectric.com',
    address: {
      street: '123 Main St',
      city: 'Medford',
      state: 'OR',
      zipCode: '97501'
    },
    services: [
      'Residential Electrical',
      'Commercial Electrical', 
      'Emergency Repairs',
      'Panel Upgrades',
      'LED Lighting',
      'Smart Home Systems'
    ],
    hours: 'Mon-Fri: 7AM-5PM',
    rating: 4.8,
    reviewCount: 47,
    licenseNumber: '123456',
    yearsInBusiness: 15,
    verified: true,
    emergencyService: true,
    bbbRating: 'A+'
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Business Card Components</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BusinessCard 
            business={sampleElectrician}
            variant="full"
            onCallClick={(phone) => console.log('Calling:', phone)}
            onDetailsClick={(business) => console.log('Details for:', business.name)}
            onDirectionsClick={(address) => console.log('Directions to:', address)}
          />
          
          <BusinessCard 
            business={{...sampleElectrician, featured: true}}
            variant="featured"
            onCallClick={(phone) => console.log('Calling:', phone)}
            onDetailsClick={(business) => console.log('Details for:', business.name)}
            onDirectionsClick={(address) => console.log('Directions to:', address)}
          />
        </div>
      </div>
    </div>
  );
};