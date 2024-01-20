"use client";

import { api } from "~/trpc/react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MarkdownPreview from "@uiw/react-markdown-preview";
import DocumentLoading from "../../loading";
import { RepositoryType } from "@prisma/client";
import { ArrowBigLeftDashIcon, PlusIcon } from "lucide-react";

const DocumentationDisplay = ({
  documentId,
  orgSlug,
  projectSlug,
  repositoryType,
}: {
  orgSlug: string;
  projectSlug: string;
  documentId?: string;
  repositoryType?: RepositoryType;
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
          {repositoryType === "manual"
            ? "Press on any wiki page to see its content."
            : "Press on any wiki page to see its content."}
        </EmptyPlaceholder.Description>
        {repositoryType === "manual" ? (
          <Link href={`/org/${orgSlug}/new-doc`}>
            <Button>
              <PlusIcon className="mr-1.5 h-3 w-3" /> Create new document
            </Button>
          </Link>
        ) : null}
        <Link href={`/org/${orgSlug}/${projectSlug}/wiki`}>
          <Button variant="link" className="mt-2">
            <ArrowBigLeftDashIcon className="mr-1.5 h-3 w-3" /> Go back to Wiki
          </Button>
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

  return (
    <div className="px-6 sm:px-2" data-color-mode="dark">
      <MarkdownPreview source={`${markdownInnerText}`} />
    </div>
  );
};
const DocumentDisplayContent = async ({
  orgSlug,
  documentId,
  projectSlug,
  repositoryType,
}: {
  orgSlug: string;
  projectSlug: string;
  documentId?: string;
  repositoryType?: RepositoryType;
}) => {
  return (
    <DocumentationDisplay
      orgSlug={orgSlug}
      documentId={documentId}
      projectSlug={projectSlug}
      repositoryType={repositoryType}
    />
  );
};

export { DocumentDisplayContent };
