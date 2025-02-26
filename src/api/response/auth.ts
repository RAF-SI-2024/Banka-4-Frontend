/** `POST /auth/refresh-token` response body.  */
export interface RefreshTokenResponseDto {
  access_token: string;
}

/** `POST /auth/login` response body.  */
export interface LoginResponseDto {
  access_token: string;
  refresh_token: string;
}
