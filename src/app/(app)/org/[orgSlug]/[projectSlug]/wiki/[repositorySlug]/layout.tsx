"use client";

import WikiLayout from "./_components/document-slug-screen-components/document-layout";

interface DocPageProps {
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlug: string;
  };
  children: React.ReactNode;
}

export default async function DocsPageLayoutComponent({
  params,
  children,
}: DocPageProps) {
  return <WikiLayout params={params}>{children}</WikiLayout>;
}
