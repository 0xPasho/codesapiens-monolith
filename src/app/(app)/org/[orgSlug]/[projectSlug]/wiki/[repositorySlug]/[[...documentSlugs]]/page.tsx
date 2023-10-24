import "~/styles/mdx.css";
import { Metadata } from "next";

import DocsPageMainComponent from "./_components/main-component";

export const metadata: Metadata = {
  title: "Project Wiki Doc View Page",
  description: "Project Wiki Doc View Page",
};

interface DocPageProps {
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlugs: string[];
  };
}

export default async function DocPage({ params }: DocPageProps) {
  return <DocsPageMainComponent params={params} />;
}
