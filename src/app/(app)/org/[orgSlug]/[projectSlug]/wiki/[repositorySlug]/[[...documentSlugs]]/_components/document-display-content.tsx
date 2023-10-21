"use client";

import { Editor } from "~/app/(app)/org/[orgSlug]/new-doc/_components/editor";
import { WikiDocumentHeader } from "../../_components/wiki-document-header";
import { api } from "~/trpc/react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { useWikiContext } from "../../_components/wiki-context";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const DocumentDisplayContentInner = async ({
  initialDocumentId,
}: {
  initialDocumentId: string;
}) => {
  const { currentSelectedMenuItem } = useWikiContext();

  const doc =
    !initialDocumentId && !currentSelectedMenuItem?.id
      ? null
      : api.document.getSpecificFileByPath.useQuery(
          {
            documentId:
              currentSelectedMenuItem?.id ?? (initialDocumentId || ""),
          },
          {
            refetchOnWindowFocus: false,
          },
        );

  if (!doc) {
    return (
      <EmptyPlaceholder className="border-none">
        <EmptyPlaceholder.Icon name="page" />
        <EmptyPlaceholder.Title>Nothing to show</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Looks like this wiki page is broken, please click on other wiki page.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <>
      <WikiDocumentHeader heading={doc.data?.title} />
      <Editor
        documentId={doc.data?.id}
        readOnly
        content={doc.data?.content_obj}
      />
    </>
  );
};

const DocumentDisplayContent = async ({
  initialDocumentId,
}: {
  initialDocumentId: string;
}) => {
  return (
    <React.Suspense
      fallback={
        <>
          <Skeleton className="min-h-[100px] w-full" />
          <Skeleton className="mt-4 min-h-[500px] w-full" />
        </>
      }
    >
      <DocumentDisplayContentInner initialDocumentId={initialDocumentId} />
    </React.Suspense>
  );
};

export { DocumentDisplayContent };
