import { stripe } from "@/lib/stripe";
import { Organization, PrismaClient, Project, Session } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const CreateChatAnswerInput = z.object({
  prompt: z.string(),
  project_slug: z.string(),
  chatId: z.string().optional(),
  orgSlug: z.string(),
  repositoryId: z.string().optional(),
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

const getOrgByFreeUser = async (
  { session, db }: { session: Session; db: PrismaClient },
  input: any,
) => {
  const userId = session.user!.id;
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      defaultOrganization: true,
    },
  });

  // now lets find the repository
  const repositoryInformation = await db.repository.findFirst({
    where: {
      id: input.repositoryId,
    },
  });

  // const repository = await db.repository.findFirst({
  //   where: {
  //     project: {
  //       organizationId: user.organizationId,
  //     },
  //     id: input.repositoryId,
  //   },
  //   include: {
  //     project: {
  //       include: {
  //         organization: true,
  //       },
  //     },
  //   },
  // });
  let project;
  const deepFinding = await db.organization.findFirst({
    where: {
      id: user.organizationId,
      projects: {
        some: {
          repositories: {
            some: {
              repository: {
                id: input.repositoryId,
              },
            },
          },
        },
      },
    },
    include: {
      projects: {
        include: {
          repositories: {
            include: {
              repository: true,
            },
            take: 1,
          },
        },
        take: 1,
      },
    },
  });
  console.log({ deepFinding });
  if (!deepFinding?.id) {
    const baseSlug = repositoryInformation.repoProjectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, "")
      .replace(/\s+/g, "_");

    let suffix = 0;
    let slug = baseSlug;

    while (true) {
      const projectFound = await db.project.findFirst({
        where: {
          slug,
        },
      });

      if (!projectFound) break;

      suffix += 1;
      slug = `${baseSlug}_${suffix}`;
    }

    project = await db.project.create({
      data: {
        slug,
        visibility: "public",
        organizationId: user.organizationId,
      },
    });

    await db.projectRepository.create({
      data: {
        projectId: project.id,
        repositoryId: repositoryInformation.id,
      },
    });

    const defaultDocsRepository = await db.repository.create({
      data: {
        title: "Project Documentation",
        repositoryType: "manual",
        isDefault: true,
      },
    });

    await db.projectRepository.createMany({
      data: [
        {
          projectId: project.id,
          repositoryId: defaultDocsRepository.id,
        },
      ],
    });
  } else {
    project = deepFinding.projects[0];
  }

  return {
    org: user.defaultOrganization,
    project,
    repository: deepFinding?.projects?.[0]?.repositories?.[0]?.repository,
  };

  // let project;
  // if (!deepFinding?.id) {
  //   const baseSlug = repositoryInformation.repoProjectName
  //     .trim()
  //     .toLowerCase()
  //     .replace(/[^a-z0-9\s]+/g, "")
  //     .replace(/\s+/g, "_");
  //   let slug = baseSlug;
  //   // let's make sure we are creating a correct proejct with correct slug
  //   while (true) {
  //     const projectFound = await db.project.findFirst({
  //       where: {
  //         slug,
  //       },
  //     });

  //     if (!projectFound) break; // Exit the loop if slug is unique

  //     suffix += 1;
  //     slug = `${baseSlug}_${suffix}`;
  //   }

  //   project = await db.project.create({
  //     data: {
  //       slug,
  //       visibility: "public",
  //       organizationId: user.organizationId,
  //       repositories: {
  //         connect: {
  //           id: repositoryInformation.id,
  //         },
  //       },
  //     },
  //   });

  //   await db.repository.create({
  //     data: {
  //       title: "Project Documentation",
  //       repositoryType: "manual",
  //       projectId: project.id,
  //       isDefault: true,
  //     },
  //   });
  // } else {
  //   project = deepFinding?.projects?.[0];
  // }
  // console.log({ project, deepFinding });
  // return {
  //   org: user.defaultOrganization,
  //   project,
  //   repository: deepFinding?.projects?.[0]?.repositories?.[0],
  // };
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
      let project;
      let currentOrg;
      let chatId = input.chatId;
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
        project = theChat.project;
        currentOrg = theChat.project.organization;
      } else {
        if (input.repositoryId && !input.orgSlug) {
          const freshUserInformation = await getOrgByFreeUser(ctx, input);
          project = freshUserInformation.project;
          currentOrg = freshUserInformation.org;
        } else {
          project = await ctx.db.project.findFirstOrThrow({
            where: {
              slug: input.project_slug,
            },
            include: { organization: true },
          });
          currentOrg = project.organization;
        }

        const chat = await ctx.db.chat.create({
          data: {
            projectId: project.id,
            status: "active",
            userId: ctx.session.user.id,
          },
        });

        chatId = chat.id;
      }

      const remainingCredits =
        (currentOrg.planMaxQuestions || 0) - (currentOrg.currentQuestions || 0);

      if (remainingCredits <= 0 && currentOrg.currentPlan === "free") {
        return { error: "NO_MORE_CREDITS", status: 403 };
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
            // NOTE:
            id_repository: input.repositoryId,
            // sending id_repository means it will ONLY take in consideration that for
            // the searching
          }),
        });

        const json = (await response.json()) as CreateChatAnswerResponse;
        const assistanceMessage = await getChatMsg(json.assistance_message.id);
        const userMessage = await getChatMsg(json.user_message.id);
        // a free user don't have stripe sub id
        if (currentOrg.stripeSubscriptionId) {
          await createUsageRecordForQuestions(currentOrg.stripeSubscriptionId);
        }
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
          projectSlug: project.slug,
          orgSlug: currentOrg.slug,
        };
      } catch (error) {
        console.log({ error });
        return { error: "INTERNAL_ERROR", status: 500 };
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
