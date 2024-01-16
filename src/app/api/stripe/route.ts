import { getServerSession } from "next-auth/next";

import { stripe } from "@/lib/stripe";
import {
  stripeSuccessUrl,
  stripeFailUrl,
  StripeSuccessUrlType,
} from "@/lib/utils";
import { getOrgSubscriptionPlan } from "@/lib/subscription";
import { maxPlan, proPlan } from "~/config/subscription";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";
import { NextRequest } from "next/server";

const getNextPlan = (planName: string) => {
  // if user is already max, or user is upgrading to pro
  if (planName === "pro" || planName === "max") {
    return maxPlan;
  }
  // for a free plan
  return proPlan;
};

const upgradePlan = async (subscriptionPlan: any) => {
  // const nextPlan = getNextPlan(subscriptionPlan.plan.name);

  // const subscription = await stripe.subscriptions.update(
  //   subscriptionPlan.billing.stripeSubscriptionId!,
  //   {
  //     items: [
  //       {
  //         //id: maxPlan.stripePriceId,
  //         price: nextPlan.stripePriceId,
  //         //price: "{{NEW_PRICE_ID}}",
  //       },
  //     ],
  //   },
  // );

  // return new Response(JSON.stringify({ subscription }));
  // Fetch all subscription items for the given subscription
  const subscriptionItems = await stripe.subscriptionItems.list({
    subscription: subscriptionPlan.billing.stripeSubscriptionId,
  });

  // Find the subscription item with the Pro plan's price ID
  const proSubscriptionItem = subscriptionItems.data.find(
    (item) => item.price.id === proPlan.stripePriceId,
  );

  // If the Pro plan subscription item is found, proceed with updating it to Max plan
  if (proSubscriptionItem) {
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionPlan.billing.stripeSubscriptionId,
      {
        items: [
          {
            id: proSubscriptionItem.id,
            price: maxPlan.stripePriceId,
          },
        ],
      },
    );

    return new Response(JSON.stringify({ subscription: updatedSubscription }));
  } else {
    // Handle the case where the Pro plan subscription item is not found
    throw new Error("Pro plan subscription item not found.");
  }
};

const manageSubscription = async (
  subscriptionPlan: any,
  orgSlug: string,
  isPersonal: boolean,
) => {
  const billingUrl = stripeSuccessUrl({
    type: !isPersonal ? "organization" : "personal",
    orgSlug,
  });

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: subscriptionPlan.billing.stripeCustomerId,
    return_url: billingUrl,
  });

  return new Response(JSON.stringify({ url: stripeSession.url }));
};

const buySubscription = async (
  subscriptionPlan: any,
  orgSlug: string,
  orgId: string,
  isPersonal: boolean,
  userEmail?: string,
) => {
  const nextPlan = getNextPlan(subscriptionPlan.plan.name);
  const billingUrl = stripeSuccessUrl({
    type: !isPersonal ? "organization" : "personal",
    orgSlug,
  });

  const failUrl = stripeFailUrl({
    type: !isPersonal ? "organization" : "personal",
    orgSlug,
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: failUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: !isPersonal ? undefined : userEmail,
    line_items: [
      {
        price: nextPlan.stripePriceId,
        quantity: 1,
      },
      {
        price: nextPlan.questionsPriceId,
      },
      {
        price: nextPlan.filesPriceId,
      },
      {
        price: nextPlan.seatsPriceId,
      },
    ],
    metadata: {
      organizationId: orgId,
      organizationSlug: orgSlug,
      userEmail,
    },
  });
  return new Response(JSON.stringify({ url: stripeSession.url }));
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orgSlug = searchParams.get("orgSlug");
  const from = searchParams.get("from") as StripeSuccessUrlType; // organization || personal
  const downgradeTo = searchParams.get("downgradeTo");
  // what's this for?
  const callIntent = searchParams.get("callIntent"); // 'upgrade' | 'buy_or_manage'
  const session = await getServerSession(authOptions);
  const user = await api.users.getAuthenticatedUser.query();

  if (!(orgSlug && from === "organization") && !session?.user) {
    throw new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }
  let organizationId: string;
  if (from === "organization") {
    const orgFromSlug = await api.organizations.getOrgBySlug.query({ orgSlug });
    organizationId = orgFromSlug?.id;
  } else {
    organizationId = user?.organizationId;
  }

  if (!organizationId) {
    throw new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  try {
    const subscriptionPlan = await getOrgSubscriptionPlan(organizationId);

    if (subscriptionPlan.isInPlan) {
      // only upgrade if it's pro, because there's not other one besides Max
      if (callIntent === "upgrade" && subscriptionPlan.plan.name !== "max") {
        return upgradePlan(subscriptionPlan);
      }
      // else, just manage it...
      return manageSubscription(
        subscriptionPlan,
        orgSlug,
        from !== "organization",
      );
    }

    return buySubscription(
      subscriptionPlan,
      orgSlug,
      organizationId,
      from !== "organization",
      user.email,
    );
  } catch (err) {
    return new Response(null, { status: 500, statusText: "BILLING_URL" });
  }
}
