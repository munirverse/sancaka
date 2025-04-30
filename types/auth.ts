export interface User {
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthApiResponse {
  token: string;
  user: {
    username: string;
  };
}

export interface AuthUpdatePayload {
  username?: string;
  password?: string;
  currentPassword?: string;
}
