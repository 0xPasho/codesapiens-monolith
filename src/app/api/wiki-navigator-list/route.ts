import { NextRequest, NextResponse } from "next/server";
import { api } from "~/trpc/server";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { db } from "~/server/db";

type Payload = {
  projectSlug: string;
  docId: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = await api.users.getAuthenticatedUser.query();

  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const data: Payload = await req.json();
  const projectSlug = data?.projectSlug;
  const docId = data?.docId;

  console.log([projectSlug, docId]);
  console.log({ projectSlug, docId });
  console.log({ projectSlug, docId });
  console.log({ projectSlug, docId });
  console.log({ projectSlug, docId });
  if (!projectSlug || !docId) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }
  const documents = await db.document.findMany({
    where: {
      id: docId,
    },
  });
  console.log({ docs });

  return NextResponse.json({
    documents,
  });
}
