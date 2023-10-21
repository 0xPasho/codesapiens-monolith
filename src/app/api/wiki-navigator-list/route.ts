import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { db } from "~/server/db";

type Payload = {
  repositorySlug: string;
  docId: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const data: Payload = await req.json();
  const repositorySlug = data?.repositorySlug;
  const docId = data?.docId;

  if (!repositorySlug || !docId) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const documents = await db.document.findMany({
    where: {
      parentId: docId,
      repositoryId: repositorySlug,
    },
  });

  return NextResponse.json({
    documents,
  });
}
