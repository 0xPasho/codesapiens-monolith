import { NextRequest, NextResponse } from "next/server";
import { env } from "./env.mjs";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

async function middleware(request: NextRequest) {
  // We can't import next-auth here because it's not available in the serverless environment
  // and it was causing issues, so we rely on the cookie directly
  //const sessionToken = request.cookies.get("next-auth.session-token");
  const token = await getToken({
    req: request,
    secret: process.NEXTAUTH_SECRET!,
  });
  console.log({ token });
  console.log({ token });
  console.log({ token });
  console.log({ header: request.headers });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  console.log({ token });
  console.log({ token });
  if (!token) {
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

// export default middleware;
export default withAuth(
  middleware,
  {
    callbacks: {
      async authorized({ req, token }) {
        // let expectedToken = await getToken({
        //   req,
        //   secret: process.NEXTAUTH_SECRET!,
        // });

        // console.log({ expectedToken });
        // console.log({ expectedToken });
        // console.log({ expectedToken });

        // expectedToken.expectedToken = await getToken({
        //   req,
        //   secret: "5w7LkPh6uU5mpj4t",
        // });
        // console.log("cookies");
        // console.log(req.cookies);
        // console.log(req.cookies);
        // console.log(req.cookies);
        // const tokenValue = req.cookies.get("next-auth.session-token")?.value;
        // const tokenInSession: any = tokenValue
        //   ? jwtDecode(tokenValue || "{}")
        //   : new Object();
        // console.log({ tokenValue, tokenInSession });
        // console.log({ tokenValue, tokenInSession });
        // console.log({ tokenValue, tokenInSession });
        // console.log(tokenInSession);
        return true;
      },
    },
  },
  //middleware,
  // {
  //   callbacks: {
  //     async authorized() {
  //       // This is a work-around for handling redirect on auth pages.
  //       // We return true here so that the middleware function above
  //       // is always called.
  //       return true;
  //     },
  //   },
  // }
);

export const config = {
  matcher: [
    "/dashboard",
    "/org/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
