"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

const GithubInstallationSuccessContent = () => {
  const params = useSearchParams();
  const installationId = params?.get("installation_id");

  const updateUserMutation =
    api.users.updateUserGithubInstallationId.useMutation({
      onSuccess() {
        window?.close();
      },
      onError: () => {
        toast({
          title: "Unexpected error",
          description:
            "Something went wrong. Please contact support if this problem persists",
        });
      },
    });

  useEffect(() => {
    if (installationId) {
      updateUserMutation.mutate({
        installationId,
      });
    }
  }, [installationId]);

  return (
    <EmptyPlaceholder className="border-none">
      <EmptyPlaceholder.Icon name="gitHub" />
      <EmptyPlaceholder.Title>You are all set!</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        If this window is not closed automatically, you can close it now.
      </EmptyPlaceholder.Description>
    </EmptyPlaceholder>
  );
};

export default GithubInstallationSuccessContent;
