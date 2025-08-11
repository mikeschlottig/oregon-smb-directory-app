import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-directory-blue to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Oregon's Complete Business Directory
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Find verified local businesses along the entire I-5 corridor from Portland to Ashland. 
            Connect with trusted electricians, plumbers, contractors, and more.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-90">Cities Covered</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">14</div>
              <div className="text-sm opacity-90">Industries</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">700+</div>
              <div className="text-sm opacity-90">Business Pages</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-90">Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Cities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Major Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Grants Pass', population: '38K', slug: 'grants-pass' },
              { name: 'Medford', population: '87K', slug: 'medford' },
              { name: 'Roseburg', population: '23K', slug: 'roseburg' },
              { name: 'Eugene', population: '178K', slug: 'eugene' },
              { name: 'Salem', population: '179K', slug: 'salem' },
              { name: 'Portland', population: '641K', slug: 'portland' },
            ].map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{city.name}</h3>
                <p className="text-gray-600 mb-4">Population: {city.population}</p>
                <p className="text-directory-blue font-semibold">View Businesses →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Search Our Business Directory</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Filter businesses by city and industry to find exactly what you need. 
            All listings are verified and include detailed contact information.
          </p>
          <Link
            href="/directory"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Browse Directory with Filters
          </Link>
        </div>
      </section>

      {/* Featured Industries */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Industries</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Lawfirms', icon: '⚖️', slug: 'lawfirms', color: 'text-blue-600' },
              { name: 'Roofers', icon: '🏠', slug: 'roofers', color: 'text-orange-600' },
              { name: 'Real Estate', icon: '🏡', slug: 'real-estate', color: 'text-green-600' },
              { name: 'General Contractors', icon: '🏗️', slug: 'general-contractors', color: 'text-orange-600' },
              { name: 'Plumbers', icon: '🔧', slug: 'plumbers', color: 'text-blue-600' },
              { name: 'Electricians', icon: '⚡', slug: 'electricians', color: 'text-yellow-600' },
            ].map((industry) => (
              <div
                key={industry.slug}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`text-3xl mb-2 ${industry.color}`}>{industry.icon}</div>
                <p className="font-medium text-sm">{industry.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-directory-blue text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Local Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Start by selecting your city and browse verified businesses in your area.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/portland/electricians"
              className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors"
            >
              Explore Portland Electricians
            </Link>
            <Link
              href="/blog"
              className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Oregon SMB Directory. Powered by LEVERAGEAI LLC.</p>
          <p className="text-gray-400 mt-2">Serving the entire I-5 corridor from Portland to Ashland.</p>
        </div>
      </footer>
    </div>
  );
}