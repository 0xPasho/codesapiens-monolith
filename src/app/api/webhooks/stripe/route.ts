import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "~/env.mjs";
import { stripe } from "@/lib/stripe";
import { db } from "~/server/db";
import { customPlan, freePlan, maxPlan, proPlan } from "~/config/subscription";
import { OrganizationPlan } from "@prisma/client";
import { SubscriptionPlan } from "types";
import { NextRequest } from "next/server";

const getDataByPriceId = (priceId: string): SubscriptionPlan => {
  if (priceId === proPlan.stripePriceId) {
    return proPlan;
  } else if (priceId === maxPlan.stripePriceId) {
    return maxPlan;
  } else if (priceId) {
    return customPlan;
  }
  return freePlan;
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response(`Webhook Error: ${error?.message || "Unknown error"}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    if (!subscription?.items.data[0]) {
      return new Response("No data from subscription", { status: 500 });
    }
    const priceId = subscription.items.data[0].price.id;
    let currPlan = getDataByPriceId(priceId);

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await db.organization.update({
      where: {
        id: session?.metadata?.organizationId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        currentPlan: currPlan.name as OrganizationPlan,
        planMaxProcessedFiles: currPlan.maxFilesProcessed,
        planMaxSeats: currPlan.maxSeats,
        planMaxQuestions: currPlan.maxQuestions,
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    if (!subscription?.items.data[0]) {
      return new Response("No data from subscription", { status: 500 });
    }

    const priceId = subscription.items.data[0].price.id;
    let currPlan = getDataByPriceId(priceId);

    // Update the price id and set the new period end.
    await db.organization.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        currentPlan: currPlan.name as OrganizationPlan,
        planMaxProcessedFiles: currPlan.maxFilesProcessed,
        planMaxSeats: currPlan.maxSeats,
        planMaxQuestions: currPlan.maxQuestions,
      },
    });
  }

  return new Response(null, { status: 200 });
}
