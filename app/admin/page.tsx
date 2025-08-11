'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBlogPosts, type BlogPost, type Comment, SAMPLE_COMMENTS } from '@/lib/data/blog';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  // Simple password authentication (in real app, use proper auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Invalid password');
    }
  };

  const loadData = async () => {
    const postsData = await getAllBlogPosts();
    setPosts(postsData);
    
    // Get pending comments
    const pending = SAMPLE_COMMENTS.filter(comment => !comment.approved);
    setPendingComments(pending);
  };

  const approveComment = (commentId: string) => {
    setPendingComments(prev => prev.filter(c => c.id !== commentId));
    // In real app, would update database
    alert('Comment approved!');
  };

  const deleteComment = (commentId: string) => {
    setPendingComments(prev => prev.filter(c => c.id !== commentId));
    // In real app, would update database
    alert('Comment deleted!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Demo password: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <nav className="flex items-center space-x-4 text-sm">
              <Link href="/" className="text-blue-600 hover:underline">
                Oregon SMB Directory
              </Link>
              <span className="text-gray-400">›</span>
              <span className="font-medium">Admin Panel</span>
            </nav>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'posts'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Blog Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'comments'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pending Comments ({pendingComments.length})
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Blog Posts</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Create New Post
              </button>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.publishedAt.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.commentCount} comments</span>
                        <span>•</span>
                        <span className={post.published ? 'text-green-600' : 'text-red-600'}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        {post.featured && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-600 font-medium">Featured</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View
                      </Link>
                      <button className="text-green-600 hover:text-green-700 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Pending Comments</h2>

            {pendingComments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 opacity-50">✅</div>
                <h3 className="text-lg font-medium mb-2">No pending comments</h3>
                <p className="text-gray-600">All comments have been reviewed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingComments.map((comment) => {
                  const post = posts.find(p => p.id === comment.postId);
                  return (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{comment.name}</h4>
                          <p className="text-sm text-gray-500">
                            on "{post?.title}" • {comment.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveComment(comment.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                      {comment.email && (
                        <p className="text-xs text-gray-500 mt-2">
                          Email: {comment.email}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}