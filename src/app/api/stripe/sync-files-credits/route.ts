import { stripe } from "@/lib/stripe";
import { NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

interface Payload {
  quantity: number;
  orgId: string;
}

export async function POST(req: NextRequest) {
  const data: Payload = await req.json();
  const foundOrg = await db.organization.findFirstOrThrow({
    where: {
      id: data.orgId,
    },
  });

  const items = await stripe.subscriptionItems.list({
    subscription: foundOrg.stripeSubscriptionId,
  });
  let filesItemId: string;
  for (const item of items.data) {
    // we don't care because once we are inside the billing
    // there's only going to be one of them.
    if (
      item.plan.id === env.STRIPE_MAX_FILES_MONTHLY_PLAN_ID ||
      item.plan.id === env.STRIPE_PRO_FILES_MONTHLY_PLAN_ID
    ) {
      filesItemId = item.id;
    }
  }

  if (!filesItemId) {
    throw "Error getting the payment id for files";
  }

  try {
    await stripe.subscriptionItems.createUsageRecord(filesItemId, {
      quantity: data.quantity,
      timestamp: "now",
      action: "increment",
    });

    await db.organization.update({
      where: {
        id: data.orgId,
      },
      data: {
        currentProcessedFiles: foundOrg.currentProcessedFiles + data.quantity,
      },
    });
    return new Response(null, {
      status: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    return new Response(err, {
      status: 500,
      statusText: "ERROR_ON_SAVING_RECORDS",
    });
  }
}
