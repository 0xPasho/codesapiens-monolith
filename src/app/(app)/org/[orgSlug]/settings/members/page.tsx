import { Separator } from "@/components/ui/separator";
import { api } from "~/trpc/server";
import { OrgMembers } from "./_components/org-members";
import { InviteMemberBlock } from "./_components/invite-member-block";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function OrgMembersPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const orgMembers = await api.organizations.getMembers.query({ orgSlug });
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Members</h3>
        <p className="text-sm text-muted-foreground">
          Manage members of the organization.
        </p>
      </div>
      <Separator />
      <InviteMemberBlock orgSlug={orgSlug} />
      <OrgMembers orgMembers={orgMembers} />
    </div>
  );
}
