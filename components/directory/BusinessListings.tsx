'use client';

import { useState, useCallback } from 'react';
import type { Business } from '@/lib/data/businesses';
import { BusinessModalContent } from './BusinessModalContent';

interface BusinessListingsProps {
  businesses: Business[];
  loading?: boolean;
  emptyMessage?: string;
}

export function BusinessListings({ businesses, loading = false, emptyMessage = 'No businesses found.' }: BusinessListingsProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const openModal = useCallback((businessId: string) => {
    setSelectedBusinessId(businessId);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedBusinessId(null);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 opacity-50">🏢</div>
        <h3 className="text-xl font-bold mb-2">No Businesses Found</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {businesses.map((business) => (
          <div key={business.id}>
            {/* Business Card Summary - Visible */}
            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(business.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-blue-600">
                  {business.name}
                </h3>
                {business.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 mb-1">
                    📍 {business.address.city}, {business.address.state}
                  </p>
                  <p className="text-gray-600 mb-1">
                    📞 {business.phone}
                  </p>
                  {business.rating && (
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500">
                        {'★'.repeat(Math.floor(business.rating))}{'☆'.repeat(5 - Math.floor(business.rating))}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {business.rating} ({business.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  {business.verified && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-1">
                      ✓ Verified
                    </span>
                  )}
                  {business.emergencyService && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mb-1 ml-2">
                      🚨 24/7 Emergency
                    </span>
                  )}
                  {business.yearsInBusiness && (
                    <p className="text-sm text-gray-600 mt-1">
                      {business.yearsInBusiness} years in business
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {business.services.slice(0, 3).map((service, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {service}
                  </span>
                ))}
                {business.services.length > 3 && (
                  <span className="text-blue-600 text-sm font-medium">
                    +{business.services.length - 3} more services
                  </span>
                )}
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>

            {/* SEO-COMPLIANT MODAL CONTENT - Hidden but in DOM for SEO */}
            <BusinessModalContent 
              business={business}
              isOpen={selectedBusinessId === business.id}
              onClose={closeModal}
            />
          </div>
        ))}
      </div>
    </>
  );
}