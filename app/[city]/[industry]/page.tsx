import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityData } from '@/lib/data/cities';
import { getIndustryData } from '@/lib/data/industries';
import { getBusinessesByCity } from '@/lib/data/businesses';
import { BusinessCardClient } from '@/components/business/BusinessCardClient';

interface IndustryPageProps {
  params: Promise<{
    city: string;
    industry: string;
  }>;
}

export async function generateStaticParams() {
  // Generate combinations of city/industry for static generation
  const cityIndustryCombinations = [
    { city: 'portland', industry: 'electricians' },
    { city: 'portland', industry: 'plumbers' },
    { city: 'salem', industry: 'electricians' },
    { city: 'eugene', industry: 'electricians' },
    { city: 'medford', industry: 'electricians' },
  ];
  
  return cityIndustryCombinations;
}

export async function generateMetadata({ params }: IndustryPageProps) {
  const resolvedParams = await params;
  const [cityData, industryData] = await Promise.all([
    getCityData(resolvedParams.city),
    getIndustryData(resolvedParams.industry)
  ]);
  
  if (!cityData || !industryData) return {};
  
  return {
    title: `${industryData.name} in ${cityData.name}, Oregon - Oregon SMB Directory`,
    description: `Find verified ${industryData.name.toLowerCase()} in ${cityData.name}. Compare ratings, services, and contact information for local businesses.`,
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const resolvedParams = await params;
  const [cityData, industryData, businesses] = await Promise.all([
    getCityData(resolvedParams.city),
    getIndustryData(resolvedParams.industry),
    getBusinessesByCity(resolvedParams.city, resolvedParams.industry)
  ]);
  
  if (!cityData || !industryData) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-4 text-sm">
            <Link href="/" className="text-directory-blue hover:underline">
              Oregon SMB Directory
            </Link>
            <span className="text-gray-400">›</span>
            <Link href={`/${resolvedParams.city}`} className="text-directory-blue hover:underline">
              {cityData.name}
            </Link>
            <span className="text-gray-400">›</span>
            <span className="font-medium">{industryData.name}</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`text-white py-16 ${
        industryData.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
        industryData.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
        industryData.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
        industryData.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
        industryData.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
        'bg-gradient-to-r from-directory-blue to-blue-600'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">{industryData.icon}</div>
          <h1 className="text-4xl font-bold mb-4">
            {industryData.name} in {cityData.name}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {businesses.length > 0 
              ? `${businesses.length} verified ${industryData.name.toLowerCase()} serving ${cityData.name} and surrounding areas`
              : `Find trusted ${industryData.name.toLowerCase()} in ${cityData.name}, Oregon`
            }
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{businesses.length}</div>
              <div className="text-sm opacity-90">Businesses</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm opacity-90">Verified</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">
                {businesses.filter(b => b.emergencyService).length}
              </div>
              <div className="text-sm opacity-90">24/7 Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {industryData.name} in {cityData.name}
            </h2>
            <div className="text-gray-600">
              {businesses.length} businesses found
            </div>
          </div>

          {businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCardClient
                  key={business.id}
                  business={business}
                  variant="full"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-50">{industryData.icon}</div>
              <h3 className="text-xl font-bold mb-4">
                {industryData.name} Coming Soon to {cityData.name}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're working on adding verified {industryData.name.toLowerCase()} to our {cityData.name} directory. 
                Check back soon or explore other cities.
              </p>
              <Link
                href="/portland/electricians"
                className="inline-block bg-directory-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                View Portland Electricians
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {businesses.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              All {industryData.name.toLowerCase()} listed are verified, licensed, and rated by real customers. 
              Contact them directly - no fees, no middleman.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#top"
                className="bg-directory-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Back to Top
              </a>
              <Link
                href={`/${resolvedParams.city}`}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Browse Other Categories
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Oregon SMB Directory. {industryData.name} in {cityData.name}, Oregon.</p>
        </div>
      </footer>
    </div>
  );
}