import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { db } from "~/server/db";
import { env } from "process";

type Payload = {
  projectSlug: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log({ session });
  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const data: Payload = await req.json();
  const projectSlug = data?.projectSlug;

  if (!projectSlug) {
    return new Response(null, { status: 400, statusText: "BAD REQUEST" });
  }

  const project = await db.project.findFirst({
    where: {
      slug: projectSlug,
    },
    include: {
      organization: true,
    },
  });

  if (!project?.organization?.stripeCustomerId) {
    return NextResponse.json({ error: "Needs subscription", status: 403 });
  }

  const repositories = await db.repository.findMany({
    where: {
      project: {
        slug: projectSlug,
      },
      OR: [
        {
          syncs: {
            none: {},
          },
        },
        {
          isDefault: true,
          repositoryType: "manual",
        },
      ],
    },
  });

  const syncApiUrl = `${env.CONVOS_API_URL}/api/v1/embeed-sync`;

  console.log({
    id_user: session.user.id,
    id_repositories: repositories.map((r) => r.id),
  });

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
