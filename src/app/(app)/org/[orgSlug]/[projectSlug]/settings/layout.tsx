import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { OrganizationSidebarNav } from "../../settings/_components/organization-sidenav";
import { Building2Icon, FileScanIcon, HandIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "User Settings screen",
  description: "Screen for user settings",
};

const sidebarNavItems = [
  {
    title: "General",
    href: "/org/[orgSlug]/[projectSlug]/settings",
    icon: <Building2Icon className="mr-2 w-2 w-4" />,
  },
  {
    title: "Documents Sync History",
    href: "/org/[orgSlug]/[projectSlug]/settings/sync",
    icon: <FileScanIcon className="mr-2 flex w-2 w-4" />,
  },
  {
    title: "Usage",
    href: "/org/[orgSlug]/[projectSlug]/settings/usage",
    icon: <HandIcon className="mr-2 w-2 w-4" />,
  },
];

export default async function ProjectSettingsLayout({
  children,
  params: { orgSlug, projectSlug },
}: {
  children: React.ReactNode;
  params: {
    orgSlug: string;
    projectSlug: string;
  };
}) {
  const currentOrgMember =
    await api.organizations.getAuthenticatedMemberOfOrg.query({ orgSlug });

  if (currentOrgMember?.role !== "owner") {
    return redirect(`/org/${orgSlug}`);
  }

  return (
    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <div className=" space-y-6 p-10 pb-16 md:block">
        <div className="mx-auto justify-center space-y-0.5 lg:max-w-2xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Project Settings
          </h2>
          <p className="text-center text-muted-foreground">
            Manage the project settings. You can see the usage of credits and
            edit the project information.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="mx-auto flex flex-col justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 ">
          <aside className="-mx-4 lg:w-1/5">
            <OrganizationSidebarNav
              items={sidebarNavItems}
              orgSlug={orgSlug}
              projectSlug={projectSlug}
            />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
