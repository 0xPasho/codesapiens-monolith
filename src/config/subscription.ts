import { SubscriptionPlan } from "types";
import { env } from "~/env.mjs";

export const freePlan: SubscriptionPlan = {
  name: "free",
  description: "The free plan",
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "pro",
  description: "The PRO plan",
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID ?? "",
};

export const maxPlan: SubscriptionPlan = {
  name: "max",
  description: "The MAX plan",
  stripePriceId: env.STRIPE_MAX_MONTHLY_PLAN_ID ?? "",
};
