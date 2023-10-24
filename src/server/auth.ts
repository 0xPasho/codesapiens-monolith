import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { Client } from "postmark";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { siteConfig } from "~/config/site";

const postmarkClient = new Client(env.POSTMARK_API_TOKEN);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user, token }) => {
      try {
        const userInformation = await fetch(
          `${env.NEXT_PUBLIC_APP_URL}/api/org-initializator`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          },
        ).then((res) => res.json());

        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            organizationId: userInformation.organizationId,
            orgSlug: userInformation.orgSlug,
          },
        };
      } catch (err) {
        // Whenever we throw, the site will mark the next request as UNAUTHORIZED
        // So it's safe...
        throw err;
      }
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          id: user.id,
          //@ts-ignore
          role: user?.role,
          //@ts-ignore
          name: user?.fullName,
          //@ts-ignore
          picture: user?.avatar,
        };

        return token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const templateId = env.POSTMARK_SIGN_IN_TEMPLATE;

        if (!templateId) {
          throw new Error("Missing template id");
        }

        const result = await postmarkClient.sendEmailWithTemplate({
          TemplateId: parseInt(templateId),
          To: identifier,
          From: "b@bixdy.com", //,provider.from as string,
          TemplateModel: {
            product_name: siteConfig.name,
            action_url: url,
            name: identifier,
            support_email: "b@bixdy.com",
          },
          Headers: [
            {
              // Set this to prevent Gmail from threading emails.
              // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
              Name: "X-Entity-Ref-ID",
              Value: new Date().getTime() + "",
            },
          ],
        });

        if (result.ErrorCode) {
          throw new Error(result.Message);
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
