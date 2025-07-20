import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post, UpdatePostData } from '@/lib/types';
import { API_BASE_URL } from '@/lib/config';

const updatePost = async (postData: UpdatePostData): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...postData,
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  return response.json();
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, UpdatePostData>({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error updating post:', error);
    },
  });
};
