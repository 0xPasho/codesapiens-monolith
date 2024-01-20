import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { GithubConnectButton } from "@/components/general/github/connect-to-github";
import { Icons } from "@/components/general/icons";
import { useState } from "react";
import CustomGithubRepo from "./custom-github-repo";
import { toast } from "@/components/ui/use-toast";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

const DisplayItem = ({
  repo,
  orgSlug,
  onToggleSelect,
  isSelected,
}: {
  repo: any;
  orgSlug: string;
  isSelected: boolean;
  onToggleSelect: (repo: any) => void;
}) => {
  return (
    <div
      className="mb-4 flex w-full flex-col px-2 sm:flex-row"
      key={`repo-${repo.id}`}
    >
      <div className="align-start flex w-full flex-1 items-start">
        <div className="rounded-full border border-white p-2 ">
          <Icons.gitHub className="h-4 w-4" />
        </div>
        <span className="text-md self-center px-2 font-bold">
          {repo.name} ·{" "}
          <span className="text-sm font-normal text-gray-500">
            {repo.created_at ? formatDate(repo.created_at) : ""}
          </span>
        </span>
      </div>
      <div className="mb-4 pt-3 sm:mb-0 sm:pt-0">
        <ImportButton
          orgSlug={orgSlug}
          repo={repo}
          onToggleSelect={onToggleSelect}
          isSelected={isSelected}
        />
      </div>
    </div>
  );
};

const ImportButton = ({
  repo,
  orgSlug,
  onToggleSelect,
  isSelected,
}: {
  repo: any;
  orgSlug: string;
  onToggleSelect: (repo: any) => void;
  isSelected: boolean;
}) => {
  const [isMouseHover, setIsMouseHover] = useState(false);
  return (
    <Button
      onMouseEnter={() => {
        setIsMouseHover(true);
      }}
      onMouseLeave={() => {
        setIsMouseHover(false);
      }}
      variant={
        isSelected ? (isMouseHover ? "destructive" : "default") : "outline"
      }
      onClick={() => onToggleSelect(repo)}
    >
      {isSelected ? (isMouseHover ? "Unselect" : "Selected") : "Import"}
    </Button>
  );
};
const GithubOrgRepositories = ({
  loading,
  repositories = [],
  orgSlug,
  onContinue,
  withRedirect = true,
}: {
  loading: boolean;
  withRedirect?: boolean;
  repositories: Array<any>;
  orgSlug: string;
  onContinue?: (data: any) => void;
}) => {
  const [selectedRepos, setSelectedRepos] = useState<Array<any>>([]);
  const [customRepo, setCustomRepo] = useState<string>();
  const [customRepos, setCustomRepos] = useState<Array<any>>([]);
  const handleToggleSelect = (repo: any) => {
    if (selectedRepos.some((selectedRepo) => selectedRepo.id === repo.id)) {
      setSelectedRepos((prevRepos) =>
        prevRepos.filter((r) => r.id !== repo.id),
      );
    } else {
      setSelectedRepos((prevRepos) => [...prevRepos, repo]);
    }
  };

  function extractGitHubRepoDetails(url) {
    // Enhanced regex pattern to match a broader range of GitHub URLs
    const pieces = url.split("github.com/");
    const remainingPieces = pieces?.[1]?.split("/");
    console.log({ remainingPieces });
    if (remainingPieces && remainingPieces.length >= 2) {
      return { username: remainingPieces[0], repo: remainingPieces[1] };
    }

    // Return null or an appropriate response if the URL does not match
    return null;
  }

  const getRepoInfo = async () => {
    const invalidResponse = { valid: false, repoData: null };
    try {
      if (!customRepo) {
        return invalidResponse;
      }
      const { username, repo } = extractGitHubRepoDetails(customRepo);
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repo}`,
      );

      const repoData = await res.json();
      return { valid: !!repoData.id, repoData };
    } catch (err) {}
    return invalidResponse;
  };

  const getPertinentGithubInformation = (repo) => {
    return {
      url: repo.html_url,
      repo: repo.name,
      branch: repo.default_branch,
      org: repo.owner.login,
      created_at: repo.created_at,
      repoGithubIsPublic: !repo.private,
      repoDescription: "", //repo.description || "",
    };
  };

  const handleCustomRepoSubmit = async () => {
    const result = await getRepoInfo();
    if (!result.valid) {
      toast({
        title: "Invalid repository link",
        description:
          "You added an invalid Github link, try again with other link",
      });
      return;
    }
    setCustomRepos([...customRepos, result.repoData]);
    setCustomRepo("");
  };

  const handleContinue = async () => {
    const parsedSelectedRepos = selectedRepos.map(
      getPertinentGithubInformation,
    );
    const parsedCustomRepos = customRepos.map(getPertinentGithubInformation);
    let tempRepos = [...parsedSelectedRepos, ...parsedCustomRepos];
    if (!withRedirect) {
      onContinue?.(tempRepos);
      return;
    }
    // Create the encoded data
    const encodedData = btoa(JSON.stringify(tempRepos));

    // Navigate to the endpoint
    window.location.href = `/org/${orgSlug}/new-project/import?data=${encodedData}`;
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!repositories.length && !customRepos.length) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="gitHub" />
        <EmptyPlaceholder.Title>No repositories found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any repositories under this organization. Try
          giving us access to the repos with the button below 👇.
          <GithubConnectButton onlyChildren>
            <Button className="mt-4">
              <Icons.gitHub className="mr-2 h-4 w-4" /> Connect your
              repositories
            </Button>
          </GithubConnectButton>
          <p className="py-4">OR</p>
          <CustomGithubRepo
            onSubmit={handleCustomRepoSubmit}
            inputValue={customRepo}
            setInputValue={setCustomRepo}
          />
          {customRepo ? (
            <Button onClick={handleContinue} disabled={!customRepos.length}>
              Continue
            </Button>
          ) : null}
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }
  return (
    <>
      {repositories.length ? (
        <div className="mb-2">
          <h1
            className={`text-center ${
              withRedirect ? "text-2xl" : "mb-4 text-lg"
            }`}
          >
            Organization repositories
          </h1>
          {repositories.map((repo) => (
            <DisplayItem
              repo={repo}
              orgSlug={orgSlug}
              onToggleSelect={handleToggleSelect}
              isSelected={selectedRepos.some((r) => r.id === repo.id)}
            />
          ))}
        </div>
      ) : null}
      {customRepos.length ? (
        <div className="mb-2">
          <h1 className="mt-6 text-center text-2xl">
            Manually Connected Repositories
          </h1>
          {customRepos.map((repo, index) => (
            <DisplayItem
              repo={repo}
              orgSlug={repo.org}
              onToggleSelect={() => {
                setCustomRepos((prevCustomRepos) =>
                  prevCustomRepos.filter((r) => r.id !== repo.id),
                );
              }}
              isSelected={true}
            />
          ))}
        </div>
      ) : null}
      <CustomGithubRepo
        onSubmit={handleCustomRepoSubmit}
        inputValue={customRepo}
        setInputValue={setCustomRepo}
      />
      <Button
        onClick={handleContinue}
        disabled={selectedRepos.length === 0 && !customRepos.length}
      >
        Continue
      </Button>
    </>
  );
};
export default GithubOrgRepositories;
