import React from "react";
import { Metadata } from "next";
import { api } from "~/trpc/server";
import OrgProjectGridItem from "./_components/OrgProjectGridItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          <Link href={`/org/${orgSlug}/new-project`}>
            <Button>New Project</Button>
          </Link>
        </div>
        <p className="text-center text-muted-foreground">
          Your current list of projects in this organization.
        </p>
      </div>
      <Separator />
      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <OrgProjectGridItem
              description={project.desc ?? "No description"}
              title={project.name}
              slug={project.slug}
            />
          ))}
        </div>
      ) : (
        <div className="align-center mx-auto mt-6 justify-center space-y-0.5 lg:max-w-2xl">
          <h2 className="mr-2 text-center text-2xl font-bold tracking-tight">
            No projects created yet 🙇‍♂️
          </h2>
          <p className="text-center text-muted-foreground">
            Go ahead and create a new project!
          </p>
        </div>
      )}
    </div>
  );
}
