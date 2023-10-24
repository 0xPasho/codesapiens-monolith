import React from "react";
import { Metadata } from "next";
import NewProjectContent from "./_components/new-project-content";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "New Project Page",
  description: "New Project Page",
};
export interface OrgPageProps {
  params: {
    orgSlug: string;
  };
}

export default async function NewProjectPage({
  params: { orgSlug },
}: OrgPageProps) {
  const currUser = await api.users.getAuthenticatedUser.query();
  return (
    <div className="flex flex-col">
      <NewProjectContent
        orgSlug={orgSlug}
        installationId={currUser?.githubInstallationId}
      />
    </div>
  );
}
