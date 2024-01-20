"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/general/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "login" | "register";
  header?: () => React.ReactNode;
  from?: string;
}

type FormData = z.infer<typeof userAuthSchema>;

export const userAuthSchema = z.object({
  email: z.string().email(),
});

export function UserAuthForm({
  className,
  type,
  header,
  from,
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: from || searchParams?.get("from") || "/dashboard",
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    return toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }

  const areButtonsLoading = isLoading || isGitHubLoading || isGoogleLoading;

  return (
    <Card>
      <CardHeader className="space-y-1">
        {!header && (
          <>
            <div className="flex  justify-center">
              <img src="/logo.png" className="w-16" />
            </div>
            <CardTitle className="text-2xl">
              {type === "register" ? "Create an account" : "Sign in"}
            </CardTitle>
          </>
        )}
        <CardDescription>
          {!!header
            ? header()
            : type === "register"
            ? "Enter your email below to create your account"
            : "Enter your email below to sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button
            variant="outline"
            onClick={() => {
              setIsGitHubLoading(true);
              signIn("github", {
                redirect: true,
                callbackUrl: from || searchParams?.get("from") || "/dashboard",
              });
            }}
            disabled={areButtonsLoading}
            isLoading={isGitHubLoading}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsGoogleLoading(true);
              signIn("google", {
                redirect: true,
                callbackUrl: from || searchParams?.get("from") || "/dashboard",
              });
            }}
            disabled={areButtonsLoading}
            isLoading={isGoogleLoading}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={areButtonsLoading}
            {...register("email")}
          />
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
          )}
          <Button
            className={"mt-2 w-full"}
            disabled={areButtonsLoading}
            //isLoading={areButtonsLoading}
          >
            Sign In with Email
          </Button>
        </form> */}
      </CardContent>
    </Card>
  );
}
