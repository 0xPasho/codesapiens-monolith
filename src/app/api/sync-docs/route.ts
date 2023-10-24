import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { db } from "~/server/db";
import { env } from "process";

type Payload = {
  projectSlug: string;
  repositorySlug?: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const data: Payload = await req.json();
  const repositorySlug = data?.repositorySlug;
  const projectSlug = data?.projectSlug;

  if (!projectSlug) {
    return new Response(null, { status: 400, statusText: "BAD REQUEST" });
  }

  let repositories;
  if (!repositorySlug) {
    repositories = await db.repository.findMany({
      where: {
        project: {
          slug: projectSlug,
        },
      },
    });
    //repositories = [repositories[0]];
  } else {
    const repository = await db.repository.findFirst({
      where: {
        project: {
          slug: projectSlug,
        },
        id: repositorySlug,
      },
    });
    if (!repository) {
      return new Response(null, { status: 404, statusText: "NOT FOUND" });
    }
    repositories = [repository];
  }

  const syncApiUrl = `${env.CONVOS_API_URL}/api/v1/embeed-sync`;

  try {
    const response = await fetch(syncApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-codesapiens-auth": env.CONVOS_CROSS_ORIGIN_SERVICE_SECRET,
      },
      body: JSON.stringify({
        id_user: session.user.id,
        id_repositories: repositories.map((r) => r.id),
      }),
    });

    const json = (await response.json()) as any;

    return NextResponse.json({
      processId: json,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
