export interface RefreshTokenResponse {
    data: {
      newCookies:{
        accessToken: string;
        refreshToken: string;
      }
    };
    statusCode: number;
    message: string;
    success: boolean;
  }