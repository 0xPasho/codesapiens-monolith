import { api } from "~/trpc/server";
import { OrganizationInformation } from "./_components/organization-information";
import { Separator } from "@/components/ui/separator";

export default async function OrgSettingsProfilePage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const orgInfo = await api.organizations.getOrgBySlug.query({
    orgSlug,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Information</h3>
        <p className="text-sm text-muted-foreground">
          This is the organization profile.
        </p>
      </div>
      <Separator />
      <OrganizationInformation orgInfo={orgInfo} />
    </div>
  );
}
