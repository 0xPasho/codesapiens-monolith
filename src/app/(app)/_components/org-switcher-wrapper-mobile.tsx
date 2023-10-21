"use client";

import { api } from "~/trpc/react";
import OrgSwitcher from "./org-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function OrgSwitcherWrapperMobile({
  orgSlug,
}: {
  orgSlug: string;
}) {
  const { data: orgs, isLoading } =
    api.organizations.getAllOrganizationsByUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  if (isLoading) {
    return (
      <div className="h-8 w-full sm:hidden">
        <Skeleton />
      </div>
    );
  }

  let selectedOrg = useMemo(() => {
    if (orgSlug) {
      return orgs?.find((org) => org.organization.slug === orgSlug);
    } else {
      return orgs?.find((org) => org.organization.isPersonal);
    }
  }, [orgSlug, orgs]);

  return (
    <OrgSwitcher orgs={orgs ?? []} selectedOrg={selectedOrg} from="mobile" />
  );
}
