import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const GetManualRepositoriesByProject = z.object({
  projectId: z.string(),
});

const GetRepositoriesByProjectSlug = z.object({
  projectSlug: z.string(),
});

const GetRepositoryInput = z.object({
  repositoryId: z.string(),
});

const GetRepositoryDocumentsCountInput = z.object({
  repositoryId: z.string(),
});

const AddMoreRepositories = z.object({
  repositories: z.array(z.any()), // Consider defining a stricter schema for repository objects
  projectSlug: z.string(),
});

export const repositoriesRouter = createTRPCRouter({
  getManualRepositoriesByProject: protectedProcedure
    .input(GetManualRepositoriesByProject)
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirstOrThrow({
        where: { id: input.projectId },
        include: {
          repositories: {
            include: {
              repository: true,
            },
          },
        },
      });

      return project.repositories.filter((repo) => {
        return repo.repository.repositoryType === "manual";
      });
    }),
  getRepository: protectedProcedure
    .input(GetRepositoryInput)
    .query(async ({ ctx, input }) => {
      const repo = await ctx.db.repository.findFirstOrThrow({
        where: { id: input.repositoryId },
      });

      return repo;
    }),
  getRepositoriesByProjectSlug: protectedProcedure
    .input(GetRepositoriesByProjectSlug)
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirstOrThrow({
        where: { slug: input.projectSlug },
        include: {
          repositories: {
            include: {
              repository: {
                include: {
                  syncs: true,
                  documents: true,
                  processes: true,
                },
              },
            },
          },
        },
      });

      const finalResult = project.repositories.map((projectRepository) => {
        const repo = projectRepository.repository;
        const document = repo.documents.find(
          (doc) => !doc.parentId && !doc.isFolder,
        );
        return {
          ...repo,
          document: [],
          documentQuantity: repo.documents.length,
          syncs: [],
          defaultDocument: document,
          latestProcess: repo.processes?.[0],
        };
      });

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
        // Check if the repository already exists
        let repo = await ctx.db.repository.findFirst({
          where: {
            repoOrganizationName: tempRepo.org,
            repoProjectName: tempRepo.repo,
            repositoryType: "github",
          },
        });

        // If the repository does not exist, create it
        if (!repo) {
          repo = await ctx.db.repository.create({
            data: {
              repoUrl: tempRepo.url,
              repoProjectName: tempRepo.repo,
              repoBranchName: tempRepo.branch,
              repoDescription: tempRepo.repoDescription,
              repoOrganizationName: tempRepo.org,
              repositoryType: "github",
              title: tempRepo.repo,
              repoGithubIsPublic: tempRepo.repoGithubIsPublic,
            },
          });

          if (!repo) {
            console.log({ error: "Skipped because it already exists" });
            continue;
          }
        }

        // Create a new ProjectRepository link if it doesn't exist
        const existingLink = await ctx.db.projectRepository.findFirst({
          where: {
            projectId: project.id,
            repositoryId: repo.id,
          },
        });

        if (!existingLink) {
          await ctx.db.projectRepository.create({
            data: {
              projectId: project.id,
              repositoryId: repo.id,
            },
          });
        }
      }

      return { success: true };
    }),
});
