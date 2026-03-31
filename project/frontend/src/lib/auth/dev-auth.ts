import { api } from './api';
import type { AuthUser } from './types';

export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * Dev impersonation state is persisted in sessionStorage so it survives
 * client-side navigation that would otherwise strip ?_user= from the URL.
 * The URL is the entry point (deep-link with ?_user=...), sessionStorage
 * is the source of truth once captured.
 */

export function getDevUser(): string | null {
  const params = new URLSearchParams(window.location.search);
  const urlUser = params.get('_user');
  if (urlUser) {
    sessionStorage.setItem('_dev_user', urlUser);
    sessionStorage.setItem('_dev_role', params.get('_role') ?? 'member');
    return urlUser;
  }
  return sessionStorage.getItem('_dev_user');
}

export function getDevRole(): string {
  const params = new URLSearchParams(window.location.search);
  const urlRole = params.get('_role');
  if (urlRole) return urlRole;
  return sessionStorage.getItem('_dev_role') ?? 'member';
}

export function clearDevUser() {
  sessionStorage.removeItem('_dev_user');
  sessionStorage.removeItem('_dev_role');
}

export function switchDevUser(email: string, role: string = 'member') {
  sessionStorage.setItem('_dev_user', email);
  sessionStorage.setItem('_dev_role', role);
  // Keep the URL in sync for deep-link sharing, but sessionStorage is
  // the source of truth — navigation that strips the URL won't log out.
  const url = new URL(window.location.href);
  url.searchParams.set('_user', email);
  url.searchParams.set('_role', role);
  const sanitized = url.toString();
  if (new URL(sanitized).origin !== window.location.origin) return;
  window.location.assign(sanitized);
}

interface DevUserResponse {
  id: number;
  email: string;
  displayName: string | null;
}

export async function listDevUsers(): Promise<AuthUser[]> {
  const raw = await api.get<DevUserResponse[]>('/api/auth/dev/users');
  return raw.map((u) => ({
    id: String(u.id),
    email: u.email,
    displayName: u.displayName ?? undefined,
    role: 'member',
  }));
}
