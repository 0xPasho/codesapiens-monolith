import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const CreateChatAnswerInput = z.object({
  prompt: z.string(),
  project_slug: z.string(),
  chatId: z.string().optional(),
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

      const answerApiUrl = `${env.CONVOS_API_URL}/api/answer`;

      let chatId = input.chatId;

      if (chatId) {
        await ctx.db.chat.findFirstOrThrow({
          where: {
            id: chatId,
          },
        });
      } else {
        const project = await ctx.db.project.findFirstOrThrow({
          where: {
            slug: input.project_slug,
          },
        });
        const chat = await ctx.db.chat.create({
          data: {
            projectId: project.id,
            status: "active",
            userId: ctx.session.user.id,
          },
        });

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
});
