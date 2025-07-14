import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes require authentication using a route matcher
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

// Main middleware function to enforce authentication on protected routes
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get the current user's ID (if logged in)

  // If the user is not authenticated and tries to access a protected route, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth(); // Get the sign-in redirect function
    return redirectToSignIn(); // Redirect unauthenticated user to sign-in page
  }

  // Allow the request to proceed if authenticated or not a protected route
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  // The matcher array above ensures that the middleware only runs for application routes and API endpoints,
  // and skips static assets and Next.js internals for performance reasons.
};
