import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { OrganizationSidebarNav } from "./_components/organization-sidenav";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { AppWindowIcon, Building2Icon, GridIcon, HandIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "User Settings screen",
  description: "Screen for user settings",
};

const sidebarNavItems = [
  {
    title: "General",
    href: "/org/[orgSlug]/settings",
    icon: <Building2Icon className="mr-2 w-2 w-4" />,
  },
  {
    title: "Billing",
    href: "/org/[orgSlug]/settings/billing",
    icon: <span className="mr-2 w-2 w-4 text-xs">💸</span>,
  },
  {
    title: "Members",
    href: "/org/[orgSlug]/settings/members",
    icon: <AppWindowIcon className="mr-2 w-2 w-4" />,
  },
  {
    title: "Usage",
    href: "/org/[orgSlug]/settings/usage",
    icon: <HandIcon className="mr-2 w-2 w-4" />,
  },
  {
    title: "Projects",
    href: "/org/[orgSlug]",
    icon: <GridIcon className="mr-2 w-2 w-4" />,
  },
];

export default async function OrgSettingsLayout({
  children,
  params: { orgSlug },
}: {
  children: React.ReactNode;
  params: {
    orgSlug: string;
  };
}) {
  const profileInfo = await api.users.getAuthenticatedUser.query();

  if (profileInfo?.defaultOrganization?.slug === orgSlug) {
    return redirect("/account");
  }

  const currentOrgMember =
    await api.organizations.getAuthenticatedMemberOfOrg.query({ orgSlug });

  if (currentOrgMember?.role !== "owner") {
    return redirect(`/org/${orgSlug}`);
  }

  return (
    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <div className=" space-y-6  p-6 pb-16 sm:p-10 md:block">
        <div className="mx-auto justify-center space-y-0.5 lg:max-w-2xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Organization Settings
          </h2>
          <p className="text-center text-muted-foreground">
            Manage the organization account settings, billing, invite members
            and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="mx-auto flex flex-col justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 ">
          <aside className="-mx-4 lg:w-1/5">
            <OrganizationSidebarNav items={sidebarNavItems} orgSlug={orgSlug} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
