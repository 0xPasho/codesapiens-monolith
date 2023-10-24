import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const GetBillingInformationInput = z.object({
  orgId: z.string(),
});

const GetUsageGraphInput = z.object({
  orgSlug: z.string(),
});

export const billingRouter = createTRPCRouter({
  getBillingInformation: protectedProcedure
    .input(GetBillingInformationInput)
    .query(({ ctx, input }) => {
      return ctx.db.organization.findFirst({
        where: {
          id: input.orgId,
        },
      });
    }),
  getUsageGraph: protectedProcedure
    .input(GetUsageGraphInput)
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug,
        },
      });
      if (!org) throw new Error("Organization not found");
      // Fetch projects for the given organization
      const billingSearchParams = org.currentPlanStartedAt
        ? {
            where: {
              createdAt: {
                gt: org.currentPlanStartedAt ?? "",
              },
            },
          }
        : {};
      const projects = await ctx.db.project.findMany({
        where: {
          organization: {
            slug: input.orgSlug,
          },
        },
        select: {
          id: true,
          slug: true,
          // Aggregate tokens used for questions in each project
          billingQuestions: billingSearchParams,
          // Count files for each project
          billingFiles: {
            ...billingSearchParams,
            select: {
              id: true,
            },
          },
        },
      });

      // Transform the fetched data to fit the graph format
      const graphData = projects.map((project) => ({
        projectSlug: project.slug,
        totalQuestionsUsed: project.billingQuestions.length,
        totalFiles: project.billingFiles.length,
      }));

      return { graph: graphData, org };
    }),
});
