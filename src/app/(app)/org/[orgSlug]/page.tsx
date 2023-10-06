import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import OrgProjectGridItem from "./_components/OrgProjectGridItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { PlusIcon, SettingsIcon } from "lucide-react";
import OrganizationInvitation from "./_components/organization-invitation";
import { authOptions, getServerAuthSession } from "~/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Org Page",
  description: "Org Page",
};
export interface OrgPageProps {
  params: {
    orgSlug: string;
  };
}

export default async function OrgsSlugPage({
  params: { orgSlug },
}: OrgPageProps) {
  const user = await getServerAuthSession();

  if (!user) {
    return redirect(authOptions?.pages?.signIn || "/login");
  }

  const projects = await api.projects.getAllProjectsBySlug.query({
    slug: orgSlug,
  });
  const currentOrgMember =
    await api.organizations.isAuthenticatedUserInvitedToOrg.query({ orgSlug });

  if (!currentOrgMember) {
    return (
      <EmptyPlaceholder className="border-none">
        <EmptyPlaceholder.Icon name="page" />
        <EmptyPlaceholder.Title>
          This organization either doesn't exist, or you don't have access to it
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Please go back home, and try keep navigating from there. If you think
          this is a bug, please report it.
        </EmptyPlaceholder.Description>
        <Link href="/">
          <Button>🏠 Go home</Button>
        </Link>
      </EmptyPlaceholder>
    );
  }

  if (currentOrgMember?.status === "pending") {
    return <OrganizationInvitation orgSlug={orgSlug} />;
  }

  const org = await api.organizations.getOrgBySlug.query({ orgSlug });

  return (
    <div className="flex flex-col p-10 pb-16">
      <div className="mx-auto mt-2 justify-center space-y-0.5 pb-4 lg:max-w-2xl">
        <div className="flex  flex-row justify-center">
          <h2 className="mr-2 text-center text-2xl font-bold tracking-tight">
            {org?.name ?? orgSlug}
          </h2>
        </div>
        <p className="mb-2 text-center text-muted-foreground">
          The organization profile.
        </p>
        <div className="flex justify-center">
          {currentOrgMember?.role === "owner" ? (
            <Link href={`/org/${orgSlug}/settings`}>
              <Button variant={"ghost"} className="mr-2 px-2">
                <SettingsIcon className="mr-1 h-4 w-4" /> Settings
              </Button>
            </Link>
          ) : null}
          {projects.length > 0 ? (
            <Link href={`/org/${orgSlug}/new-project`}>
              <Button className="px-2">
                <PlusIcon className="mr-1 h-4 w-4" /> New Project
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
      <Separator />
      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <OrgProjectGridItem
              key={`org-item-${project.id}-${index}`}
              orgSlug={orgSlug}
              description={project.desc ?? "No description"}
              slug={project.slug}
            />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="add" />
          <EmptyPlaceholder.Title>
            No projects created yet
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Go ahead and create a new project! 👇
          </EmptyPlaceholder.Description>
          <Link href={`/org/${orgSlug}/new-project`}>
            <Button>New Project</Button>
          </Link>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
