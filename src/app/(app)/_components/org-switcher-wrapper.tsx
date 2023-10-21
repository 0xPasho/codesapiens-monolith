import { api } from "~/trpc/server";
import OrgSwitcher from "./org-switcher";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function OrgSwitcherWrapper({
  orgSlug,
}: {
  orgSlug: string;
}) {
  const orgs = await api.organizations.getAllOrganizationsByUser.query();

  let selectedOrg;
  if (orgSlug) {
    selectedOrg = orgs?.find((org) => org.organization.slug === orgSlug);
  } else {
    selectedOrg = orgs?.find((org) => org.organization.isPersonal);
  }

  return (
    <Suspense
      fallback={
        <div className="hidden w-[200px] sm:flex">
          <Skeleton />
        </div>
      }
    >
      <OrgSwitcher orgs={orgs ?? []} selectedOrg={selectedOrg} from="desktop" />
    </Suspense>
  );
}
