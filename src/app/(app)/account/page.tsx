"use client";
import { Button } from "@/components/ui/button";
import CardDataModifier from "./components/CardDataModifier";
import { Input } from "@/components/ui/input";
import UserFullNameModifier from "./components/UserFullNameModifier";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <UserFullNameModifier />
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
