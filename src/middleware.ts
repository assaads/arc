import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  async afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL('/sign-in', req.url));
    }

    // If the user is logged in and trying to access admin routes
    if (auth.userId && req.nextUrl.pathname.startsWith('/dashboard')) {
      const user = await clerkClient.users.getUser(auth.userId);
      const isAdmin = user?.publicMetadata?.role === 'admin';

      if (!isAdmin) {
        return Response.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
