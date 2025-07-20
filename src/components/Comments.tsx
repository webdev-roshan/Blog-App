import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGetComments, useCreateComment, useDeleteComment } from '@/hooks/comments/useComments';
import { Comment } from '@/lib/types';

interface CommentsProps {
  postId: number | string;
}

export const Comments = ({ postId }: CommentsProps) => {
  // Ensure postId remains as string to match JSON Server's ID format
  const actualPostId = typeof postId === 'number' ? postId.toString() : postId;
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = useGetComments(actualPostId);
  const createCommentMutation = useCreateComment(actualPostId);
  const deleteCommentMutation = useDeleteComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setNewComment('');
      },
      onError: (error) => {
        console.error('Failed to create comment:', error);
      }
    });
  };

  const handleDelete = (comment: Comment) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate({ id: comment.id, postId: actualPostId });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-20 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Comments ({comments?.length || 0})
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          rows={3}
        />
        <button
          type="submit"
          disabled={createCommentMutation.isPending || !newComment.trim()}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-900">{comment.content}</p>
              </div>
              {user?.id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {comments?.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}; 