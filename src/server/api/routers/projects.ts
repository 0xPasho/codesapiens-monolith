import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const GetAllProjectsByOrg = z.object({
  organizationId: z.string(),
});

const GetAllProjectsBySlug = z.object({
  slug: z.string(),
});

const CreateProjectInput = z.object({
  organizationSlug: z.string(),
  newProjectSlug: z.string(),
  repositories: z.array(z.any()),
  description: z.string(),
});

const UpdateProjectSlugInput = z.object({
  slug: z.string(),
  orgSlug: z.string(),
  projectSlug: z.string(),
});

const UpdateProjectDescriptionInput = z.object({
  description: z.string(),
  orgSlug: z.string(),
  projectSlug: z.string(),
});

const GetProjectBySlugsInput = z.object({
  orgSlug: z.string(),
  projectSlug: z.string(),
});

const GetProjectChatInput = z.object({
  orgSlug: z.string(),
  projectSlug: z.string(),
});

export const projectsRouter = createTRPCRouter({
  getAllProjectsByOrg: protectedProcedure
    .input(GetAllProjectsByOrg)
    .query(({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: {
          organizationId: input.organizationId,
        },
        include: {
          organization: true,
        },
      });
    }),

  getProjectBySlugs: protectedProcedure
    .input(GetProjectBySlugsInput)
    .query(({ ctx, input }) => {
      return ctx.db.project.findFirst({
        where: {
          organization: {
            slug: input.orgSlug,
          },
          slug: input.projectSlug,
        },
        include: {
          organization: true,
        },
      });
    }),
  getAllProjectsBySlug: protectedProcedure
    .input(GetAllProjectsBySlug)
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findFirst({
        where: {
          slug: input.slug,
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      return ctx.db.project.findMany({
        where: {
          organizationId: org.id,
        },
        include: {
          organization: true,
        },
      });
    }),
  create: protectedProcedure
    .input(CreateProjectInput)
    .mutation(async ({ ctx, input }) => {
      // @TODO: it should only apply per org, not in general
      const projectFound = await ctx.db.project.findFirst({
        where: {
          slug: input.newProjectSlug.toLocaleLowerCase(),
        },
      });

      if (projectFound) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Project already exists with this slug",
        });
      }

      const organizationFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.organizationSlug.toLocaleLowerCase(),
        },
      });

      if (!organizationFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const newProject = await ctx.db.project.create({
        data: {
          slug: input.newProjectSlug.toLocaleLowerCase(),
          organizationId: organizationFound.id,
        },
      });
      for (const tempRepo of input.repositories) {
        const repo = await ctx.db.repository.create({
          data: {
            repoUrl: tempRepo.url,
            repoProjectName: tempRepo.repo,
            projectId: newProject.id,
            repoBranchName: tempRepo.branch,
            repoOrganizationName: tempRepo.org,
            repositoryType: "github",
            title: tempRepo.repo,
          },
        });

        if (!repo) {
          console.log({ error: "Error creating a repo" });
        }
      }

      const defaultRepo = await ctx.db.repository.create({
        data: {
          title: "Default repository",
          repositoryType: "manual",
          projectId: newProject.id,
          isDefault: true,
        },
      });

      if (!defaultRepo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create default repository",
        });
      }

      return newProject;
    }),
  updateProjectSlug: protectedProcedure
    .input(UpdateProjectSlugInput)
    .mutation(async ({ ctx, input }) => {
      const projectWithSlug = await ctx.db.project.findFirst({
        where: {
          slug: input.slug.toLocaleLowerCase(),
          organization: {
            slug: input.orgSlug.toLocaleLowerCase(),
          },
        },
      });

      if (projectWithSlug) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Project already exists with this slug",
        });
      }

      const projectFound = await ctx.db.project.findFirst({
        where: {
          slug: input.projectSlug.toLocaleLowerCase(),
          organization: {
            slug: input.orgSlug.toLocaleLowerCase(),
          },
        },
      });

      if (!projectFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const updatedProject = await ctx.db.project.update({
        where: {
          id: projectFound.id,
        },
        data: {
          slug: input.slug.toLocaleLowerCase(),
        },
      });

      return updatedProject;
    }),
  updateProjectDescription: protectedProcedure
    .input(UpdateProjectDescriptionInput)
    .mutation(async ({ ctx, input }) => {
      const projectFound = await ctx.db.project.findFirst({
        where: {
          slug: input.projectSlug.toLocaleLowerCase(),
          organization: {
            slug: input.orgSlug.toLocaleLowerCase(),
          },
        },
      });

      if (!projectFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const updatedProject = await ctx.db.project.update({
        where: {
          id: projectFound.id,
        },
        data: {
          desc: input.description,
        },
      });

      return updatedProject;
    }),
  getProjectChat: protectedProcedure
    .input(GetProjectChatInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findFirst({
        where: {
          slug: input.projectSlug,
          organization: {
            slug: input.orgSlug,
          },
        },
        include: {
          processes: true,
        },
      });
    }),
});
