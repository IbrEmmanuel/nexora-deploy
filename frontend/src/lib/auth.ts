import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // API_URL is server-side only; NEXT_PUBLIC_API_URL is the fallback
          const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const json = await res.json();
          // Backend wraps responses in { success, data: { user, accessToken, ... } }
          const payload = json.data ?? json;
          return payload.user
            ? {
                id: payload.user.id,
                email: payload.user.email,
                name: payload.user.displayName,
                image: payload.user.avatarUrl,
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
                role: payload.user.role,
                organizationId: payload.user.organizationId,
              }
            : null;
        } catch {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.organizationId = (user as any).organizationId;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }

      // OAuth sign in
      if (account?.provider === 'google' || account?.provider === 'github') {
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.role = token.role;
        session.organizationId = token.organizationId;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding',
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: false,
};
