import "~/styles/mdx.css";
import { Metadata } from "next";
import { DocumentDisplayContent } from "./_components/document-slug-screen-components/document-display-content";
import { api } from "~/trpc/server";
import DocumentLoading from "./loading";

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
  const repo = await api.repositories.getRepository.query({
    repositoryId: params.repositorySlug,
  });
  return (
    <main className="relative w-full w-full lg:gap-10 lg:pr-10 xl:grid">
      <div className="mx-auto w-full w-full min-w-0 py-8">
        <DocumentDisplayContent
          orgSlug={params.orgSlug}
          projectSlug={params.projectSlug}
          documentId={searchParams.documentId}
          repositoryType={repo.repositoryType}
        />
        <hr className="my-4 md:my-6" />
      </div>
    </main>
  );
}
