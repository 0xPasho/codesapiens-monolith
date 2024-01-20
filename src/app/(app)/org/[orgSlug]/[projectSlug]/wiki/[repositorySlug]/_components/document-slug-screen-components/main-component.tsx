"use client";

import { Button } from "@/components/ui/button";
import { DocumentDisplayContent } from "./document-display-content";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DocPageProps {
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlug: string;
  };
}

export default async function DocsPageMainComponent({ params }: DocPageProps) {
  return (
    <main className="relative lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <React.Suspense
          fallback={
            <>
              <Skeleton className="min-h-[100px] w-full" />
              <Skeleton className="mt-4 min-h-[500px] w-full" />
            </>
          }
        >
          <DocumentDisplayContent
            initialDocumentId={params?.documentSlug || ""}
            orgSlug={params.orgSlug}
          />
        </React.Suspense>
        <hr className="my-4 md:my-6" />
      </div>
    </main>
  );
}
