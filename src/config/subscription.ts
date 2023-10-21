import { SubscriptionPlan } from "types";
import { env } from "~/env.mjs";

export const freePlan: SubscriptionPlan = {
  name: "free",
  description: "The free plan",
  stripePriceId: "",
  maxSeats: 1,
  maxQuestions: 3,
  maxFilesProcessed: 10,
};

export const proPlan: SubscriptionPlan = {
  name: "pro",
  description: "The PRO plan",
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID ?? "",
  maxSeats: 3,
  maxQuestions: 150,
  maxFilesProcessed: 500,
};

export const maxPlan: SubscriptionPlan = {
  name: "max",
  description: "The MAX plan",
  stripePriceId: env.STRIPE_MAX_MONTHLY_PLAN_ID ?? "",
  maxSeats: 10,
  maxQuestions: 3000,
  maxFilesProcessed: 3000,
};

export const customPlan: SubscriptionPlan = {
  name: "custom",
  description: "The CUSTOM plan",
  // for this plan we are not taking it from here
  stripePriceId: "",
  maxSeats: 5,
  maxQuestions: 0,
  maxFilesProcessed: 0,
};
