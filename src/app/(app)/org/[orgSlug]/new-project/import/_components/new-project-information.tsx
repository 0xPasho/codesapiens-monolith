"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "lucide-react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import NewProjectInformationForm from "./new-project-information-form";
import NewProjectBase from "../../_components/new-project-base";
import { Skeleton } from "@/components/ui/skeleton";

const NewProjectInformation = ({ orgSlug }: { orgSlug: string }) => {
  const params = useSearchParams();
  const dataParam = params?.get("data");

  const [isLoading, setIsLoading] = useState(true);
  const [repositoryList, setRepositoryList] = useState<Array<any>>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (dataParam) {
      let decodedRepos = [];

      const jsonString = atob(dataParam);
      try {
        decodedRepos = JSON.parse(jsonString);

        setRepositoryList(decodedRepos);
      } catch (error) {
        setError(true);
        console.error("Failed to parse the encoded data", error);
      }
      setIsLoading(false);
    }
  }, [dataParam]);

  if (isLoading) {
    return (
      <NewProjectBase
        step={1}
        title="🤠 Almost there..."
        description="Let's configure your project"
      >
        <Skeleton className="h-48" />
      </NewProjectBase>
    );
  }

  if (error) {
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
        repositories={repositoryList || []}
      />
    </NewProjectBase>
  );
};

export default NewProjectInformation;
