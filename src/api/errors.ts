export type ErrorType = 'RefreshTokenExpired' | 'NotAuthenticated'; // ...

export const apiErrorMessages: Record<ErrorType, string> = {
  RefreshTokenExpired: 'Refresh token has expired',
  NotAuthenticated: 'User is not authenticated',
  // ...
};
