'use client';

import { useSession } from 'next-auth/react';

/**
 * Returns the access token only when the session is fully authenticated.
 * Returns undefined while loading or unauthenticated — prevents 401s from
 * firing before NextAuth has resolved the session on the client.
 */
export function useAuthToken(): { token: string | undefined; ready: boolean } {
  const { data: session, status } = useSession();
  const ready = status === 'authenticated';
  const token = ready ? session?.accessToken : undefined;
  return { token, ready };
}
