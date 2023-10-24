import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { env } from "./env.mjs";

async function middleware(request: NextRequest) {
  const requestForNextAuth = {
    headers: {
      cookie: request.headers.get("cookie"),
    },
  };

  const session = await getSession({ req: requestForNextAuth });

  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  console.log({ rivh: request.nextUrl.pathname });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  console.log({ isAuthPage });
  console.log({ isAuthPage });
  console.log({ isAuthPage });

  if (!session) {
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
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard`);
  }

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
    "/dashboard",
    "/org/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
