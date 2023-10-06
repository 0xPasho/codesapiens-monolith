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
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
});
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      await timeout(5000);
      return ctx.db.project.findMany({
        where: {
          slug: input.slug,
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
          slug: input.slug.toLocaleLowerCase(),
        },
      });

      console.log({ projectFound });

      if (projectFound) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Project already exists with this slug",
        });
      }

      const newProject = await ctx.db.project.create({
        data: {
          name: input.name,
          slug: input.slug.toLocaleLowerCase(),
          organizationId: input.organizationId,
        },
      });

      return newProject;
    }),
});
