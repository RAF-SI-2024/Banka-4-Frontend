/** `POST /auth/refresh-token` body.  */
export interface RefreshTokenDto {
  refresh_token: string;
}

/** `POST /auth/login` request body.  */
export interface LoginRequestDto {
  email: string;
  password: string;
}
