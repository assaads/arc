import { clerkMiddleware } from '@clerk/nextjs/server';

// Let Clerk handle all authentication
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?)).*)',
    '/(api|trpc)(.*)'
  ]
};
