import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/employee';
import { Axios } from 'axios';

export function useMe(client: Axios) {
  return useQuery({
    queryFn: async () => (await getMe(client)).data,
    queryKey: ['employee', 'me'],
  });
}
