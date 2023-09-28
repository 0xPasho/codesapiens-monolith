import { SubscriptionPlan } from "types";
import { env } from "~/env.mjs";

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan",
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan",
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID ?? "",
};

export const maxPlan: SubscriptionPlan = {
  name: "MAX",
  description: "The MAX plan",
  stripePriceId: env.STRIPE_MAX_MONTHLY_PLAN_ID ?? "",
};
