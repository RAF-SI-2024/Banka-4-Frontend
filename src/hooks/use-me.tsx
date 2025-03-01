import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/auth';
import { useHttpClient } from '@/context/HttpClientContext';
import { useAuth } from '@/context/AuthContext';
import { MeResponseDto as EmployeeMeDto } from '@/api/response/MeResponseDto';

type UseMeResult =
  | {
      state: 'loading';
    }
  | {
      state: 'error';
      error: Error;
    }
  | {
      state: 'logged-out';
    }
  | {
      state: 'logged-in';
      type: 'employee';
      me: EmployeeMeDto;
    }; /* TODO: | {
  state: 'logged-in',
  type: 'client',
  me: ClientMeDto
} */

export function useMe(): UseMeResult {
  const client = useHttpClient();
  const auth = useAuth();

  const fetchUs = useQuery({
    enabled: auth.isLoggedIn,
    queryKey: [
      'users',
      'ours',
      /* isLoggedIn check is redundant with check above, I fear.  */
      auth.isLoggedIn && auth.refreshToken,
    ],
    queryFn: async () => (await getMe(client)).data,
  });

  if (auth.isLoading) return { state: 'loading' };

  if (!auth.isLoggedIn)
    return {
      state: 'logged-out',
    };

  if (auth.userType !== 'employee')
    throw new Error(
      'TODO(arsen): please add client UserType, with a DU-case above'
    );

  /* Separate from the above loading, since we can tell whether we're logged in
   * here, but not above.
   */
  if (fetchUs.isPending) return { state: 'loading' };

  if (fetchUs.isError) return { state: 'error', error: fetchUs.error };

  return {
    state: 'logged-in',
    me: fetchUs.data,
    type: 'employee',
  };
}
