'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/data/blog';
import { CommentForm } from './CommentForm';

interface CommentsListProps {
  comments: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply?: () => void;
}

function CommentItem({ comment, onReply }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplyAdded = () => {
    setShowReplyForm(false);
    onReply?.();
  };

  return (
    <div className="border-l-2 border-gray-100 pl-6 ml-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h5 className="font-medium text-gray-900">{comment.name}</h5>
              <p className="text-sm text-gray-500">
                {comment.createdAt.toLocaleDateString()} at {comment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <button
            onClick={handleReplyClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reply
          </button>
        </div>

        <div className="text-gray-700">
          {comment.content.split('\n').map((paragraph, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              postId={comment.postId}
              parentId={comment.id}
              onCommentAdded={handleReplyAdded}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentsList({ comments }: CommentsListProps) {
  const [displayedComments, setDisplayedComments] = useState(comments);
  
  // Group comments by parent/reply structure
  const rootComments = displayedComments.filter(comment => !comment.parentId);
  const replyComments = displayedComments.filter(comment => comment.parentId);

  const handleCommentUpdate = () => {
    // In a real app, this would refetch comments from the server
    // For now, we'll just trigger a re-render
    console.log('Comment update triggered - would refetch in real app');
  };

  if (displayedComments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4 opacity-50">💬</div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
        <p className="text-gray-600">Be the first to share your thoughts on this article!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rootComments.map((comment) => {
        const replies = replyComments.filter(reply => reply.parentId === comment.id);
        
        return (
          <div key={comment.id}>
            <CommentItem 
              comment={comment} 
              onReply={handleCommentUpdate}
            />
            
            {/* Replies */}
            {replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {replies.map((reply) => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply}
                    onReply={handleCommentUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Load More Comments (for pagination) */}
      {displayedComments.length >= 10 && (
        <div className="text-center pt-6 border-t">
          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Load More Comments
          </button>
        </div>
      )}

      {/* Comment Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <h5 className="font-medium text-blue-900 mb-2">Community Guidelines</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be respectful and constructive in your comments</li>
          <li>• Stay on topic and provide valuable insights</li>
          <li>• No spam, self-promotion, or inappropriate content</li>
          <li>• Comments are moderated and may take time to appear</li>
        </ul>
      </div>
    </div>
  );
}