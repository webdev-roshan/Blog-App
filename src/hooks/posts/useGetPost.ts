import { useQuery } from '@tanstack/react-query';
import { Post } from '@/lib/types';

import { API_BASE_URL } from '@/lib/config';

const fetchPost = async (id: string): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};

export const useGetPost = (id: string) => {
  return useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}; 