"use client";

import { Button } from "@/components/ui/button";
import { WikiProvider } from "../../_components/wiki-context";
import { DocumentDisplayContent } from "./document-display-content";
import WikiLayout from "./document-layout";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface DocPageProps {
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlugs: string[];
  };
}

export default async function DocsPageMainComponent({ params }: DocPageProps) {
  return (
    <WikiProvider>
      <WikiLayout params={params}>
        <main className="relative lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <Link href={`/org/${params.orgSlug}/${params.projectSlug}/wiki`}>
              <Button variant="ghost" className="mt-4 px-1">
                <ArrowLeftIcon /> Go Back to Repositories
              </Button>
            </Link>
            <DocumentDisplayContent
              initialDocumentId={params?.documentSlugs?.[0] || ""}
            />
            <hr className="my-4 md:my-6" />
            {/* {<DocsPager doc={doc} />} */}
          </div>
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
              {/* <DashboardTableOfContents toc={toc} /> */}
            </div>
          </div>
        </main>
      </WikiLayout>
    </WikiProvider>
  );
}
