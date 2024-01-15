import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getApp } from "~/server/github";

const GetGithubReposByOrg = z.object({
  // githubOrgSlug: z.string(),
});

export const githubRouter = createTRPCRouter({
  getGithubOrgsByUser: protectedProcedure.query(async ({ ctx }) => {
    const octokitApp = await getApp();
    const currentUser = await ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    const appAuthentication: any = await octokitApp.auth({
      type: "app",
    });
    const installationResponse = await octokitApp.request(
      `GET /app/installations/${currentUser!.githubInstallationId!}`,
      {
        headers: {
          authorization: `Bearer ${appAuthentication.token}`,
          accept: "application/vnd.github.machine-man-preview+json",
        },
      },
    );
    if (!installationResponse.data) {
      throw new Error("Installation not found for the user.");
    }
    console.log({ installationResponseda: installationResponse.data.account });
    console.log({ installationResponseda: installationResponse.data.account });

    const orgOrUser = installationResponse.data.account;

    return [orgOrUser];
  }),
  getGithubReposByOrg: protectedProcedure
    .input(GetGithubReposByOrg)
    .query(async ({ ctx, input }) => {
      const currentUser = await ctx.db.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      const octokitApp = await getApp();
      const appAuthentication: any = await octokitApp.auth({ type: "app" });

      // const appInstallations = await octokitApp.request(
      //   "GET /app/installations",
      //   {
      //     headers: {
      //       authorization: `Bearer ${newappAuthentication.token}`,
      //       accept: "application/vnd.github.machine-man-preview+json",
      //     },
      //   },
      // );
      console.log({ lol: "true" });
      console.log({ lol: "true" });
      console.log({ lol: "true" });
      console.log({ lol: "true" });
      console.log({ lol: "true" });

      const installationResponse = await octokitApp.request(
        `GET /app/installations/${currentUser!.githubInstallationId!}`,
        {
          headers: {
            authorization: `Bearer ${appAuthentication.token}`,
            accept: "application/vnd.github.machine-man-preview+json",
          },
        },
      );

      console.log({ installationResponse });
      console.log({ installationResponse });
      console.log({ installationResponse });
      console.log({ installationResponse });
      console.log({ installationResponse });
      if (!installationResponse) {
        return [];
      }
      //return installationResponse.data.repositories;

      const installationAccessToken: any = await octokitApp.auth({
        type: "installation",
        installationId: currentUser!.githubInstallationId!,
      });

      const octokitInstallation = await getApp(
        parseInt(currentUser!.githubInstallationId!, 10),
      );

      // Use the installation access token to get the repositories
      const repos = await octokitInstallation.request(
        "GET /installation/repositories",
        {
          headers: {
            authorization: `Bearer ${installationAccessToken.token}`,
          },
        },
      );

      return repos.data.repositories;
    }),
});
