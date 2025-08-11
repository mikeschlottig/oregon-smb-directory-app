import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getCommentsForPost, getAllBlogPosts } from '@/lib/data/blog';
import { CommentForm } from '@/components/blog/CommentForm';
import { CommentsList } from '@/components/blog/CommentsList';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) return {};
  
  return {
    title: `${post.title} - Oregon SMB Directory Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const [post, comments] = await Promise.all([
    getBlogPostBySlug(resolvedParams.slug),
    getBlogPostBySlug(resolvedParams.slug).then(p => p ? getCommentsForPost(p.id) : [])
  ]);
  
  if (!post) {
    notFound();
  }

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
            <Link href="/blog" className="text-blue-600 hover:underline">
              Blog
            </Link>
            <span className="text-gray-400">›</span>
            <span className="font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="ml-4 text-sm text-gray-500">
              {post.publishedAt.toLocaleDateString()}
            </span>
            {post.featured && (
              <span className="ml-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 pb-6 border-b">
            <div className="flex items-center">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime} min read</span>
              <span className="mx-2">•</span>
              <span>{post.commentCount} comments</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-blue-600">Share</button>
              <button className="hover:text-blue-600">Print</button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <CommentForm postId={post.id} />

          {/* Comments List */}
          <CommentsList comments={comments} />
        </div>

        {/* Related Articles */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <div className="text-center py-8 text-gray-500">
            <p>More related articles coming soon!</p>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Oregon SMB Directory. {post.title}</p>
        </div>
      </footer>
    </div>
  );
}