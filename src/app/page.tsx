'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, CreatePostData } from '@/lib/types';
import { useGetPosts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/posts';
import { useAuth } from '@/hooks/auth/useAuth';
import { PostCard } from '@/components/PostCard';
import { PostForm } from '@/components/PostForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function Home() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [isAuthLoading, user, router]);

  const { data: posts, isLoading, error, refetch } = useGetPosts();
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDeletePost = (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: CreatePostData) => {
    if (editingPost) {
      updateMutation.mutate({ ...data, id: editingPost.id }, {
        onSuccess: () => {
          setShowForm(false);
          setEditingPost(null);
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
          setEditingPost(null);
        }
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Learn TanStack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}!</span>
              <button
                onClick={handleCreatePost}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Create Post
              </button>
              <button
                onClick={() => logout()}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <LoadingSpinner />}

        {error && (
          <ErrorMessage
            message="Failed to load posts. Please check if your JSON server is running on port 3002."
            onRetry={() => refetch()}
          />
        )}

        {posts && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Blog Posts</h2>
                <p className="text-gray-600 mt-1">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} available
                </p>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-500 text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first post!</p>
                <button
                  onClick={handleCreatePost}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {showForm && (
          <PostForm
            post={editingPost || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}

        {deleteMutation.isPending && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center gap-3">
                <LoadingSpinner />
                <span className="text-gray-700">Deleting post...</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}