import { api } from "~/trpc/server";
import OrgSwitcher from "./org-switcher";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function OrgSwitcherWrapper() {
  const orgs = await api.organizations.getAllOrganizationsByUser.query();

  return (
    <Suspense
      fallback={
        <div className="w-[200px]">
          <Skeleton />
        </div>
      }
    >
      <OrgSwitcher orgs={orgs ?? []} />
    </Suspense>
  );
}
