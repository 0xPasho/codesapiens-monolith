"use client";

import { api } from "~/trpc/react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { useWikiContext } from "../../_components/wiki-context";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";
import { Komponent } from "./komponent";
import { DashboardTableOfContents } from "../../_components/wiki-toc";
import { getTableOfContents } from "@/lib/toc";

const DocumentDisplayContentInner = async ({
  initialDocumentId,
}: {
  initialDocumentId: string;
}) => {
  const { currentSelectedMenuItem } = useWikiContext();
  const [toc, setToc] = React.useState<any>();

  const doc =
    // !initialDocumentId && !currentSelectedMenuItem?.id
    //   ? null
    //   :
    api.document.getSpecificFileByPath.useQuery(
      {
        documentId: currentSelectedMenuItem?.id ?? (initialDocumentId || ""),
      },
      {
        refetchOnWindowFocus: false,
      },
    );
  const values = async () => {
    console.log({ tried: "true" });
    const data = await getTableOfContents(doc?.data?.content)
      .then((_toc) => {
        console.log({ _toc });
        console.log({ _toc });
        setToc(_toc);
      })
      .catch((e) => {
        console.log({ e });
      });
    console.log({ data });
  };
  useEffect(() => {
    console.log({ doc });
    //if (doc?.data?.content) {
    values();
    //}
  }, [doc?.data?.content]);

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
    <div className="mdx">
      <Komponent markdown={doc.data?.content ?? ""} />
      {toc ? (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
            <DashboardTableOfContents toc={toc} />
          </div>
        </div>
      ) : null}
    </div>
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
