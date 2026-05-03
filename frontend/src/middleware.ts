import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // If authenticated but no accessToken in token, let it through —
    // the page-level components handle the stale-session UX
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  },
);

// Protect all dashboard routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ai-agents/:path*',
    '/automation/:path*',
    '/analytics/:path*',
    '/billing/:path*',
    '/energy/:path*',
    '/financial/:path*',
    '/integrations/:path*',
    '/investors/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/team/:path*',
    '/onboarding/:path*',
  ],
};
