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
  repoOrgSlug: z.string(),
  organizationSlug: z.string(),
  newProjectSlug: z.string(),
  repoName: z.string(),
  repoUrl: z.string(),
  repoBranchName: z.string(),
  description: z.string(),
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

      const sources = await ctx.db.source.create({
        data: {
          repoUrl: input.repoUrl,
          repoProjectName: input.repoName,
          projectId: newProject.id,
          repoBranchName: input.repoBranchName,
          repoOrganizationName: input.repoOrgSlug,
          sourceType: "github",
        },
      });

      if (!sources) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create source",
        });
      }

      return newProject;
    }),
});
