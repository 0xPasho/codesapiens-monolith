import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const UpdateUserFullNameInput = z.object({
  name: z.string(),
});

const UpdateUserUsernameInput = z.object({
  slug: z.string(),
});

function delay(t) {
  return new Promise((resolve) => setTimeout(resolve, t));
}
export const usersRouter = createTRPCRouter({
  updateUserFullName: protectedProcedure
    .input(UpdateUserFullNameInput)
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      if (!currentUser.organizationId) {
        throw new Error("Default organization not found");
      }

      const updatedUser = await ctx.db.organization.update({
        data: {
          name: input.name,
        },
        where: {
          id: currentUser?.organizationId,
        },
      });

      return updatedUser;
    }),
  updateUserUsername: protectedProcedure
    .input(UpdateUserUsernameInput)
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      if (!currentUser.organizationId) {
        throw new Error("Default organization not found");
      }

      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.slug.toLocaleLowerCase(),
        },
      });

      if (orgFound && orgFound.id !== currentUser.organizationId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const updatedUser = await ctx.db.organization.update({
        data: {
          slug: input.slug.toLocaleLowerCase(),
        },
        where: {
          id: currentUser.organizationId,
        },
      });

      return updatedUser;
    }),
  getAuthenticatedUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        defaultOrganization: true,
      },
    });
  }),
});
