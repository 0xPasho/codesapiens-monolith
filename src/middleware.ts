import { NextRequest, NextResponse } from "next/server";
import { env } from "./env.mjs";
import { withAuth } from "next-auth/middleware";

async function middleware(request: NextRequest) {
  // We can't import next-auth here because it's not available in the serverless environment
  // and it was causing issues, so we rely on the cookie directly
  //const sessionToken = request.cookies.get("next-auth.session-token");
  const cookieName = "next-auth.session-token";
  let isAuthenticated = false;
  await request.headers.forEach((value, key) => {
    if (value.includes(cookieName) || key.includes(cookieName)) {
      isAuthenticated = true;
    }
  });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // Layouts need this to work
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (!isAuthenticated) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    const absoluteFrom = `${env.NEXT_PUBLIC_APP_URL}/${from}`;
    if (!isAuthPage) {
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/login?from=${encodeURIComponent(
          absoluteFrom,
        )}`,
      );
    }
  } else if (isAuthPage) {
    const urlSearchParams = new URLSearchParams(request.nextUrl.search);
    const fromParam = urlSearchParams.get("from");
    if (fromParam) {
      return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}${fromParam}`, {
        headers: requestHeaders,
      });
    }
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard`, {
      headers: requestHeaders,
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// export default middleware;
export default withAuth(middleware, {
  callbacks: {
    async authorized() {
      // This is a work-around for handling redirect on auth pages.
      // We return true here so that the middleware function above
      // is always called.
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
});

export const config = {
  matcher: [
    "/dashboard",
    "/org/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
