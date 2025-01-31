import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { Role } from './types/clerk';

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  
  // Public routes that don't require authentication
  const isPublicRoute = 
    req.url.includes('/sign-in') || 
    req.url.includes('/sign-up') || 
    req.url.includes('/');

  // Handle users who aren't authenticated
  if (!userId && !isPublicRoute) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect dashboard routes with admin check
  if (isDashboardRoute(req)) {
    const userRole = sessionClaims?.metadata?.role as Role;
    if (userRole !== 'admin') {
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
