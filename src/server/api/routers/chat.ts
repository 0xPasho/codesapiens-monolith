import { stripe } from "@/lib/stripe";
import { Organization } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const CreateChatAnswerInput = z.object({
  prompt: z.string(),
  project_slug: z.string(),
  chatId: z.string().optional(),
  orgSlug: z.string(),
});

type CreateChatAnswerResponse = {
  answer: string;
  user_message: {
    id: string;
    chat_id: string;
  };
  assistance_message: {
    id: string;
    chat_id: string;
  };
  sources: any[];
  chat_id: string;
};

const GetListOfChatsInput = z.object({
  project_slug: z.string(),
});

const GetChatInput = z.object({
  chatId: z.string(),
});

const createUsageRecordForQuestions = async (stripeSubscriptionId: string) => {
  const items = await stripe.subscriptionItems.list({
    subscription: stripeSubscriptionId,
  });
  let questionsSubscriptionItemId: string;
  for (const item of items.data) {
    // we don't care because once we are inside the billing
    // there's only going to be one of them.
    if (
      item.plan.id === env.STRIPE_MAX_QUESTIONS_MONTHLY_PLAN_ID ||
      item.plan.id === env.STRIPE_PRO_QUESTIONS_MONTHLY_PLAN_ID
    ) {
      questionsSubscriptionItemId = item.id;
    }
  }

  if (!questionsSubscriptionItemId) {
    throw "Error getting the questions subscription id for files";
  }

  return stripe.subscriptionItems.createUsageRecord(
    questionsSubscriptionItemId,
    {
      quantity: 1,
      timestamp: "now",
      action: "increment",
    },
  );
};

export const chatRouter = createTRPCRouter({
  createChatAnswer: protectedProcedure
    .input(CreateChatAnswerInput)
    .mutation(async ({ ctx, input }) => {
      const getChatMsg = async (id: string) => {
        return await ctx.db.chatHistory.findFirstOrThrow({
          where: {
            id,
          },
        });
      };

      //@TODO: Validation for public chats & credits

      const answerApiUrl = `${env.CONVOS_API_URL}/api/answer`;

      let chatId = input.chatId;
      let currentOrg: Organization;
      // if chat exists don't do the before thing just bypass
      // if no chatid, then go and create it...
      if (chatId) {
        const theChat = await ctx.db.chat.findFirstOrThrow({
          where: {
            id: chatId,
          },
          include: {
            project: {
              include: {
                organization: true,
              },
            },
          },
        });
        currentOrg = theChat.project.organization;
      } else {
        let project;
        // find if user don't have the project_slug but it's a global project
        // const myOrg = await ctx.db.project.findFirstOrThrow({
        //   where: {
        //     id: ctx.session.user.id,
        //   },
        // });
        const projectFound = await ctx.db.project.findFirst({
          where: {
            slug: input.project_slug,
          },
          include: {
            organization: true,
          },
        });

        if (
          projectFound?.organization.slug !== input.orgSlug &&
          projectFound.visibility === "public"
        ) {
          project = await ctx.db.project.create({
            data: {
              slug: input.project_slug,
              visibility: "private",
              organizationId: projectFound.organizationId,
            },
            include: {
              organization: true,
            },
          });
        } else {
          project = await ctx.db.project.findFirstOrThrow({
            where: {
              slug: input.project_slug,
            },
            include: { organization: true },
          });
        }

        const chat = await ctx.db.chat.create({
          data: {
            projectId: project.id,
            status: "active",
            userId: ctx.session.user.id,
          },
        });
        currentOrg = project.organization;

        chatId = chat.id;
      }

      try {
        const response = await fetch(answerApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-codesapiens-auth": env.CONVOS_CROSS_ORIGIN_SERVICE_SECRET,
          },
          body: JSON.stringify({
            id_user: ctx.session.user.id,
            id_chat: chatId,
            prompt: input.prompt,
          }),
        });

        const json = (await response.json()) as CreateChatAnswerResponse;
        const assistanceMessage = await getChatMsg(json.assistance_message.id);
        const userMessage = await getChatMsg(json.user_message.id);
        await createUsageRecordForQuestions(currentOrg.stripeSubscriptionId);
        await ctx.db.organization.update({
          data: {
            currentQuestions: currentOrg.currentQuestions + 1,
          },
          where: {
            id: currentOrg.id,
          },
        });
        return {
          assistanceMessage,
          userMessage,
          chatId: json.assistance_message.chat_id!,
        };
      } catch (error) {
        console.log({ error });
        return { error: "Internal server error", status: 500 };
        // console.error("Error forwarding request to Python server:", error);
        // return res.status(500).json({ error: "Internal server error" });
      }
    }),
  getListOfChats: protectedProcedure
    .input(GetListOfChatsInput)
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirstOrThrow({
        where: {
          slug: input.project_slug,
        },
      });

      const chats = await ctx.db.chat.findMany({
        where: {
          projectId: project.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return chats;
    }),
  getChat: protectedProcedure
    .input(GetChatInput)
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.chatHistory.findMany({
        where: {
          chatId: input.chatId,
        },
      });
      console.log({ chat, input });
      return chat;

      // .findFirstOrThrow({
      //   where: {
      //     id: input.chatId,
      //   },
      // });

      // return {chat, chatHistory: };
    }),
});
