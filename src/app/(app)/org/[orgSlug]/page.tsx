import React from "react";
import { Metadata } from "next";
import { api } from "~/trpc/server";
import OrgProjectGridItem from "./_components/OrgProjectGridItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

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

  return (
    <div className="flex flex-col p-10 pb-16">
      <div className="mx-auto mt-2 justify-center space-y-0.5 pb-4 lg:max-w-2xl">
        <div className="flex  flex-row justify-center">
          <h2 className="mr-2 text-center text-2xl font-bold tracking-tight">
            Projects
          </h2>
          {projects.length > 0 ? (
            <Link href={`/org/${orgSlug}/new-project`}>
              <Button>New Project</Button>
            </Link>
          ) : null}
        </div>
        <p className="text-center text-muted-foreground">
          Your current list of projects in this organization.
        </p>
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
