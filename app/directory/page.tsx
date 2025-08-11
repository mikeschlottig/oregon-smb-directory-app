'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DirectoryFilters } from '@/components/directory/DirectoryFilters';
import { BusinessListings } from '@/components/directory/BusinessListings';
import { getAllCities, type City } from '@/lib/data/cities';
import { getAllIndustries, type Industry } from '@/lib/data/industries';
import { getBusinessesByCity, type Business } from '@/lib/data/businesses';

function DirectoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [cities, setCities] = useState<City[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCity, setSelectedCity] = useState<string | null>(
    searchParams.get('city') || null
  );
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(
    searchParams.get('industry') || null
  );

  // Load initial data
  useEffect(() => {
    Promise.all([
      getAllCities(),
      getAllIndustries()
    ]).then(([citiesData, industriesData]) => {
      setCities(citiesData);
      setIndustries(industriesData);
      setLoading(false);
    });
  }, []);

  // Load businesses when filters change
  useEffect(() => {
    if (selectedCity && selectedIndustry) {
      setLoading(true);
      getBusinessesByCity(selectedCity, selectedIndustry).then((businessData) => {
        setBusinesses(businessData);
        setLoading(false);
      });
    } else {
      setBusinesses([]);
    }
  }, [selectedCity, selectedIndustry]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (selectedIndustry) params.set('industry', selectedIndustry);
    
    const newUrl = params.toString() ? `/directory?${params.toString()}` : '/directory';
    router.replace(newUrl, { scroll: false });
  }, [selectedCity, selectedIndustry, router]);

  const handleCityChange = useCallback((city: string | null) => {
    setSelectedCity(city);
  }, []);

  const handleIndustryChange = useCallback((industry: string | null) => {
    setSelectedIndustry(industry);
  }, []);

  const handleSearch = useCallback(() => {
    if (selectedCity && selectedIndustry) {
      // Navigate to the specific city/industry page
      router.push(`/${selectedCity}/${selectedIndustry}`);
    }
  }, [selectedCity, selectedIndustry, router]);

  const selectedCityData = cities.find(c => c.slug === selectedCity);
  const selectedIndustryData = industries.find(i => i.slug === selectedIndustry);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-4 text-sm">
            <Link href="/" className="text-blue-600 hover:underline">
              Oregon SMB Directory
            </Link>
            <span className="text-gray-400">›</span>
            <span className="font-medium">Business Directory</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find Local Businesses in Oregon
          </h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Search and filter through verified businesses across Oregon. 
            Find trusted services in your city and industry.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <DirectoryFilters
              cities={cities}
              industries={industries}
              selectedCity={selectedCity}
              selectedIndustry={selectedIndustry}
              onCityChange={handleCityChange}
              onIndustryChange={handleIndustryChange}
              onSearch={handleSearch}
            />

            {/* Featured Cities */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Featured Cities</h3>
              <div className="space-y-2">
                {cities.filter(city => city.regionalHub).map((city) => (
                  <Link
                    key={city.id}
                    href={`/${city.slug}`}
                    className="block text-blue-600 hover:underline text-sm"
                  >
                    📍 {city.name} ({(city.population / 1000).toFixed(0)}K)
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Industries */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Popular Industries</h3>
              <div className="space-y-2">
                {industries.slice(0, 6).map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryChange(industry.slug)}
                    className="block text-left text-blue-600 hover:underline text-sm w-full"
                  >
                    {industry.icon} {industry.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {selectedCity && selectedIndustry ? (
              <>
                {/* Results Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedIndustryData?.name} in {selectedCityData?.name}
                  </h2>
                  <p className="text-gray-600">
                    {loading ? 'Searching...' : `${businesses.length} businesses found`}
                  </p>
                </div>

                {/* Business Listings */}
                <BusinessListings
                  businesses={businesses}
                  loading={loading}
                  emptyMessage={`No ${selectedIndustryData?.name.toLowerCase()} found in ${selectedCityData?.name}. Try a different city or industry.`}
                />
              </>
            ) : (
              /* Welcome State */
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-2xl font-bold mb-4">Search Oregon Businesses</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Use the filters on the left to find businesses by city and industry. 
                  All businesses are verified and locally owned.
                </p>

                {/* Quick Search Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {[
                    { city: 'portland', industry: 'electricians', label: 'Portland Electricians' },
                    { city: 'medford', industry: 'roofers', label: 'Medford Roofers' },
                    { city: 'eugene', industry: 'plumbers', label: 'Eugene Plumbers' },
                    { city: 'salem', industry: 'general-contractors', label: 'Salem Contractors' },
                    { city: 'grants-pass', industry: 'real-estate', label: 'Grants Pass Realtors' },
                    { city: 'roseburg', industry: 'lawfirms', label: 'Roseburg Law Firms' },
                  ].map((option, index) => (
                    <Link
                      key={index}
                      href={`/${option.city}/${option.industry}`}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
                    >
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600">View listings →</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Oregon SMB Directory. Find trusted local businesses across Oregon.</p>
        </div>
      </footer>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading directory...</div>}>
      <DirectoryPageContent />
    </Suspense>
  );
}