import { useQuery } from '@tanstack/react-query';
import { Axios } from 'axios';
import { getMe } from '@/api/auth';

export function useMe(client: Axios) {
  return useQuery({
    queryFn: async () => (await getMe(client)).data,
    queryKey: ['employee', 'me'],
  });
}
