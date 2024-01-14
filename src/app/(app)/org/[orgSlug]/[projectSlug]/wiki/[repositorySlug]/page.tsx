import "~/styles/mdx.css";
import { Metadata } from "next";
import { DocumentDisplayContent } from "./_components/document-slug-screen-components/document-display-content";

export const metadata: Metadata = {
  title: "Project Wiki Doc View Page",
  description: "Project Wiki Doc View Page",
};

interface DocPageProps {
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlug: string;
  };
  searchParams?: { documentId?: string };
}

export default async function DocPage({ params, searchParams }: DocPageProps) {
  return (
    <main className="relative w-full lg:gap-10 lg:pr-10 xl:grid">
      <div className="mx-auto w-full min-w-0 py-8">
        <DocumentDisplayContent
          orgSlug={params.orgSlug}
          documentId={searchParams.documentId}
        />
        <hr className="my-4 md:my-6" />
      </div>
    </main>
  );
}
