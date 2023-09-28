"use client";

import { useSession } from "next-auth/react";
import CardDataModifier from "./_components/card-data-modifier";
import UserFullNameModifier from "./_components/user-fullname-modifier";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserUsernameModifier from "./_components/user-username-modifier";

export function ProfileForm({ profileInfo }: { profileInfo: any }) {
  const { data: sessionData, status } = useSession();
  return (
    <>
      <UserFullNameModifier profileInfo={profileInfo} />
      <UserUsernameModifier profileInfo={profileInfo} />
      <CardDataModifier
        title="Your Email"
        description="Your current email address used for your account."
        content={
          status === "loading" ? (
            <Skeleton className="py-5" />
          ) : (
            <Input
              placeholder={"test@test.com"}
              value={sessionData?.user.email ?? ""}
              disabled
            />
          )
        }
        footer={
          <div className="flex w-full flex-1 justify-end">
            <Button disabled>Save</Button>
          </div>
        }
        className="mt-4"
      />
      <CardDataModifier
        title="Desactivate your account"
        description="Please note that by choosing this option, you will be deleting your Personal Account and all its contents from the CodeSapiens platform. Once removed, this action cannot be undone. Please proceed thoughtfully."
        footer={
          <div className="flex w-full flex-1 justify-end">
            <Button disabled={status === "loading"} variant="destructive">
              Desactivate
            </Button>
          </div>
        }
        className="mt-4"
      />
    </>
  );
}
