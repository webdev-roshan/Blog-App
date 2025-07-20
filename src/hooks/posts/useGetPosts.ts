import { useQuery } from '@tanstack/react-query';
import { Post } from '@/lib/types';
import { useAuth } from '@/hooks/auth/useAuth';

import { API_BASE_URL } from '@/lib/config';

const fetchPosts = async (userId: string | number): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const useGetPosts = () => {
  const { user } = useAuth();

  return useQuery<Post[], Error>({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPosts(user!.id),
    enabled: !!user,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}; 