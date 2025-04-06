export interface RegistrationRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  university: string;
  faculty: string;
  course: number;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ItemResponseAuthToken {
  data: AuthToken;
  status: number;
  message?: string;
}

export interface AuthToken {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  tokenType: string;
}
