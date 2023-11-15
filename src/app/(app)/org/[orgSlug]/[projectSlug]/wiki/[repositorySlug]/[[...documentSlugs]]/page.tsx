import "~/styles/mdx.css";
import { Metadata } from "next";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { DocumentDisplayContent } from "./_components/document-display-content";

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
  return (
    <main className="relative lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <Link href={`/org/${params.orgSlug}/${params.projectSlug}/wiki`}>
          <Button variant="ghost" className="mt-4 px-1">
            <ArrowLeftIcon /> Go Back to Repositories
          </Button>
        </Link>
        <DocumentDisplayContent
          initialDocumentId={params?.documentSlugs?.[0] || ""}
          orgSlug={params.orgSlug}
        />
        <hr className="my-4 md:my-6" />
      </div>
    </main>
  );
}
