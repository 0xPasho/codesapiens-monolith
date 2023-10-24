"use client";

import WikiLayout from "./_components/document-layout";

interface DocPageProps {
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlugs: string[];
  };
  children: React.ReactNode;
}

export default async function DocsPageLayoutComponent({
  params,
  children,
}: DocPageProps) {
  return <WikiLayout params={params}>{children}</WikiLayout>;
}
