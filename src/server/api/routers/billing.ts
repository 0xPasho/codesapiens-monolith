import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const GetBillingInformationInput = z.object({
  orgId: z.string(),
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
});
