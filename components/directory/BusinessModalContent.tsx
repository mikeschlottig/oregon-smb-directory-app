'use client';

import { useEffect, useCallback } from 'react';
import type { Business } from '@/lib/data/businesses';

interface BusinessModalContentProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessModalContent({ business, isOpen, onClose }: BusinessModalContentProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleCallClick = useCallback(() => {
    window.location.href = `tel:${business.phone}`;
  }, [business.phone]);

  const handleDirectionsClick = useCallback(() => {
    const address = `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zipCode}`;
    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
  }, [business.address]);

  const handleWebsiteClick = useCallback(() => {
    if (business.website) {
      const url = business.website.startsWith('http') ? business.website : `https://${business.website}`;
      window.open(url, '_blank');
    }
  }, [business.website]);

  return (
    /* CRITICAL SEO REQUIREMENT: Full HTML content in DOM for search engine indexing */
    <div 
      className={`
        business-modal-content
        ${isOpen ? 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4' : 'hidden'}
      `}
      onClick={handleBackdropClick}
      style={{ visibility: isOpen ? 'visible' : 'hidden' }}
    >
      {/* Modal Dialog */}
      <div 
        className={`
          bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto
          ${isOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'}
          transition-all duration-200 ease-out
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{business.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-700">
                  <span className="w-5 h-5 mr-2">📞</span>
                  <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                    {business.phone}
                  </a>
                </p>
                
                <p className="flex items-start text-gray-700">
                  <span className="w-5 h-5 mr-2 mt-0.5">📍</span>
                  <span>
                    {business.address.street}<br />
                    {business.address.city}, {business.address.state} {business.address.zipCode}
                  </span>
                </p>

                {business.website && (
                  <p className="flex items-center text-gray-700">
                    <span className="w-5 h-5 mr-2">🌐</span>
                    <a 
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {business.website}
                    </a>
                  </p>
                )}

                {business.email && (
                  <p className="flex items-center text-gray-700">
                    <span className="w-5 h-5 mr-2">✉️</span>
                    <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                      {business.email}
                    </a>
                  </p>
                )}

                {business.hours && (
                  <p className="flex items-center text-gray-700">
                    <span className="w-5 h-5 mr-2">🕒</span>
                    {business.hours}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Business Details</h3>
              <div className="space-y-3">
                {business.rating && (
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500 text-lg">
                        {'★'.repeat(Math.floor(business.rating))}{'☆'.repeat(5 - Math.floor(business.rating))}
                      </span>
                      <span className="ml-2 font-medium">{business.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {business.reviewCount} customer reviews
                    </p>
                  </div>
                )}

                {business.yearsInBusiness && (
                  <p className="text-gray-700">
                    <strong>Experience:</strong> {business.yearsInBusiness} years in business
                  </p>
                )}

                {business.licenseNumber && (
                  <p className="text-gray-700">
                    <strong>License:</strong> #{business.licenseNumber}
                  </p>
                )}

                {business.bbbRating && (
                  <p className="text-gray-700">
                    <strong>BBB Rating:</strong> {business.bbbRating}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {business.verified && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      ✓ Verified Business
                    </span>
                  )}
                  {business.emergencyService && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      🚨 24/7 Emergency Service
                    </span>
                  )}
                  {business.featured && (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      ⭐ Featured Business
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Services Offered</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {business.services.map((service, index) => (
                <span 
                  key={index}
                  className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Specialties */}
          {business.specialties && business.specialties.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {business.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="bg-purple-50 text-purple-800 px-3 py-2 rounded text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCallClick}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <span className="mr-2">📞</span>
              Call {business.name}
            </button>
            
            <button
              onClick={handleDirectionsClick}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
            >
              <span className="mr-2">📍</span>
              Get Directions
            </button>

            {business.website && (
              <button
                onClick={handleWebsiteClick}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
              >
                <span className="mr-2">🌐</span>
                Visit Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}