import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getOrgSubscriptionPlan } from "@/lib/subscription";
import { maxPlan, proPlan } from "~/config/subscription";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";

const billingUrl = absoluteUrl("/account/billing");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan");
  try {
    const session = await getServerSession(authOptions);
    const user = await api.users.getAuthenticatedUser.query();

    if (!session?.user || !session?.user.email || !user?.organizationId) {
      return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
    }
    let subscriptionPlan;
    try {
      subscriptionPlan = await getOrgSubscriptionPlan(user.organizationId);
    } catch (err) {
      return new Response(null, {
        status: 500,
        statusText: "RETRIEVE_SUBSCRIPTION_PLAN",
      });
    }

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (
      subscriptionPlan.isInPlan &&
      subscriptionPlan.billing.stripeCustomerId
    ) {
      console.log({ entered: true });
      try {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: subscriptionPlan.billing.stripeCustomerId,
          return_url: billingUrl,
        });

        return new Response(JSON.stringify({ url: stripeSession.url }));
      } catch (err) {
        return new Response(null, { status: 500, statusText: "BILLING_URL" });
      }
    }
    try {
      // The user is on the free plan.
      // Create a checkout session to upgrade.
      if (!plan) {
        return new Response(null, { status: 400, statusText: "MISSING_PLAN" });
      }
      const planMetadata = plan === "pro" ? proPlan : maxPlan;
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [
          {
            price: planMetadata.stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          organizationId: user.organizationId,
        },
      });
      return new Response(JSON.stringify({ url: stripeSession.url }));
    } catch (err) {
      return new Response(null, {
        status: 500,
        statusText: "CREATE_CHECKOUT_SESSION",
      });
    }
    //return new Response(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
