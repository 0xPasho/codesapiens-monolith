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
import { FileScanIcon } from "lucide-react";
import React from "react";
import { env } from "~/env.mjs";

const SyncFilesButton = ({ projectSlug }: { projectSlug: string }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleSync = async () => {
    const userInformation = await fetch(
      `${env.NEXT_PUBLIC_APP_URL}/api/sync-docs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectSlug }),
      },
    ).then((res) => res.json());

    console.log({ userInformation });
  };
  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogTrigger asChild>
        <Button>
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
          <Button variant="ghost" onClick={() => setIsVisible(false)}>
            Cancel
          </Button>
          <Button variant="default" className="ml-2" onClick={handleSync}>
            Yes, Sync
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncFilesButton;
