import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const GetProcessesByProjectInput = z.object({
  projectSlug: z.string(),
});

export const processesRouter = createTRPCRouter({
  getProcessesByProject: protectedProcedure
    .input(GetProcessesByProjectInput)
    .query(async ({ ctx, input }) => {
      return await ctx.db.process.findMany({
        where: {
          project: {
            slug: input.projectSlug,
          },
        },
        include: {
          repository: true,
        },
      });
    }),
});
