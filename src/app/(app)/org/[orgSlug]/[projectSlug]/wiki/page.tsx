import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Repository } from "@prisma/client";
import RepositoryGridItem from "./[repositorySlug]/_components/repository-grid-item";

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
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const repositories =
    await api.repositories.getRepositoriesByProjectSlug.query({
      projectSlug,
    });

  return (
    <div className="mt-14  flex w-full justify-center">
      <div className="flex w-[1200px] max-w-full flex-col px-4 sm:px-8 md:px-0">
        <h2 className="mr-2 text-4xl font-bold tracking-tight">
          Wiki by repository
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repository: Repository, index: number) => (
            <RepositoryGridItem
              key={`repo-item-${repository.id}-${index}`}
              orgSlug={orgSlug}
              projectSlug={projectSlug}
              repository={repository}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
