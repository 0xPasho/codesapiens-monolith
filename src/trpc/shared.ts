import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { env } from "~/env.mjs";

import { type AppRouter } from "~/server/api/root";

export const transformer = superjson;

function getBaseUrl() {
  if (process.env.NODE_ENV !== "production") {
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  }
  return env.NEXT_PUBLIC_APP_URL; //process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc";
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
