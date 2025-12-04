import { NextRequest, NextResponse } from "next/server";

// Allowed redirect paths/patterns
const ALLOWED_REDIRECT_PATTERNS = [
  /^\/dashboard(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/campaigns(\/.*)?$/,
  /^\/admin(\/.*)?$/,
  /^\/creator(\/.*)?$/,
  /^\/$/,
];

function isValidRedirect(path: string): boolean {
  // Must be a relative path
  if (!path.startsWith("/")) return false;

  // Prevent protocol-relative URLs
  if (path.startsWith("//")) return false;

  // Check against allowed patterns
  return ALLOWED_REDIRECT_PATTERNS.some((pattern) => pattern.test(path));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get("redirect");

  // Validate and sanitize redirect
  let finalRedirect = "/dashboard"; // Safe default

  if (redirectTo && isValidRedirect(redirectTo)) {
    finalRedirect = redirectTo;
  }

  return NextResponse.redirect(new URL(finalRedirect, request.url));
}
