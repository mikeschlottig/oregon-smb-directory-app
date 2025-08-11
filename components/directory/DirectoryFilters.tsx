'use client';

import { useState, useCallback } from 'react';
import type { City } from '@/lib/data/cities';
import type { Industry } from '@/lib/data/industries';

interface DirectoryFiltersProps {
  cities: City[];
  industries: Industry[];
  selectedCity: string | null;
  selectedIndustry: string | null;
  onCityChange: (city: string | null) => void;
  onIndustryChange: (industry: string | null) => void;
  onSearch: () => void;
}

export function DirectoryFilters({ 
  cities, 
  industries, 
  selectedCity, 
  selectedIndustry, 
  onCityChange, 
  onIndustryChange, 
  onSearch 
}: DirectoryFiltersProps) {
  const handleCityChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onCityChange(value === '' ? null : value);
  }, [onCityChange]);

  const handleIndustryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onIndustryChange(value === '' ? null : value);
  }, [onIndustryChange]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  }, [onSearch]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filter Businesses</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Filter */}
        <div>
          <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            id="city-select"
            value={selectedCity || ''}
            onChange={handleCityChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label htmlFor="industry-select" className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            id="industry-select"
            value={selectedIndustry || ''}
            onChange={handleIndustryChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry.id} value={industry.slug}>
                {industry.icon} {industry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {selectedCity && selectedIndustry 
            ? `Search ${industries.find(i => i.slug === selectedIndustry)?.name} in ${cities.find(c => c.slug === selectedCity)?.name}`
            : 'Search Businesses'
          }
        </button>

        {/* Clear Filters */}
        {(selectedCity || selectedIndustry) && (
          <button
            type="button"
            onClick={() => {
              onCityChange(null);
              onIndustryChange(null);
            }}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Clear Filters
          </button>
        )}
      </form>

      {/* Active Filters Display */}
      {(selectedCity || selectedIndustry) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCity && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                📍 {cities.find(c => c.slug === selectedCity)?.name}
                <button
                  onClick={() => onCityChange(null)}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedIndustry && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {industries.find(i => i.slug === selectedIndustry)?.icon} {industries.find(i => i.slug === selectedIndustry)?.name}
                <button
                  onClick={() => onIndustryChange(null)}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}