"use client";

import { api } from "~/trpc/react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MarkdownPreview from "@uiw/react-markdown-preview";
import DocumentLoading from "../../loading";
import ReactMarkdown from "react-markdown";

const DocumentationDisplay = ({
  documentId,
  orgSlug,
}: {
  orgSlug: string;
  documentId?: string;
}) => {
  const doc = api.document.getSpecificFileByPath.useQuery(
    {
      documentId: documentId || "",
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (!documentId) {
    return (
      <EmptyPlaceholder className="border-none">
        <EmptyPlaceholder.Icon name="page" />
        <EmptyPlaceholder.Title>Welcome to wiki!</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Press on any wiki page to see its content.
        </EmptyPlaceholder.Description>
        <Link href={`/org/${orgSlug}/new-doc`}>
          <Button>Create new document</Button>
        </Link>
      </EmptyPlaceholder>
    );
  }

  if (doc.isLoading) {
    return <DocumentLoading />;
  }

  if (!doc.data) {
    return (
      <EmptyPlaceholder className="border-none">
        <EmptyPlaceholder.Icon name="page" />
        <EmptyPlaceholder.Title>
          Document don't have any content!
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Press on any wiki page to see its content.
        </EmptyPlaceholder.Description>
        <Link href={`/org/${orgSlug}/new-doc`}>
          <Button>Create new document</Button>
        </Link>
      </EmptyPlaceholder>
    );
  }

  const shouldAddTitle = doc.data.content_obj && doc.data.repository.isDefault;

  const markdownInnerText =
    `${shouldAddTitle ? `# ${doc.data.title}\n\n` : ""}${doc.data.content}` ||
    "";

  const startsWithHeaders = markdownInnerText?.startsWith("#")
    ? ""
    : "# " + markdownInnerText;

  return (
    <div className="px-6 sm:px-2">
      <MarkdownPreview
        source={`${startsWithHeaders}${markdownInnerText}${markdownInnerText}`}
      />
    </div>
  );
};
const DocumentDisplayContent = async ({
  orgSlug,
  documentId,
}: {
  orgSlug: string;
  documentId?: string;
}) => {
  return <DocumentationDisplay orgSlug={orgSlug} documentId={documentId} />;
};

export { DocumentDisplayContent };
