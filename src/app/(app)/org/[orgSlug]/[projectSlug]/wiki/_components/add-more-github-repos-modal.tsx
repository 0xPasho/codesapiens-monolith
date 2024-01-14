"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { GithubIcon } from "lucide-react";
import React from "react";
import { env } from "~/env.mjs";
import NewProjectContent from "../../../new-project/_components/new-project-content";
import { api } from "~/trpc/react";

const AddMoreGithubReposModal = ({
  projectSlug,
  orgSlug,
  installationId,
}: {
  projectSlug: string;
  orgSlug?: string;
  installationId?: string;
}) => {
  const addMoreRepositories = api.repositories.addMoreRepositories.useMutation({
    onSuccess() {
      setIsVisible(false);
      //window?.close();
    },
    onError: () => {
      toast({
        title: "Unexpected error",
        description:
          "Something went wrong. Please contact support if this problem persists",
      });
    },
  });
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAddingRepos, setIsAddingRepos] = React.useState(false);
  const handleSync = async () => {
    setIsAddingRepos(true);
    toast({ title: "Sit tight", description: "We are syncing your docs!" });
    await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/sync-docs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectSlug }),
    }).then((res) => res.json());
    toast({
      title: "Your files have been synced!",
      description:
        "You can now see your docs in the Wiki section or you can start asking questions!",
    });

    setIsVisible(false);
    setIsAddingRepos(false);
  };

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogTrigger asChild>
        <Button>
          <GithubIcon className="mr-2 h-4 w-4" /> Add More Github repositories
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sync Github Repositories</DialogTitle>
        </DialogHeader>
        <NewProjectContent
          orgSlug={orgSlug}
          withRedirect={false}
          onContinueSelectingRepos={(repositories) => {
            addMoreRepositories.mutate({
              repositories,
              projectSlug,
            });
          }}
          installationId={installationId}
        />
        <p className="text-center">
          Note: If repo is already added, it will be ignored
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoreGithubReposModal;
