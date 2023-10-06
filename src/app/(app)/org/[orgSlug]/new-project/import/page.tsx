import React from "react";
import { Metadata } from "next";
import NewProjectInformation from "./_components/new-project-information";
import { redirect } from "next/navigation";
import { authOptions, getServerAuthSession } from "~/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Project Information Page",
  description: "Project Information Page",
};

const NewProjectImportPage = async ({
  params,
}: {
  params: { orgSlug: string };
}) => {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return <NewProjectInformation {...params} />;
};

export default NewProjectImportPage;
