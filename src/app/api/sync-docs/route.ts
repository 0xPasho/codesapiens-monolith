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
      // @TODO!
      // organization: {
      //   slug: input.orgSlug
      // },
    },
    include: {
      organization: true,
      repositories: {
        include: {
          repository: {
            include: {
              processes: true,
            },
          },
        },
      },
    },
  });

  console.log({ project });
  console.log({ project });
  console.log({ project });
  console.log({ project });

  // if (!project?.organization?.stripeCustomerId) {
  //   return NextResponse.json({ error: "Needs subscription", status: 403 });
  // }

  let idRepositoriesToSend = [];
  for (let pr of project.repositories) {
    const procceses = pr.repository.processes;
    const hasIncompleteProcesses = procceses.find((item) => !item.endDate);
    if (
      pr.repository.isDefault &&
      pr.repository.repositoryType === "manual" &&
      !hasIncompleteProcesses
    ) {
      idRepositoriesToSend.push(pr.repository.id);
    }

    if (!hasIncompleteProcesses && pr.repository.repositoryType !== "manual") {
      idRepositoriesToSend.push(pr.repository.id);
    }
  }

  const syncApiUrl = `${env.CONVOS_API_URL}/api/v1/embeed-sync`;

  console.log({
    id_user: session.user.id,
    id_repositories: idRepositoriesToSend,
  });

  try {
    const processes = [];
    let json: string;
    // Re-did this to be able to separate each repo call
    // instead of sending all, causing issues handling
    // the workers from python correctly
    for (let repoId of idRepositoriesToSend) {
      const response = await fetch(syncApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-codesapiens-auth": env.CONVOS_CROSS_ORIGIN_SERVICE_SECRET,
        },
        body: JSON.stringify({
          id_user: session.user.id,
          id_repositories: [repoId],
          id_project: project.id,
        }),
      });
      const json = (await response.json()) as any;
      processes.push(json);
    }

    return NextResponse.json({
      processId: json,
      processes,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
