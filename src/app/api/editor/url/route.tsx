import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";

async function fetchLinkData(url) {
  const response = await fetch(url);
  const htmlString = await response.text();
  const Cheerio = require("cheerio");
  const $ = Cheerio.load(htmlString);

  const title =
    $('meta[property="og:title"]').attr("content") || $("title").text();
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content");
  const imageUrl = $('meta[property="og:image"]').attr("content");

  return {
    title,
    description,
    image: { url: imageUrl },
  };
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const response = {
    success: 1,
    meta: await fetchLinkData(url),
  };
  try {
    return NextResponse.json(response);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
