import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { Repository } from "@prisma/client";
import RepositoryGridItem from "./[repositorySlug]/_components/repository-grid-item";
import SyncFilesButton from "./_components/sync-files-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddMoreGithubReposModal from "./_components/add-more-github-repos-modal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ProjectWikiPageProps {
  params: {
    projectSlug: string;
    orgSlug: string;
  };
}

export const metadata: Metadata = {
  title: "Repositories page",
  description: "Repositories Page",
};

export default async function RepositoriesByProjectPage({
  params: { projectSlug, orgSlug },
}: ProjectWikiPageProps) {
  const repositories =
    await api.repositories.getRepositoriesByProjectSlug.query({
      projectSlug,
    });

  const currUser = await api.users.getAuthenticatedUser.query();

  const repositoriesWithoutDefault = repositories.filter(
    (item) => !item.isDefault,
  );
  const defaultRepo = repositories.find((item) => item.isDefault);
  if (!defaultRepo)
    return (
      <div className="mt-14  flex w-full justify-center">
        <div className="flex w-[1200px] max-w-full flex-col px-4 sm:px-8 md:px-0">
          <h2 className="mr-2 text-4xl font-bold tracking-tight">
            Documentation Hub
          </h2>
          <div className="mt-4">
            <p>
              There's an error in this project, it has invalid data withing it.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="mt-14  flex w-full justify-center px-4">
      <div className="flex w-[1200px] max-w-full flex-col px-4 sm:px-8 md:px-0">
        <div className="flex flex-col justify-between md:flex-row">
          <h2 className="mr-2 text-4xl font-bold tracking-tight">
            Documentation Hub
          </h2>
          <div>
            <SyncFilesButton projectSlug={projectSlug} />
          </div>
        </div>
        <div>
          <RepositoryGridItem
            key={`repo-item-${defaultRepo.id}`}
            orgSlug={orgSlug}
            projectSlug={projectSlug}
            repository={{
              ...defaultRepo,
              repoProjectName: "Project Documentation",
            }}
            description="Manage all your project-related documents here, including onboarding guides, platform usage manuals, feature explanations, and more."
          />
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col justify-between md:flex-row">
          <div>
            <h1 className="text-2xl font-bold">Synced Github Repos</h1>
            <span>Github repositories to this project</span>
          </div>
          <div>
            <AddMoreGithubReposModal
              installationId={currUser.githubInstallationId}
              projectSlug={projectSlug}
              orgSlug={orgSlug}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repositoriesWithoutDefault.map(
            (repository: Repository, index: number) => (
              <RepositoryGridItem
                key={`repo-item-${repository.id}-${index}`}
                orgSlug={orgSlug}
                projectSlug={projectSlug}
                repository={repository}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
