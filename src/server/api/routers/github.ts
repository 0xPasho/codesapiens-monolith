import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getApp } from "~/server/github";

const GetGithubReposByOrg = z.object({
  githubOrgSlug: z.string(),
});

export const githubRouter = createTRPCRouter({
  getGithubOrgsByUser: protectedProcedure.query(async () => {
    const octokitApp = await getApp();

    const newappAuthentication: any = await octokitApp.auth({ type: "app" });
    const orgsResponse = await octokitApp.request("GET /app/installations", {
      headers: {
        authorization: `Bearer ${newappAuthentication.token}`,
        accept: "application/vnd.github.machine-man-preview+json",
      },
    });
    return orgsResponse.data;
  }),
  getGithubReposByOrg: protectedProcedure
    .input(GetGithubReposByOrg)
    .query(async ({ input }) => {
      const octokitApp = await getApp();
      const newappAuthentication: any = await octokitApp.auth({ type: "app" });

      const appInstallations = await octokitApp.request(
        "GET /app/installations",
        {
          headers: {
            authorization: `Bearer ${newappAuthentication.token}`,
            accept: "application/vnd.github.machine-man-preview+json",
          },
        },
      );

      const installationResponse = appInstallations.data.find(
        (installation: any) =>
          installation.account.login === input.githubOrgSlug,
      );

      if (!installationResponse) {
        return [];
      }

      const installationAccessToken: any = await octokitApp.auth({
        type: "installation",
        installationId: installationResponse.id,
      });

      const octokitInstallation = await getApp(installationResponse.id);

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
