import React from "react";
import { Metadata } from "next";
import NewProjectInformation from "./_components/new-project-information";

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
  return <NewProjectInformation {...params} />;
};

export default NewProjectImportPage;
