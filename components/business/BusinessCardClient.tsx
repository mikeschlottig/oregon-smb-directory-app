'use client';

import { BusinessCard } from './business-card-components';
import type { Business } from '@/lib/data/businesses';

interface BusinessCardClientProps {
  business: Business;
  variant?: 'compact' | 'full' | 'featured';
  layout?: 'grid' | 'list';
}

export function BusinessCardClient({ business, variant = 'full', layout = 'grid' }: BusinessCardClientProps) {
  const handleCallClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirectionsClick = (address: string) => {
    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
  };

  const handleDetailsClick = (business: Business) => {
    // For now, just call - could open a modal in future
    handleCallClick(business.phone);
  };

  return (
    <BusinessCard
      business={business}
      variant={variant}
      layout={layout}
      onCallClick={handleCallClick}
      onDirectionsClick={handleDirectionsClick}
      onDetailsClick={handleDetailsClick}
    />
  );
}