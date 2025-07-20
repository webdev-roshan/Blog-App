import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/lib/types';
import { useAuth } from '@/hooks/auth/useAuth';

import { API_BASE_URL } from '@/lib/config';

const fetchComments = async (postId: number | string): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}&_sort=createdAt&_order=desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

interface CreateCommentPayload {
  content: string;
  postId: number | string;
  userId: number | string;
}

const createComment = async (data: CreateCommentPayload): Promise<Comment> => {
  console.log('Creating comment with data:', data); // Debug log
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: data.content,
      postId: data.postId,
      userId: data.userId,
      createdAt: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create comment');
  }
  const result = await response.json();
  console.log('Created comment:', result); // Debug log
  return result;
};

interface DeleteCommentParams {
  id: number | string;
  postId: number | string;
}

const deleteComment = async ({ id }: DeleteCommentParams): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
};

export const useGetComments = (postId: number | string) => {
  return useQuery<Comment[], Error>({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId: number | string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (content: string) => {
      const payload = {
        content,
        postId: postId.toString(), // Ensure postId is string
        userId: user!.id.toString() // Ensure userId is string
      };
      console.log('Mutation payload:', payload); // Debug log
      return createComment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteCommentParams) => deleteComment(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}; 