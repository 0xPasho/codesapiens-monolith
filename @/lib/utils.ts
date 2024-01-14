import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env.mjs";

export type StripeSuccessUrlType = "organization" | "personal";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateSlugPattern(input: string) {
  const pattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return pattern.test(input) && !input.startsWith("-") && !input.endsWith("-");
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function stripeSuccessUrl({
  orgSlug,
  type,
}: {
  type: StripeSuccessUrlType;
  orgSlug?: string;
}) {
  const path =
    type === "organization"
      ? `/org/${orgSlug}/settings/billing`
      : "/account/billing";
  return absoluteUrl(path);
}

export function stripeFailUrl(data: {
  type: StripeSuccessUrlType;
  orgSlug?: string;
}) {
  return stripeSuccessUrl(data) + "?st=fail";
}
