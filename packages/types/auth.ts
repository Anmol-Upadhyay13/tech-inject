export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isPremium: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isPremium: boolean;
}

export interface AuthResponse {
  user: SessionUser;
  token: string;
}

export interface PremiumGrant {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  grantedBy: string;
  adminName?: string;
  status: 'active' | 'revoked';
  grantedAt: string;
  revokedAt?: string | null;
}
