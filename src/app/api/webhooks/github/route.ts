import { headers } from "next/headers";
import Stripe from "stripe";
import crypto from "crypto";

import { env } from "~/env.mjs";
import { stripe } from "@/lib/stripe";
import { db } from "~/server/db";
import { customPlan, freePlan, maxPlan, proPlan } from "~/config/subscription";
import { OrganizationPlan } from "@prisma/client";
import { SubscriptionPlan } from "types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

function verifyGitHubSignature(req: NextRequest) {
  const signature = headers().get("x-hub-signature-256") as string;

  const payload = JSON.stringify(req.body);
  const computedSignature = `sha256=${crypto
    .createHmac("sha256", env.GITHUB_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature),
  );
}

export async function POST(req: NextRequest) {
  if (!verifyGitHubSignature(req)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const body: any = await req.json();
  const { action, installation } = body;

  if (action === "created" || action === "new_permissions_accepted") {
    const installationId = installation.id;
    const githubUserId = installation.account.id; // This assumes you store GitHub user ids in your database.

    // Store or update installationId in your database using Prisma:
    await db.user.update({
      where: { id: session.user.id },
      data: {
        githubInstallationId: installationId,
        githubUserId: githubUserId,
      },
    });
    return {
      status: 200,
      body: "Successfully updated installation id.",
    };
  } else {
    return { status: 200, body: "Nothing to do." };
  }
}
