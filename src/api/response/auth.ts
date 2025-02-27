/** `POST /auth/refresh-token` response body.  */
export interface RefreshTokenResponseDto {
  accessToken: string;
}

/** `POST /auth/login` response body.  */
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}
