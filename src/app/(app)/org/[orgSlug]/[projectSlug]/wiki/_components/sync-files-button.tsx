"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { FileScanIcon } from "lucide-react";
import React from "react";
import { env } from "~/env.mjs";

const SyncFilesButton = ({
  projectSlug,
  className,
}: {
  projectSlug: string;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const handleSync = async () => {
    setIsSyncing(true);
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
    setIsSyncing(false);
  };

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(visibility) => {
        if (isSyncing) return;
        setIsVisible(visibility);
      }}
    >
      <DialogTrigger asChild>
        <Button className={className}>
          <FileScanIcon className="mr-2 h-4 w-4" /> Sync all remaining docs from
          repositories
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to sync all remaining docs from repositories?
        </p>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              if (isSyncing) return;
              setIsVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="ml-2"
            onClick={handleSync}
            isLoading={isSyncing}
          >
            {isSyncing ? "Syncing..." : "Yes, Sync"}
          </Button>
        </DialogFooter>
        {isSyncing ? (
          <p style={{ textAlign: "right" }} className="color-gray-500 text-sm">
            Syncing all files from your project...
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default SyncFilesButton;
