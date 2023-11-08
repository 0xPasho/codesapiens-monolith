"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import GithubOrgRepositories from "./github-org-repositories";
import { Input } from "@/components/ui/input";
import GithubOrgPicker from "./github-org-picker";
import NewProjectBase from "./new-project-base";
import GithubPermissionsBlock from "./github-permissions-block";

const NewProjectContent = ({
  orgSlug,
  installationId,
}: {
  orgSlug: string;
  installationId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  //const [username, setUsername] = useState<string | null>(null);
  const firstRetrievalRef = useRef(false);
  //const [orgs, setOrgs] = useState<Array<any>>([]);
  const [repos, setRepos] = useState<any>([]);
  const [searchingRepo, setSearchingRepo] = useState<string>("");
  //const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  // const { refetch: fetchGithubOrgs } = api.github.getGithubOrgsByUser.useQuery(
  //   undefined,
  //   {
  //     refetchOnMount: false,
  //     retry: false,
  //     refetchOnReconnect: false,
  //     refetchOnWindowFocus: false,
  //     refetchInterval: false,
  //     refetchIntervalInBackground: false,
  //   },
  // );
  const { refetch: fetchGithubRepos } = api.github.getGithubReposByOrg.useQuery(
    {
      /*githubOrgSlug: selectedOrg?.account?.login ?? ""*/
    },
    {
      refetchOnMount: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
  );

  // const retrieveOrgs = async () => {
  //   setOrgsLoading(true);
  //   try {
  //     const githubOrgs = await fetchGithubOrgs();
  //     if (!githubOrgs.data) {
  //       throw "No orgs found";
  //     }

  //     const orgsWithoutUser = githubOrgs.data.filter(
  //       (org) => org?.account?.type !== "User",
  //     );
  //     const personalOrg = githubOrgs.data.find((org) => {
  //       return org?.account?.type === "User";
  //     });
  //     setOrgs([personalOrg, ...orgsWithoutUser]);
  //     // login is the username
  //     //setUsername(personalOrg?.account?.login!);
  //     setSelectedOrg(personalOrg);

  //     // Might break if not, but we need to wait for the orgs to be set before we can retrieve the repos
  //     await new Promise((resolve) => setTimeout(resolve, 300));
  //     retrieveRepos();
  //   } catch (error) {
  //     console.log({ error });
  //     toast({
  //       title: "Something went wrong.",
  //       description: "Please refresh the page and try again.",
  //       variant: "destructive",
  //     });
  //   }
  //   setOrgsLoading(false);
  // };

  const retrieveRepos = async () => {
    try {
      setReposLoading(true);
      const githubRepos = await fetchGithubRepos();

      if (!githubRepos.data) {
        throw "No repos found";
      }

      const sortedOrgs = githubRepos?.data?.sort(
        (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
      );

      setRepos(sortedOrgs);
    } catch (error) {
      console.log({ error });
      // toast({
      //   title: "Something went wrong.",
      //   description: "Please refresh the page and try again.",
      //   variant: "destructive",
      // });
    }
    setReposLoading(false);
  };

  useEffect(() => {
    if (!firstRetrievalRef.current && retrieveRepos) {
      retrieveRepos();
      firstRetrievalRef.current = true;
    }
  }, [retrieveRepos]);

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!isOpen) return;
    function handleClick(event) {
      if (event.target.id !== "orgs-button") {
        setIsOpen(false);
        window.open("/org/" + orgSlug);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  if (reposLoading) {
    return (
      <NewProjectBase
        step={0}
        title="✨ Let's create magic!"
        description="Bring up your Git repo to start"
      >
        <div className="flex flex-col gap-6 rounded-[4px] ">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </NewProjectBase>
    );
  }

  const filteredRepos = repos.filter((repo) => {
    if (searchingRepo === "") {
      return repo;
    } else if (
      repo.name.toLowerCase().includes(searchingRepo.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchingRepo.toLowerCase())
    ) {
      return repo;
    }
  });
  if (!installationId) {
    return (
      <NewProjectBase
        step={0}
        title="✨ Let's create magic!"
        description="Bring up your Git repo to start"
      >
        <GithubOrgRepositories
          loading={reposLoading}
          repositories={filteredRepos}
          orgSlug={orgSlug}
        />
      </NewProjectBase>
    );
  }

  return (
    <NewProjectBase
      step={0}
      title="✨ Let's create magic!"
      description="Bring up your Git repo to start"
    >
      <div className="flex flex-row">
        {/* <GithubOrgPicker
        isOpen={isOpen}
        onSelect={(org) => {
          setSelectedOrg(org);
          retrieveRepos();
        }}
        selectedOrg={selectedOrg}
        orgs={orgs}
      /> */}
        <Input
          className="ml-2 flex w-full"
          placeholder="Search for repo..."
          onChange={(e) => {
            setSearchingRepo(e.target.value);
          }}
          value={searchingRepo}
        />
      </div>
      <div className="mt-6 flex w-full flex-col">
        <GithubOrgRepositories
          loading={reposLoading}
          repositories={filteredRepos}
          orgSlug={orgSlug}
        />
      </div>
      <GithubPermissionsBlock />
    </NewProjectBase>
  );
};

export default NewProjectContent;
