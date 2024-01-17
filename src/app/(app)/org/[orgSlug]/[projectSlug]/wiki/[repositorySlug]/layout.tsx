"use client";

import WikiLayout from "./_components/document-slug-screen-components/document-layout";
import { useWikiContext } from "./_components/wiki-context";

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
  const { menuItems, initialLoadDone } = useWikiContext();
  if (
    (!initialLoadDone && menuItems.length > 0) ||
    menuItems.length > 0 ||
    !initialLoadDone
  ) {
    return <WikiLayout params={params}>{children}</WikiLayout>;
  }
  return <>{children}</>;
}
