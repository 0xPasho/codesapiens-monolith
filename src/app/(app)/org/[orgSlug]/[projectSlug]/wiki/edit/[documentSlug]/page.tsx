import { type Metadata } from "next";
import { Editor } from "../../../../new-doc/_components/editor";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ProjectWikiPageProps {
  params: {
    documentSlug: string;
    orgSlug: string;
  };
}

export const metadata: Metadata = {
  title: "Project Wiki Doc Edit Page",
  description: "Project Wiki Doc Edit Page",
};

export default async function ProjectWikiPage({
  params: { documentSlug, orgSlug },
}: ProjectWikiPageProps) {
  const document = await api.document.getDocumentById.query({
    documentId: documentSlug,
  });

  return (
    <Editor
      documentId={documentSlug}
      orgSlug={orgSlug}
      title={document?.title ?? ""}
      content={document?.content_obj ?? []}
    />
  );
}
