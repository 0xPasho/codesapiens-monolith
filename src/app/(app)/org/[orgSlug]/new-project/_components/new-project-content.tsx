"use client";
import { GithubConnectButton } from "@/components/general/github/connect-to-github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import GithubOrgRepositories from "./github-org-repositories";
import { Input } from "@/components/ui/input";

const GithubPermissionsBlock = () => {
  return (
    <>
      <div className="flex-row">
        <span className="text-md text-gray-500">
          Missing Git Repository? 👉
        </span>
        <GithubConnectButton onPopoverClose={() => {}}>
          Adjust Github App Permisions
        </GithubConnectButton>
      </div>
    </>
  );
};

const GithubOrgPicker = ({
  selectedOrg,
  isOpen,
  onSelect,
  orgs,
}: {
  selectedOrg: any;
  isOpen: boolean;
  onSelect: (org: any) => void;
  orgs: any;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Select a Github Organization"
          className={"w-[200px] justify-between"}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={selectedOrg?.account?.avatar_url} />
            <AvatarFallback>GA</AvatarFallback>
          </Avatar>
          {selectedOrg?.account?.login}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Find Github org" />
          <CommandList>
            <CommandEmpty>No github org found.</CommandEmpty>
            <CommandItem>
              <GithubConnectButton onlyChildren>
                <div className="flex w-full items-center px-2 py-2">
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  <span>Connect Github Organization</span>
                </div>
              </GithubConnectButton>
            </CommandItem>
            <CommandGroup heading="Organizations">
              {orgs.map((org, index) => (
                <CommandItem key={`github-org-${index}`} onSelect={onSelect}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      alt={org.account.login}
                      src={org.account.avatar_url}
                    />
                    <AvatarFallback>GA</AvatarFallback>
                  </Avatar>
                  {`${org.account.login}`}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrg?.account?.login === org.account.login
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const NewProjectBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-8  flex w-full justify-center">
      <div className="flex w-[850px] max-w-full flex-col">
        <h1 className="text-center text-4xl">✨ Let's create magic!</h1>
        <h2 className="mb-12 text-center text-2xl text-gray-400">
          Bring up your Git repo to start
        </h2>
        {children}
      </div>
    </div>
  );
};
const NewProjectContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  //const [username, setUsername] = useState<string | null>(null);
  const firstRetrievalRef = useRef(false);
  const [orgs, setOrgs] = useState<Array<any>>([]);
  const [repos, setRepos] = useState<any>([]);
  const [searchingRepo, setSearchingRepo] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const { refetch: fetchGithubOrgs } = api.github.getGithubOrgsByUser.useQuery(
    undefined,
    {
      refetchOnMount: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
  );
  const { refetch: fetchGithubRepos } = api.github.getGithubReposByOrg.useQuery(
    { githubOrgSlug: selectedOrg?.account?.login ?? "" },
    {
      refetchOnMount: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
  );

  const retrieveOrgs = async () => {
    setOrgsLoading(true);
    try {
      const githubOrgs = await fetchGithubOrgs();
      if (!githubOrgs.data) {
        throw "No orgs found";
      }

      const orgsWithoutUser = githubOrgs.data.filter(
        (org) => org?.account?.type !== "User",
      );
      const personalOrg = githubOrgs.data.find((org) => {
        return org?.account?.type === "User";
      });
      setOrgs([personalOrg, ...orgsWithoutUser]);
      // login is the username
      //setUsername(personalOrg?.account?.login!);
      setSelectedOrg(personalOrg);

      // Might break if not, but we need to wait for the orgs to be set before we can retrieve the repos
      await new Promise((resolve) => setTimeout(resolve, 300));
      retrieveRepos();
    } catch (error) {
      console.log({ error });
      toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }
    setOrgsLoading(false);
  };

  const retrieveRepos = async () => {
    try {
      setReposLoading(true);
      const githubRepos = await fetchGithubRepos();

      if (!githubRepos.data) {
        throw "No repos found";
      }

      const sortedOrgs = githubRepos?.data?.sort(
        (a: any, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      setRepos(sortedOrgs);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }
    setReposLoading(false);
  };

  useEffect(() => {
    if (!firstRetrievalRef.current) {
      retrieveOrgs();
      firstRetrievalRef.current = true;
    }
  }, []);

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!isOpen) return;
    function handleClick(event) {
      console.log({ isOpen });
      if (event.target.id !== "orgs-button") {
        setIsOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  if (orgsLoading) {
    return (
      <NewProjectBase>
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

  return (
    <NewProjectBase>
      <div className="flex flex-row">
        <GithubOrgPicker
          isOpen={isOpen}
          onSelect={(org) => {
            setSelectedOrg(org);
            retrieveRepos();
          }}
          selectedOrg={selectedOrg}
          orgs={orgs}
        />
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
        />
      </div>
      <GithubPermissionsBlock />
    </NewProjectBase>
  );
};

export default NewProjectContent;
