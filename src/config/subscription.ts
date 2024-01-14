import { SubscriptionPlan } from "types";
import { env } from "~/env.mjs";

export const freePlan: SubscriptionPlan = {
  name: "free",
  description: "The free plan",
  maxSeats: 1,
  maxQuestions: 5,
  maxFilesProcessed: 0,
  stripePriceId: "",
  seatsPriceId: "",
  filesPriceId: "",
  questionsPriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "pro",
  description: "The PRO plan",
  maxSeats: 3,
  maxQuestions: 750,
  maxFilesProcessed: 1500,
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
  seatsPriceId: env.STRIPE_PRO_SEATS_MONTHLY_PLAN_ID || "",
  filesPriceId: env.STRIPE_PRO_FILES_MONTHLY_PLAN_ID || "",
  questionsPriceId: env.STRIPE_PRO_QUESTIONS_MONTHLY_PLAN_ID || "",
};

export const maxPlan: SubscriptionPlan = {
  name: "max",
  description: "The MAX plan",
  maxSeats: 10,
  maxQuestions: 2500,
  maxFilesProcessed: 5000,
  stripePriceId: env.STRIPE_MAX_MONTHLY_PLAN_ID || "",
  seatsPriceId: env.STRIPE_MAX_SEATS_MONTHLY_PLAN_ID || "",
  filesPriceId: env.STRIPE_MAX_FILES_MONTHLY_PLAN_ID || "",
  questionsPriceId: env.STRIPE_MAX_QUESTIONS_MONTHLY_PLAN_ID || "",
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
