import Link from 'next/link';
import { getAllBlogPosts, type BlogPost } from '@/lib/data/blog';

export const metadata = {
  title: 'Oregon Business Blog - Oregon SMB Directory',
  description: 'Stay informed about local business trends, industry insights, and Oregon business news.',
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

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
            <span className="font-medium">Blog</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Oregon Business Blog
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Industry insights, business trends, and local news for Oregon's small business community
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {featuredPost.image && (
                  <div className="aspect-video bg-gray-200">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="ml-4 text-sm text-gray-500">
                      {featuredPost.publishedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>By {featuredPost.author}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.readTime} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <div className="text-gray-600">
              {posts.length} articles
            </div>
          </div>

          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {post.image && (
                      <div className="aspect-video bg-gray-200">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {post.category}
                        </span>
                        <span className="ml-auto text-sm text-gray-500">
                          {post.publishedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📝</div>
              <h3 className="text-xl font-bold mb-2">No Articles Yet</h3>
              <p className="text-gray-600">Check back soon for industry insights and business tips!</p>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="mb-6 max-w-md mx-auto">
            Get the latest Oregon business news and directory updates delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Oregon SMB Directory. Oregon Business Blog.</p>
        </div>
      </footer>
    </div>
  );
}