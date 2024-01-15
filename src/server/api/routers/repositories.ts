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

const AddMoreRepositories = z.object({
  repositories: z.array(z.any()),
  projectSlug: z.string(),
});

export const repositoriesRouter = createTRPCRouter({
  getManualRepositoriesByProject: protectedProcedure
    .input(GetManualRepositoriesByProject)
    .query(({ ctx, input }) => {
      return ctx.db.repository.findMany({
        where: {
          projectId: input.projectId,
          repositoryType: "manual",
        },
      });
    }),
  getRepositoriesByProjectSlug: protectedProcedure
    .input(GetRepositoriesByProjectSlug)
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.repository.findMany({
        where: {
          project: {
            slug: input.projectSlug,
          },
        },
        include: {
          syncs: true,
          documents: true,
          processes: true,
        },
      });
      const finalResult = [];
      for (const repo of results) {
        const document = repo.documents.find(
          (doc) => !doc.parentId && !doc.isFolder,
        );

        finalResult.push({
          ...repo,
          document: [],
          documentQuantity: repo.documents.length,
          syncs: [],
          defaultDocument: document,
          latestProcess: repo.processes?.[0],
        });
      }
      return finalResult;
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
  addMoreRepositories: protectedProcedure
    .input(AddMoreRepositories)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirstOrThrow({
        where: {
          slug: input.projectSlug,
        },
      });

      for (const tempRepo of input.repositories) {
        const foundRepo = await ctx.db.repository.findFirst({
          where: {
            repoOrganizationName: tempRepo.org,
            repoProjectName: tempRepo.repo,
            repositoryType: "github",
            projectId: project.id,
          },
        });

        // if this is already inserted, ignore it....
        if (foundRepo) {
          continue;
        }

        const repo = await ctx.db.repository.create({
          data: {
            repoUrl: tempRepo.url,
            repoProjectName: tempRepo.repo,
            projectId: project.id,
            repoBranchName: tempRepo.branch,
            repoDescription: tempRepo.repoDescription,
            repoOrganizationName: tempRepo.org,
            repositoryType: "github",
            title: tempRepo.repo,
            repoGithubIsPublic: tempRepo.repoGithubIsPublic,
          },
        });

        if (!repo) {
          console.log({ error: "Error creating a repo" });
        }
      }

      return { success: true };
    }),
});
