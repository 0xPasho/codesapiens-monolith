import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const GetManualRepositoriesByProject = z.object({
  projectId: z.string(),
});

const GetRepositoriesByProjectSlug = z.object({
  projectSlug: z.string(),
});

const GetRepositoryDocumentsCountInput = z.object({
  repositoryId: z.string(),
});

export const repositoriesRouter = createTRPCRouter({
  getManualRepositoriesByProject: protectedProcedure
    .input(GetManualRepositoriesByProject)
    .query(({ ctx, input }) => {
      console.log("input", input);
      console.log("input", input);
      return ctx.db.repository.findMany({
        where: {
          projectId: input.projectId,
          repositoryType: "manual",
        },
      });
    }),
  getRepositoriesByProjectSlug: protectedProcedure
    .input(GetRepositoriesByProjectSlug)
    .query(({ ctx, input }) => {
      return ctx.db.repository.findMany({
        where: {
          project: {
            slug: input.projectSlug,
          },
        },
      });
    }),
  getRepositoryDocumentsCount: protectedProcedure
    .input(GetRepositoryDocumentsCountInput)
    .query(({ ctx, input }) => {
      return ctx.db.document.count({
        where: {
          repositoryId: input.repositoryId,
        },
      });
    }),
});
