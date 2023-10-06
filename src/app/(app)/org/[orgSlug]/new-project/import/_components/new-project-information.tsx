"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "lucide-react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import NewProjectInformationForm from "./new-project-information-form";
import NewProjectBase from "../../_components/new-project-base";

const NewProjectInformation = ({ orgSlug }: { orgSlug: string }) => {
  const params = useSearchParams();
  const url = params?.get("url");
  const repoOrg = params?.get("org");
  const repo = params?.get("repo");
  const branch = params?.get("branch");

  if (!url || !repo || !branch) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="add" />
        <EmptyPlaceholder.Title>Wrong data</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You are trying to create a project with wrong data.
        </EmptyPlaceholder.Description>
        <div>
          <Link href={`/org/${orgSlug}/new-project`}>
            <Button>Go back and try again</Button>
          </Link>
        </div>
      </EmptyPlaceholder>
    );
  }

  return (
    <NewProjectBase
      step={1}
      title="🤠 Almost there..."
      description="Let's configure your project"
    >
      <NewProjectInformationForm
        orgSlug={orgSlug}
        url={url}
        repo={repo}
        branch={branch}
        repoOrgSlug={repoOrg ?? ""}
      />
    </NewProjectBase>
  );
};

export default NewProjectInformation;
