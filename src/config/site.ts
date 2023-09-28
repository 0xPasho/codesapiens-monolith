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

const twitterUsername = "olyvialabs";
export const siteConfig: SiteConfig = {
  name: "codesapiens.ai",
  description: "We understand the code for you with AI.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  username: {
    twitter: twitterUsername,
  },
  links: {
    twitter: "https://twitter.com/" + twitterUsername,
  },
};
