import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
 
export default clerkMiddleware((auth, request) => {
  // Allow public routes
  const publicPaths = ["/", "/sign-in", "/sign-up"];
  const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  // Continue with auth flow
  return NextResponse.next();
});
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
