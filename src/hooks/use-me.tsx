import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import { useAuth } from '@/context/AuthContext';
import { EmployeeResponseDto } from '@/api/response/employee';
import { ClientResponseDto } from '@/api/response/client';
import { getMe } from '@/api/auth';
import { assertNever } from '@/types/utils';

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
      me: EmployeeResponseDto;
    }
  | {
      state: 'logged-in';
      type: 'client';
      me: ClientResponseDto;
    };

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
    queryFn: async () => {
      if (!auth.isLoggedIn) throw Error('impossible (never say never)');

      return (await getMe(client, auth.userType)).data;
    },
  });

  if (auth.isLoading) return { state: 'loading' };

  if (!auth.isLoggedIn)
    return {
      state: 'logged-out',
    };

  /* Separate from the above loading, since we can tell whether we're logged in
   * here, but not above.
   */
  if (fetchUs.isPending) return { state: 'loading' };

  if (fetchUs.isError) return { state: 'error', error: fetchUs.error };

  if (auth.userType === 'employee') {
    return {
      state: 'logged-in',
      /* calling getMe with employee userType
       * will always return EmployeeResponseDto
       */
      me: fetchUs.data as EmployeeResponseDto,
      type: 'employee',
    };
  } else if (auth.userType === 'client') {
    return {
      state: 'logged-in',
      /* calling getMe with client userType
       * will always return ClientResponseDto
       */
      me: fetchUs.data as ClientResponseDto,
      type: 'client',
    };
  } else {
    assertNever(auth.userType);
  }
}
