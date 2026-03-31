const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers);

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // In dev mode: capture _user from URL once, persist via sessionStorage.
  // Survives client-side navigation (<Navigate>, navigate()) which would
  // otherwise strip the query string and break subsequent requests.
  let resolvedUrl = url;
  if (import.meta.env.DEV) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get('_user');
    if (urlUser) {
      sessionStorage.setItem('_dev_user', urlUser);
      sessionStorage.setItem('_dev_role', urlParams.get('_role') ?? 'member');
    }
    const devUser = sessionStorage.getItem('_dev_user');
    if (devUser) {
      const sep = resolvedUrl.includes('?') ? '&' : '?';
      resolvedUrl = `${resolvedUrl}${sep}_user=${encodeURIComponent(devUser)}`;
      const devRole = sessionStorage.getItem('_dev_role');
      if (devRole) resolvedUrl += `&_role=${encodeURIComponent(devRole)}`;
    }
  }

  return fetch(resolvedUrl, { ...options, headers });
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const res = await fetchWithAuth(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
