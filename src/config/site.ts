import { env } from "~/env.mjs";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  username: {
    twitter: string;
  };
  links: {
    twitter: string;
  };
};

const twitterUsername = "codesapiens_ai";
export const siteConfig: SiteConfig = {
  name: "codesapiens.ai",
  description: "We understand your code.  We document it. You ask questions.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/logo.png`,
  username: {
    twitter: twitterUsername,
  },
  links: {
    twitter: "https://twitter.com/" + twitterUsername,
  },
};
