"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { api } from "~/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { GiftIcon } from "lucide-react";
import { OrganizationMemberRole } from "@prisma/client";
import { MemberRolePopover } from "./member-role-popover";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";
import { OrgMember } from "./org-member";

const FormSchema = z.object({
  email: z.string().email("🙅 Please enter a valid email address."),
  role: z.string().default(OrganizationMemberRole.member),
});

export function InviteMemberBlock({ orgSlug }: { orgSlug: string }) {
  const [validMails, setValidMails] = useState<
    Array<{ email: string; role: OrganizationMemberRole; status?: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMembersMutation = api.organizations.addMembers.useMutation({
    onSuccess(data) {
      console.log({ data });
      toast({
        title: "Invitations sent",
        description:
          "We have sent an invitation to the email address you entered.",
      });
      let newValidMails = [];
      for (const memberResult of data) {
        if (memberResult?.value) {
          newValidMails.push(memberResult?.value);
        }
      }

      setIsLoading(false);
      setValidMails(newValidMails);
    },
    onError: ({ data }) => {
      toast({
        title: "Unexpected error",
        description:
          "Something went wrong. Please contact support if this problem persists",
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      role: OrganizationMemberRole.member,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setValidMails([
      ...validMails,
      {
        email: data.email,
        role: data.role as OrganizationMemberRole,
        status: "preview",
      },
    ]);
    form.reset();
  }

  return (
    <CardDataModifier
      title="Invite to organization"
      description="Invite new members with email address"
      content={
        <>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row"
          >
            <div className="flex flex-1 flex-col">
              <span>Email address</span>
              <Input placeholder="Email address" {...form.register("email")} />
              {form.formState.errors.email ? (
                <div className="mt-2 text-sm text-red-500">
                  {form.formState.errors.email.message}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col">
              <span>Role</span>
              <MemberRolePopover
                className="mb-2 w-full sm:mb-0 sm:w-auto"
                role={form.getValues("role") as OrganizationMemberRole}
                onSelect={(role) => {
                  form.setValue("role", role);
                }}
              />
              {form.formState.errors.role ? (
                <div className="mt-2 text-sm text-red-500">
                  {form.formState.errors.role.message}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col">
              <span className="hidden text-transparent sm:flex">.</span>
              <Button type="submit" variant="secondary">
                Add member
              </Button>
            </div>
          </form>
          <div className="w-full">
            {validMails.length > 0
              ? validMails.map((validMail, index) => {
                  return (
                    <OrgMember
                      key={`${validMail.email}-${index}`}
                      name={validMail.email}
                      role={validMail.role}
                      status={validMail.status ?? "preview"}
                      disableActions
                      className="mt-4"
                    />
                  );
                })
              : null}
          </div>
        </>
      }
      footer={
        <div className="flex w-full flex-1 justify-end">
          <Button
            onClick={() => {
              if (validMails.length === 0) {
                form.setError("email", {
                  message: "Please add at least one email address",
                });
              }
              setIsLoading(true);
              addMembersMutation.mutate({
                members: validMails,
                orgSlug,
              });
            }}
            type="button"
            isLoading={isLoading}
          >
            <GiftIcon /> Send invitations
          </Button>
        </div>
      }
    />
  );
}
