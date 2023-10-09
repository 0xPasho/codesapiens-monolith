// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { freePlan, maxPlan, proPlan } from "~/config/subscription";
import { api } from "~/trpc/server";

export async function getOrgSubscriptionPlan(orgId: string) {
  const billing = await api.billing.getBillingInformation.query({ orgId });

  if (!billing) {
    throw new Error("Org not found");
  }

  // Check if user is in plan.
  const isInPlan =
    billing.stripePriceId &&
    billing.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now();

  let userPlan = freePlan;

  if (isInPlan) {
    if (billing.currentPlan === "pro") {
      userPlan = proPlan;
    } else if (billing.currentPlan === "max") {
      userPlan = maxPlan;
    }
  }

  return {
    plan: userPlan,
    billing,
    isInPlan,
    stripeCurrentPeriodEnd: billing.stripeCurrentPeriodEnd?.getTime(),
  };
}
