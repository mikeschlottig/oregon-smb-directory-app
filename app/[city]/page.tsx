import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityData } from '@/lib/data/cities';
import { getAllIndustries } from '@/lib/data/industries';

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { city: 'portland' },
    { city: 'salem' },
    { city: 'eugene' },
    { city: 'medford' },
    { city: 'grants-pass' },
  ];
}

export async function generateMetadata({ params }: CityPageProps) {
  const resolvedParams = await params;
  const cityData = await getCityData(resolvedParams.city);
  if (!cityData) return {};
  
  return {
    title: `${cityData.name} Business Directory - Oregon SMB Directory`,
    description: `Find verified businesses in ${cityData.name}, Oregon. Complete directory of local services along the I-5 corridor.`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const cityData = await getCityData(resolvedParams.city);
  
  if (!cityData) {
    notFound();
  }
  
  const industries = await getAllIndustries();
  
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
            <span className="font-medium">{cityData.name}</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-directory-blue to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {cityData.name} Business Directory
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover verified local businesses in {cityData.name}, {cityData.county} County. 
            Population: {cityData.population.toLocaleString()}
          </p>
          
          {/* City Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{cityData.county}</div>
              <div className="text-sm opacity-90">County</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{cityData.population.toLocaleString()}</div>
              <div className="text-sm opacity-90">Population</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">I-5</div>
              <div className="text-sm opacity-90">Corridor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Business Categories in {cityData.name}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.id}
                href={`/${resolvedParams.city}/${industry.slug}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className={`text-4xl mb-4 ${
                  industry.color === 'yellow' ? 'text-yellow-600' :
                  industry.color === 'blue' ? 'text-blue-600' :
                  industry.color === 'orange' ? 'text-orange-600' :
                  industry.color === 'red' ? 'text-red-600' :
                  industry.color === 'teal' ? 'text-teal-600' : 'text-gray-600'
                }`}>
                  {industry.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">View Directory →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose {cityData.name} Businesses?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="font-bold mb-2">100% Verified</h3>
              <p className="text-gray-600">All businesses are verified with current licenses and insurance</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="font-bold mb-2">Customer Rated</h3>
              <p className="text-gray-600">Real reviews from local customers in the {cityData.name} area</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="font-bold mb-2">Direct Contact</h3>
              <p className="text-gray-600">Connect directly with businesses - no middleman fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Oregon SMB Directory. Serving {cityData.name} and the I-5 corridor.</p>
        </div>
      </footer>
    </div>
  );
}