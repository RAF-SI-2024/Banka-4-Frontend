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
import { UserType } from '../api/auth';

type LoggedInAuthState = {
  accessToken: Promise<string>;
  refreshToken: string;
  userType: UserType;
};

/** Load a previously-stored authentication state from `sessionStorage`.  */
function loadAuthenticationState(): LoggedInAuthState | undefined {
  const accessToken = sessionStorage.getItem('b4/accessToken');
  const refreshToken = sessionStorage.getItem('b4/refreshToken');
  const userType_ = sessionStorage.getItem('b4/userType');
  if (!(accessToken && refreshToken && userType_)) return undefined;

  const userType: UserType =
    userType_ === ('client' satisfies UserType) ? 'client' : 'employee';

  return {
    accessToken: Promise.resolve(accessToken),
    refreshToken,
    userType,
  };
}

/** Serialize authentication state into `sessionStorage`.  */
async function storeAuthenticationState(state: LoggedInAuthState | undefined) {
  if (!state) {
    sessionStorage.removeItem('b4/userType');
    sessionStorage.removeItem('b4/accessToken');
    sessionStorage.removeItem('b4/refreshToken');
    return;
  }

  try {
    const { accessToken, refreshToken, userType } = state;
    const accessToken_ = await accessToken;
    sessionStorage.setItem('b4/accessToken', accessToken_);
    sessionStorage.setItem('b4/refreshToken', refreshToken);
    sessionStorage.setItem('b4/userType', userType);
  } catch (_err) {
    /*
     * Indicates a failed refresh and save.  The refresh error should be handled
     * elsewhere.  There's no way to recover local to this site, and an attempt
     * at redoing would raise an error again.
     */
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
    /* Fire and forget.  */
    (async () => {
      try {
        if (!oldState) return;
        await axios.post<void>(
          '/auth/logout',
          {
            refreshToken: oldState.refreshToken,
          } satisfies RefreshTokenDto,
          {
            baseURL: API_BASE,
          }
        );
      } catch (_err) {}
    })();
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
        type: UserType,
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
                          refreshToken: captureAuthState.refreshToken,
                        } satisfies RefreshTokenDto,
                        {
                          baseURL: API_BASE,
                        }
                      )
                    ).data.accessToken;
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
              login: async (userType, email, password) => {
                const { accessToken, refreshToken } = (
                  await axios.post<LoginResponseDto>(
                    `/auth/${userType}/login`,
                    {
                      email,
                      password,
                    } satisfies LoginRequestDto,
                    {
                      baseURL: API_BASE,
                    }
                  )
                ).data;
                dispatch({
                  type: 'completeLogin',
                  data: {
                    accessToken: Promise.resolve(accessToken),
                    refreshToken: refreshToken,
                    userType,
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
