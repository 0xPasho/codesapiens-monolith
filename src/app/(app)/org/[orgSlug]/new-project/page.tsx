import React from "react";
import { Metadata } from "next";
import NewProjectContent from "./_components/new-project-content";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

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
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <div className="flex flex-col">
      <NewProjectContent orgSlug={orgSlug} />
    </div>
  );
}
