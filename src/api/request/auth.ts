/** `POST /auth/refresh-token` body.  */
export interface RefreshTokenDto {
  refreshToken: string;
}

/** `POST /auth/login` request body.  */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** `POST /auth/verify` body.  */
export interface VerifyPasswordRequest {
  verificationCode: string;
  password: string;
}
