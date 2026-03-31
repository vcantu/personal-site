export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
