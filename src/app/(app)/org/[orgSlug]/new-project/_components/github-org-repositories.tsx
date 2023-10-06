import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

const ImportButton = ({
  repo,
  shouldRedirect,
}: {
  repo: any;
  shouldRedirect?: boolean;
}) => {
  if (shouldRedirect) {
    const searchParams = new URLSearchParams({
      url: repo.html_url,
      repo: repo.name,
      branch: repo.default_branch,
      org: repo.owner.login,
    });

    return (
      <Link href={"/new/import?" + searchParams.toString()}>
        <Button>Import</Button>
      </Link>
    );
  }
  return <Button>Import</Button>;
};
const GithubOrgRepositories = ({
  loading,
  repositories = [],
  shouldRedirect,
}: {
  loading: boolean;
  repositories: Array<any>;
  shouldRedirect?: boolean;
}) => {
  if (loading) {
    return (
      <div>
        <Skeleton className="h-48" />
      </div>
    );
  }
  return (
    <>
      {repositories.length ? (
        repositories.map((repo) => (
          <div
            className="mb-4 flex w-full flex-col px-2 sm:flex-row"
            key={`repo-${repo.id}`}
          >
            <div className="align-start flex w-full flex-1 items-start">
              <div className="rounded-full border border-white p-2 ">
                <GitHubLogoIcon className="h-4 w-4" />
              </div>
              <span className="text-md self-center px-2 font-bold">
                {repo.name} ·{" "}
                <span className="text-sm font-normal text-gray-500">
                  {formatDate(repo.created_at)}
                </span>
              </span>
            </div>
            <div className="mb-4 pt-3 sm:mb-0 sm:pt-0">
              <ImportButton shouldRedirect={shouldRedirect} repo={repo} />
            </div>
          </div>
        ))
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No repositories found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any repositories under this organization. Try
            giving us access to the repos with the button below 👇.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </>
  );
};
export default GithubOrgRepositories;
