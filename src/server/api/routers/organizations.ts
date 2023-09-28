import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const CreateOrganizationInput = z.object({
  name: z.string(),
  slug: z.string(),
});

export const organizationsRouter = createTRPCRouter({
  getAllOrganizationsByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.organizationMember.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        organization: true,
        user: true,
      },
    });
  }),
  create: protectedProcedure
    .input(CreateOrganizationInput)
    .mutation(async ({ ctx, input }) => {
      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.slug.toLocaleLowerCase(),
        },
      });

      if (orgFound) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Organization already exists",
        });
      }

      const newProject = await ctx.db.organization.create({
        data: {
          name: input.name,
          slug: input.slug.toLocaleLowerCase(),
        },
      });

      await ctx.db.organizationMember.create({
        data: {
          organizationId: newProject.id,
          userId: ctx.session.user.id,
          role: "owner",
        },
      });

      return newProject;
    }),
});
