'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import axios, { Axios, isAxiosError } from 'axios';
import { API_BASE } from '@/lib/utils';

const HttpClientContext = createContext<Axios | undefined>(undefined);

/** Provides access to a stable Axios instance that auto-refreshes tokens.
 *  Also calls the {@link AuthProvider}.
 */
export default function HttpClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();

  const axiosClientState = useMemo(() => {
    /* This Axios instance is effectively a "external" system in React terms.
     * This state is mutable (ew) because we need a single instance to prevent
     * multi-refreshing tokens.
     */
    const client = axios.create({
      baseURL: API_BASE,
    });
    const state = {
      client,
      accessToken: undefined as Promise<string> | undefined,
      refreshToken: undefined as string | undefined,
      invalidateCb: undefined as (() => Promise<string>) | undefined,
      interceptorId: undefined as number | undefined,
    };

    /* Install an interceptor that adds the authorization headers.  */
    client.interceptors.request.use(async (v) => {
      const accessToken = await state.accessToken;
      if (accessToken !== undefined) {
        v.headers.Authorization ??= `Bearer ${accessToken}`;
        const userType = auth.userType ?? sessionStorage.getItem('b4/userType');
        document.cookie = `user_type=${userType}; path=/; max-age=999999`;
      }
      return v;
    });

    /* Refresh + Retry interceptor.  */
    state.interceptorId ??= client.interceptors.response.use(
      (x) => x,
      async (error) => {
        /* Can't refresh, no point.  */
        if (!state.invalidateCb) throw error;
        if (!isAxiosError(error)) throw error;
        /* Request was never sent.  */
        if (!error.response) throw error;
        if (error.response.status !== 401) throw error;
        /* Not a failure we care about.  */
        if (typeof error.response.data !== 'object') throw error;
        if (error.response.data.code !== 'ExpiredJwt') throw error;
        /* Can't retry this one.  */
        if (!error.config) throw error;

        /* Okay, refresh the token.  */
        state.accessToken = state.invalidateCb();
        const newConfig = { ...error.config };
        /* Forces the authorizing interceptor to add a token.  */
        newConfig.headers.Authorization = undefined;
        return client.request(newConfig);
      }
    );

    return state;
  }, []);

  /* Synchronize instance above.  */
  useEffect(() => {
    if (auth.isLoggedIn) {
      axiosClientState.accessToken = auth.accessToken;
      axiosClientState.refreshToken = auth.refreshToken;
      axiosClientState.invalidateCb = auth.refreshAccessToken;
    } else {
      axiosClientState.accessToken =
        axiosClientState.refreshToken =
        axiosClientState.invalidateCb =
          undefined;
    }
  }, [auth, axiosClientState]);

  return (
    <HttpClientContext.Provider value={axiosClientState.client}>
      {children}
    </HttpClientContext.Provider>
  );
}

export function useHttpClient(): Axios {
  const client = useContext(HttpClientContext);
  if (!client)
    throw new Error('useHttpClient must be used within a HttpClientContext');
  return client;
}
