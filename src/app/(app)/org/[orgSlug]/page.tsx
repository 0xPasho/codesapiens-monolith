import React from "react";
import { Metadata } from "next";
import { api } from "~/trpc/server";
import OrgProjectGridItem from "./_components/org-project-grid-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { PlusIcon, SettingsIcon } from "lucide-react";
import OrganizationInvitation from "./_components/organization-invitation";

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

  const getTitle = () => {
    if (org?.isPersonal) {
      return `Hello ${org?.name}`;
    }
    return `${org?.name ?? orgSlug} dashboard`;
  };

  const getDescription = () => {
    if (org?.isPersonal) {
      return "Your dashboard. This is the whole list of projects you have.";
    }
    return `Organization dashboard. This is the whole list of projects this organization has.`;
  };

  return (
    <div className="flex w-full justify-center py-14">
      <div className="flex w-[1200px] max-w-full flex-col px-4 sm:px-8 md:px-12 lg:px-12 xl:px-0">
        <div className="flex w-full flex-col sm:flex-row ">
          <div className="flex flex-1 flex-col">
            <div className="flex  flex-row">
              <h2 className="mr-2 text-4xl font-bold tracking-tight">
                {getTitle()}
              </h2>
            </div>
            <p className="mb-2  text-muted-foreground">{getDescription()}</p>
            {currentOrgMember?.role === "owner" ? (
              <Link href={`/org/${orgSlug}/settings`}>
                <Button variant={"ghost"} className="mr-2 px-2 ">
                  <SettingsIcon className="mr-1 h-4 w-4" /> Settings
                </Button>
              </Link>
            ) : null}
          </div>
          <div className="flex flex-row items-center">
            {projects.length > 0 ? (
              <Link href={`/org/${orgSlug}/new-project`}>
                <Button className="w-32 px-0">
                  <PlusIcon className="mr-1 h-4 w-4" /> New Project
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <OrgProjectGridItem
                key={`org-item-${project.id}-${index}`}
                orgSlug={orgSlug}
                description={project.desc ?? "No description"}
                slug={project.slug}
                createdAt={project.createdAt}
                projectId={project.id}
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
    </div>
  );
}
