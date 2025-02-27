'use client';

import { assertNever } from '@/types/utils';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import axios, { isAxiosError } from 'axios';
import { API_BASE } from '@/lib/utils';
import { LoginRequestDto, RefreshTokenDto } from '@/api/request/auth';
import { LoginResponseDto, RefreshTokenResponseDto } from '@/api/response/auth';

type LoggedInAuthState = {
  accessToken: Promise<string>;
  refreshToken: string;
};

/** Load a previously-stored authentication state from `sessionStorage`.  */
function loadAuthenticationState(): LoggedInAuthState | undefined {
  const accessToken = sessionStorage.getItem('b4/accessToken');
  const refreshToken = sessionStorage.getItem('b4/refreshToken');
  if (!(accessToken && refreshToken)) return undefined;

  return {
    accessToken: Promise.resolve(accessToken),
    refreshToken,
  };
}

/** Serialize authentication state into `sessionStorage`.  */
async function storeAuthenticationState(state: LoggedInAuthState | undefined) {
  if (!state) {
    sessionStorage.removeItem('b4/accessToken');
    sessionStorage.removeItem('b4/refreshToken');
    return;
  }

  try {
    const { accessToken, refreshToken } = state;
    const accessToken_ = await accessToken;
    sessionStorage.setItem('b4/accessToken', accessToken_);
    sessionStorage.setItem('b4/refreshToken', refreshToken);
  } catch (_err) {
    // TODO(arsen): Indicates a failed refresh and save.  The refresh error
    // should be handled elsewhere.  Should we ignore it here?  There's no way
    // to recover local to this site, and an attempt at redoing would raise an
    // error again.
  }
}

/* State management.  */
type AuthAction =
  | { type: 'invalidateAccessToken'; newToken: Promise<string> }
  | { type: 'completeLogin'; data: LoggedInAuthState }
  | { type: 'loadState' }
  | { type: 'logout' };

function reduceAuth(
  oldState: LoggedInAuthState | undefined,
  action: AuthAction
): LoggedInAuthState | undefined {
  if (action.type === 'invalidateAccessToken') {
    if (!oldState) return oldState;
    const ns = {
      ...oldState,
      accessToken: action.newToken,
    };
    storeAuthenticationState(ns);
    return ns;
  } else if (action.type === 'completeLogin') {
    const ns = {
      isLoggedIn: true,
      ...action.data,
    };
    storeAuthenticationState(ns);
    return ns;
  } else if (action.type === 'loadState') {
    return loadAuthenticationState();
  } else if (action.type === 'logout') {
    storeAuthenticationState(undefined);
    return undefined;
  }
  assertNever(action);
}

type AuthContextT =
  | {
      isLoggedIn: false;
      isLoading: boolean;
      /** Attempts to log in.
       * @throws Underlying error, if login fails.
       */
      login: (
        type: 'employee' | 'customer',
        username: string,
        password: string
      ) => Promise<void>;
    }
  | ({
      isLoading: false;
      isLoggedIn: true;
      /** Attempts to refresh the current access token.
       *
       * Side effect: Updates the auth state with the new access token.
       * @returns New access token.
       */
      refreshAccessToken: () => Promise<string>;
      /** Throws out the current session and logs out.  */
      logout: () => void;
    } & LoggedInAuthState);
const AuthContext = createContext<AuthContextT | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, dispatch] = useReducer<
    LoggedInAuthState | undefined,
    [AuthAction]
  >(reduceAuth, undefined);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: 'loadState' });
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={
        authState
          ? {
              isLoggedIn: true,
              isLoading: false,
              ...authState,

              refreshAccessToken: () => {
                const captureAuthState = authState;
                const newATP = (async () => {
                  try {
                    return (
                      await axios.post<RefreshTokenResponseDto>(
                        '/auth/refresh-token',
                        {
                          refresh_token: captureAuthState.refreshToken,
                        } satisfies RefreshTokenDto,
                        {
                          baseURL: API_BASE,
                        }
                      )
                    ).data.access_token;
                  } catch (err) {
                    /* Detect expired refresh tokens.  */
                    if (
                      isAxiosError(err) &&
                      /* If we got a response...  */
                      err.response &&
                      /* ... and it was Unauthorized or Conflict... */
                      (err.response.status === 409 ||
                        err.response.status === 401) &&
                      /* ... and the response body exists and is an object... */
                      typeof err.response.data === 'object' &&
                      /* ... and it tells us the refresh token expired or was
                       * revoked... */
                      (err.response.data.data === 'ExpiredJwt' ||
                        err.response.data.data === 'RefreshTokenRevoked')
                    )
                      /* ... then, the session is over.  */
                      dispatch({ type: 'logout' });
                    throw err;
                  }
                })();
                dispatch({ type: 'invalidateAccessToken', newToken: newATP });
                return newATP;
              },

              logout: () => dispatch({ type: 'logout' }),
            }
          : {
              isLoggedIn: false,
              isLoading,
              login: async (type, email, password) => {
                const { access_token, refresh_token } = (
                  await axios.post<LoginResponseDto>(
                    `/auth/${type}/login`,
                    {
                      email,
                      password,
                    } satisfies LoginRequestDto,
                    {
                      baseURL: API_BASE,
                    }
                  )
                ).data;
                console.log({
                  accessToken: access_token,
                  refreshToken: refresh_token,
                });
                dispatch({
                  type: 'completeLogin',
                  data: {
                    accessToken: Promise.resolve(access_token),
                    refreshToken: refresh_token,
                  },
                });
              },
            }
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
