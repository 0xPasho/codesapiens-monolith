import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Repository } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import {
  CircleIcon,
  FileIcon,
  FolderArchiveIcon,
  GitBranchIcon,
  GithubIcon,
  HandIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "~/trpc/server";

function RepositoryGridItemFooter({
  repository,
  docsQuantity,
}: {
  repository: Repository;
  docsQuantity: number;
}) {
  function formatDate(date) {
    return "today";
    if (!repository.last_synced_commit) {
      return "";
    }
    return formatDistanceToNow(repository.last_synced_commit, {
      addSuffix: true,
    });
  }

  if (true) {
    return (
      <>
        {repository.repositoryType === "github" ? (
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              {docsQuantity} docs
            </div>
            <div className="flex items-center">
              <GitBranchIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              {repository.repoBranchName}
            </div>
            <div>Synced {formatDate(repository.last_synced_commit)}</div>
          </div>
        ) : null}
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <FileIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {docsQuantity} docs
          </div>
          <div>
            {repository.repositoryType === "github" ? "Imported" : "Created"}{" "}
            {formatDate(repository?.createdAt)}
          </div>
        </div>
      </>
    );
  }
}
export default async function RepositoryGridItem({
  repository,
  orgSlug,
  projectSlug,
}: {
  repository: Repository;
  orgSlug: string;
  projectSlug: string;
}) {
  const docsQuantity = await api.document.getDocumentQuantityByProject.query({
    projectId: repository.projectId,
  });
  return (
    <Link href={`/org/${orgSlug}/${projectSlug}/wiki/${repository.id}`}>
      <Card className="hover:bg-slate-1/5 mt-4 w-full">
        <CardHeader className="items-start gap-4 space-y-0">
          <div className="w-full space-y-1">
            <div className="align-center mb-2 flex flex-1 flex-row items-center justify-center">
              <CardTitle className="flex-1 pr-2">{repository.title}</CardTitle>

              <Link
                href={`/org/${orgSlug}/${projectSlug}/settings`}
                className="align-end flex justify-end"
              >
                <Button variant="secondary" className="px-2 shadow-none">
                  <DotsHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              {repository.repositoryType === "github" ? (
                <Link href={repository.repoUrl!} target="_blank">
                  <Badge>
                    <GithubIcon className="mr-2 h-4 w-4" />
                    {`${repository.repoOrganizationName ?? ""}/${
                      repository.repoProjectName
                    }`}
                  </Badge>
                </Link>
              ) : (
                <Badge>
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
            docsQuantity={docsQuantity}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
