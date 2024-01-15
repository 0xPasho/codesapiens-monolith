import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Process, Repository, RepositorySync } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import {
  CircleIcon,
  FileIcon,
  FolderArchiveIcon,
  GitBranchIcon,
  GithubIcon,
  HandIcon,
  RecycleIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function RepositoryGridItemFooter({
  repository,
  docsQuantity,
}: {
  repository: Repository;
  docsQuantity: number;
}) {
  function formatDate(date) {
    return formatDistanceToNow(date, {
      addSuffix: true,
    });
  }
  console.log({ repository });
  console.log({ repository });

  const latestProcess = repository["latestProcess"] as Process;
  return (
    <>
      {repository.repositoryType === "github" ? (
        <div className="flex flex-wrap space-x-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="flex items-center border-primary">
            <FileIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {docsQuantity || 0} documents
          </Badge>
          {!!latestProcess?.["synced_commit"] && (
            <Badge variant="outline" className="flex items-center">
              <GitBranchIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              Synced commit: {latestProcess["synced_commit"]}
            </Badge>
          )}

          <Badge variant="outline" className="flex items-center border-primary">
            <RecycleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {!latestProcess?.endDate
              ? "No synced yet"
              : `Synced ${formatDate(latestProcess.endDate)}`}
          </Badge>
        </div>
      ) : null}
    </>
  );
}
export default async function RepositoryGridItem({
  repository,
  orgSlug,
  projectSlug,
  description,
}: {
  repository: Repository;
  orgSlug: string;
  description?: string;
  projectSlug: string;
}) {
  // await api.document.getDocumentQuantityByProject.query({
  //   projectId: repository.projectId,
  //   repositoryId: repository.id,
  // });
  const defaultDocId = repository?.["defaultDocument"]?.["id"];
  const queryParams = defaultDocId ? "?documentId=" + defaultDocId : "";
  return (
    <Link
      href={`/org/${orgSlug}/${projectSlug}/wiki/${repository.id}${queryParams}`}
    >
      <Card className="hover:bg-slate-1/5 mt-4 w-full">
        <CardHeader className="items-start gap-4 space-y-0">
          <div className="w-full space-y-1">
            <div className="align-center mb-2 flex flex-1 flex-row items-center justify-center">
              <CardTitle className="flex-1 pr-2">{repository.title}</CardTitle>
              <Link
                href={`/org/${orgSlug}/${projectSlug}/settings`}
                className="align-end flex justify-end"
              >
                <div className="p-0">
                  <Button variant="secondary" className=" h-6 px-1 shadow-none">
                    <DotsHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </Link>
            </div>
            <CardDescription>
              {description ? (
                <p>{description}</p>
              ) : repository.repositoryType === "github" ? (
                <Link href={repository.repoUrl! ?? "/"} target="_blank">
                  <Badge variant="secondary">
                    <GithubIcon className="mr-2 h-4 w-4" />
                    {`${repository.repoOrganizationName ?? ""}/${
                      repository.repoProjectName
                    }`}
                  </Badge>
                </Link>
              ) : (
                <Badge variant="secondary">
                  <HandIcon className="mr-2 h-4 w-4" />
                  Manual Documentation
                </Badge>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RepositoryGridItemFooter
            repository={repository}
            docsQuantity={repository["documentQuantity"]}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
