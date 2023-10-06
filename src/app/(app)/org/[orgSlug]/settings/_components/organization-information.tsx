"use client";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";
import OrgNameModifier from "./org-name-modifier";
import OrgSlugModifier from "./org-slug-modifier";
import { Button } from "@/components/ui/button";

export function OrganizationInformation({ orgInfo }: { orgInfo: any }) {
  return (
    <>
      <OrgNameModifier orgInfo={orgInfo} />
      <OrgSlugModifier orgInfo={orgInfo} />
      <CardDataModifier
        title="Remove organization"
        description="Please note that by choosing this option, you will be deleting your organization and all its data. Once removed, this action cannot be undone. Please proceed thoughtfully."
        footer={
          <div className="flex w-full flex-1 justify-end">
            <Button disabled variant="destructive">
              Desactivate
            </Button>
          </div>
        }
        className="mt-4"
      />
    </>
  );
}
