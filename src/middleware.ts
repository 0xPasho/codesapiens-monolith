import { NextRequest, NextResponse } from "next/server";
import { env } from "./env.mjs";

async function middleware(request: NextRequest) {
  // We can't import next-auth here because it's not available in the serverless environment
  // and it was causing issues, so we rely on the cookie directly
  const sessionToken = request.cookies.get("next-auth.session-token");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  console.log({ isAuthPage, sessionToken });
  if (!sessionToken) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    console.log({ from });

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
    console.log({ fromv2: fromParam });
    if (fromParam) {
      return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}${fromParam}`);
    }
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard`);
  }

  console.log({ passed: request.nextUrl.pathname });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export default middleware;

export const config = {
  matcher: [
    // "/dashboard",
    "/org/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
