'use client';

import { useState } from 'react';
import { addComment } from '@/lib/data/blog';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ postId, parentId, onCommentAdded }: CommentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      setError('Name and comment are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addComment({
        postId,
        parentId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        content: formData.content.trim()
      });

      setFormData({ name: '', email: '', content: '' });
      setSubmitted(true);
      onCommentAdded?.();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <span className="text-green-600 text-xl mr-3">✓</span>
          <div>
            <h4 className="text-green-800 font-medium">Comment Submitted!</h4>
            <p className="text-green-700 text-sm mt-1">
              Your comment has been submitted and is awaiting approval. Thank you for participating in the discussion!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-8">
      <h4 className="text-lg font-semibold mb-4">
        {parentId ? 'Reply to Comment' : 'Leave a Comment'}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email is optional and will not be displayed publicly
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts..."
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            * Required fields
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </div>

        <div className="text-xs text-gray-500 border-t pt-3">
          <p>
            Comments are moderated and will appear after approval. 
            Please be respectful and constructive in your feedback.
          </p>
        </div>
      </form>
    </div>
  );
}