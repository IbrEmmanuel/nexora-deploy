'use client';

import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApi() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const get = useCallback(
    async <T>(path: string): Promise<T> => {
      const res = await fetch(`${API_URL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
      const json = await res.json();
      return (json.data ?? json) as T;
    },
    [token],
  );

  const post = useCallback(
    async <T>(path: string, body: unknown): Promise<T> => {
      const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
      const json = await res.json();
      return (json.data ?? json) as T;
    },
    [token],
  );

  return { get, post };
}
