import { OrganizationMemberRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Client } from "postmark";
import { z } from "zod";
import { siteConfig } from "~/config/site";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
const postmarkClient = new Client(env.POSTMARK_API_TOKEN);

const CreateOrganizationInput = z.object({
  name: z.string(),
  slug: z.string(),
});

const GetOrgBySlugInput = z.object({
  orgSlug: z.string(),
});

const GetOrganizationMembersInput = z.object({
  orgSlug: z.string(),
});

const UpdateInvitationStatusInput = z.object({
  orgSlug: z.string(),
  status: z.string(),
});

const UpdateOrgNameInput = z.object({
  name: z.string(),
  orgSlug: z.string(),
});

const AddMembersInput = z.object({
  members: z.array(
    z.object({
      email: z.string(),
      role: z.string(),
      status: z.string().optional(),
    }),
  ),
  orgSlug: z.string(),
});

const UpdateOrgSlugInput = z.object({
  slug: z.string(),
  orgSlug: z.string(),
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
  getOrgBySlug: protectedProcedure
    .input(GetOrgBySlugInput)
    .query(({ ctx, input }) => {
      return ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug.toLowerCase(),
        },
      });
    }),
  updateOrgSlug: protectedProcedure
    .input(UpdateOrgSlugInput)
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findFirst({
        where: { slug: input.orgSlug.toLowerCase() },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.slug.toLowerCase(),
        },
      });

      if (orgFound) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Org slug already exists",
        });
      }

      return ctx.db.organization.update({
        data: {
          slug: input.slug.toLowerCase(),
        },
        where: {
          id: org.id,
        },
      });
    }),
  updateOrgName: protectedProcedure
    .input(UpdateOrgNameInput)
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findFirst({
        where: { slug: input.orgSlug.toLowerCase() },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }
      return ctx.db.organization.update({
        data: {
          name: input.name,
        },
        where: {
          id: org.id,
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
          status: "active",
        },
      });

      return newProject;
    }),
  getAuthenticatedMemberOfOrg: protectedProcedure
    .input(GetOrganizationMembersInput)
    .query(async ({ ctx, input }) => {
      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug.toLocaleLowerCase(),
        },
      });

      if (!orgFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const me = await ctx.db.organizationMember.findFirst({
        where: {
          organizationId: orgFound.id,
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            include: {
              defaultOrganization: true,
            },
          },
        },
      });

      return me;
    }),
  getMembers: protectedProcedure
    .input(GetOrganizationMembersInput)
    .query(async ({ ctx, input }) => {
      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug.toLocaleLowerCase(),
        },
      });

      if (!orgFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const allMembers = await ctx.db.organizationMember.findMany({
        where: {
          organizationId: orgFound.id,
        },
        include: {
          user: {
            include: {
              defaultOrganization: true,
            },
          },
        },
      });

      return allMembers;
    }),

  isAuthenticatedUserInvitedToOrg: protectedProcedure
    .input(GetOrganizationMembersInput)
    .query(async ({ ctx, input }) => {
      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug.toLocaleLowerCase(),
        },
      });

      if (!orgFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Org not found",
        });
      }

      const foundUser = await ctx.db.organizationMember.findFirst({
        where: {
          organizationId: orgFound.id,
          userId: ctx.session.user.id,
        },
        include: {
          organization: true,
          user: {
            include: {
              defaultOrganization: true,
            },
          },
        },
      });

      return foundUser;
    }),
  updateInvitationStatus: protectedProcedure
    .input(UpdateInvitationStatusInput)
    .mutation(async ({ ctx, input }) => {
      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug.toLocaleLowerCase(),
        },
      });

      if (!orgFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Org not found",
        });
      }

      const foundUser = await ctx.db.organizationMember.update({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId: orgFound.id,
          },
        },
        data: {
          status: input.status === "accept" ? "active" : "rejected",
        },
      });

      return foundUser;
    }),
  addMembers: protectedProcedure
    .input(AddMembersInput)
    .mutation(async ({ ctx, input }) => {
      const orgFound = await ctx.db.organization.findFirst({
        where: {
          slug: input.orgSlug.toLocaleLowerCase(),
        },
      });

      if (!orgFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const members = await Promise.allSettled(
        input.members.map(async (member) => {
          const shouldBeProccesed = !(
            !member?.status || member?.status === "processing"
          );
          if (!shouldBeProccesed) {
            return {
              email: member.email,
              role: member.role,
              status: member.status,
            };
          }
          const userFound = await ctx.db.user.findFirst({
            where: {
              email: member.email,
            },
          });
          let userId = userFound?.id;

          if (!userFound) {
            const newUser = await ctx.db.user.create({
              data: {
                email: member.email,
              },
            });
            userId = newUser.id;
          }

          const orgMemberFound = await ctx.db.organizationMember.findFirst({
            where: {
              userId,
              organizationId: orgFound.id,
            },
          });

          if (orgMemberFound) {
            if (orgMemberFound.status === "rejected") {
              await ctx.db.organizationMember.update({
                where: {
                  userId_organizationId: {
                    userId: userId!,
                    organizationId: orgFound.id,
                  },
                },
                data: {
                  status: "pending",
                },
              });
            } else if (orgMemberFound.status === "active") {
              return {
                email: member.email,
                role: member.role,
                status: "already_member",
              };
            }
            // for pending status do nothing
            // for pending also continue to send invitation for both again
          }

          const invitationTemplateId = env.POSTMARK_ORG_INVITATION_TEMPLATE;

          const me = await ctx.db.user.findFirst({
            where: {
              id: ctx.session.user.id,
            },
            include: {
              defaultOrganization: true,
            },
          });
          try {
            const result = await postmarkClient.sendEmailWithTemplate({
              TemplateId: parseInt(invitationTemplateId),
              To: member.email,
              From: "b@bixdy.com", //,provider.from as string,
              TemplateModel: {
                product_name: siteConfig.name,
                action_url: `${env.NEXT_PUBLIC_APP_URL}/org/${orgFound.slug}`,
                support_email: "b@bixdy.com",
                invite_sender_organization_name: orgFound.name,
                invite_sender_name: me?.defaultOrganization?.name,
              },
              Headers: [
                {
                  // Set this to prevent Gmail from threading emails.
                  // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
                  Name: "X-Entity-Ref-ID",
                  Value: new Date().getTime() + "",
                },
              ],
            });

            if (result.ErrorCode) {
              return {
                email: member.email,
                role: member.role,
                status: "failed_to_send_invitation",
              };
            }

            if (!orgMemberFound) {
              await ctx.db.organizationMember.create({
                data: {
                  organizationId: orgFound.id,
                  userId,
                  role: ["member", "owner"].includes(member.role)
                    ? (member.role as OrganizationMemberRole)
                    : "member",
                  status: "pending",
                },
              });
            }
            return {
              email: member.email,
              role: member.role,
              status: "success",
            };
          } catch (e) {
            console.log({ e });
            return {
              email: member.email,
              role: member.role,
              status: "failed_to_send_invitation",
            };
          }
        }),
      );

      return members;
    }),
});
