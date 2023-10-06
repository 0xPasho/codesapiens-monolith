"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "~/trpc/react";

export default async function OrganizationInvitation({
  orgSlug,
}: {
  orgSlug: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const updateStatus = api.organizations.updateInvitationStatus.useMutation();
  const updateInvitationStatus = async (status: "accept" | "declined") => {
    setIsLoading(true);
    await updateStatus.mutateAsync({
      orgSlug,
      status,
    });
    setIsLoading(false);
    window.location.reload();
  };

  return (
    <EmptyPlaceholder className="border-none">
      <EmptyPlaceholder.Icon name="page" />
      <EmptyPlaceholder.Title>
        You were invited to join {orgSlug}.
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        Do you want to join?
      </EmptyPlaceholder.Description>
      <div className="flex flex-row">
        <Button
          isLoading={isLoading}
          variant="secondary"
          className="mr-2"
          onClick={() => {
            updateInvitationStatus("declined");
          }}
        >
          Decline
        </Button>
        <Button
          variant="default"
          isLoading={isLoading}
          onClick={() => {
            updateInvitationStatus("accept");
          }}
        >
          Accept
        </Button>
      </div>
    </EmptyPlaceholder>
  );
}
