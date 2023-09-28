import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const UpdateUserFullNameInput = z.object({
  name: z.string(),
});
export const usersRouter = createTRPCRouter({
  updateUserFullName: protectedProcedure
    .input(UpdateUserFullNameInput)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        data: {
          name: input.name,
        },
        where: {
          id: ctx.session.user.id,
        },
      });

      return updatedUser;
    }),
});
