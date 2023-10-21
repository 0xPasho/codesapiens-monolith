import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { stripe } from "@/lib/stripe";
import { stripeSuccessUrl, stripeFailUrl } from "@/lib/utils";
import { getOrgSubscriptionPlan } from "@/lib/subscription";
import { maxPlan, proPlan } from "~/config/subscription";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const plan = searchParams.get("plan");
  const orgSlug = searchParams.get("orgSlug");
  const from = searchParams.get("from");
  const actionType = searchParams.get("actionType");

  try {
    const session = await getServerSession(authOptions);
    const user = await api.users.getAuthenticatedUser.query();

    if (!session?.user || !session?.user.email || !user?.organizationId) {
      return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
    }

    let orgId = user.organizationId;
    const billingUrl = stripeSuccessUrl({
      type: from === "org" ? "org" : "personal",
      orgSlug: orgSlug ?? "",
    });
    const failUrl = stripeFailUrl({
      type: from === "org" ? "org" : "personal",
      orgSlug: orgSlug ?? "",
    });

    if (from === "org") {
      const org = await api.organizations.getOrgBySlug.query({
        orgSlug: orgSlug!,
      });
      if (!org) {
        return new Response(null, { status: 404, statusText: "ORG_NOT_FOUND" });
      }
      orgId = org.id;
    }

    let subscriptionPlan;
    try {
      subscriptionPlan = await getOrgSubscriptionPlan(orgId);
    } catch (err) {
      return new Response(null, {
        status: 500,
        statusText: "RETRIEVE_SUBSCRIPTION_PLAN",
      });
    }

    if (actionType === "upgrade") {
      const subscription = await stripe.subscriptions.update(
        subscriptionPlan.billing.stripeSubscriptionId!,
        {
          items: [
            {
              //id: maxPlan.stripePriceId,
              price: maxPlan.stripePriceId,
              //price: "{{NEW_PRICE_ID}}",
            },
          ],
        },
      );

      return new Response(JSON.stringify({ subscription }));
    }

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (
      subscriptionPlan.isInPlan &&
      subscriptionPlan.billing.stripeCustomerId
    ) {
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
      const variableItems =
        from === "org"
          ? [
              {
                price: "prod_OmQoxHXXxvJM7w",
                quantity: 1,
              },
            ]
          : [];
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: failUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: from === "org" ? undefined : user.email!,
        line_items: [
          {
            price: "price_1Nys2rJV4VhelRu8KEoQmhrV", //price: planMetadata.stripePriceId,
            quantity: 1,
          },
          {
            price: "price_1NysIRJV4VhelRu80snSjyBS", //price: planMetadata.stripePriceId,
          },
          {
            price: "price_1Nys2HJV4VhelRu8iMAQDJ6C", //price: planMetadata.stripePriceId,
          },
          {
            price: "price_1NysHoJV4VhelRu8Pu0UsHMT", //price: planMetadata.stripePriceId,
          },

          // {
          //   price: "price_1NyriHJV4VhelRu8rzUkeYBd",
          //   quantity: 1,
          // },
          // ...variableItems,
        ],
        metadata: {
          organizationId: orgId,
        },
      });
      return new Response(JSON.stringify({ url: stripeSession.url }));
    } catch (err) {
      console.log({ err });
      return new Response(null, {
        status: 500,
        statusText: "CREATE_CHECKOUT_SESSION",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
