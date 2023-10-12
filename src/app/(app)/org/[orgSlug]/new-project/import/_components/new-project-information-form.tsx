"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/general/icons";
import { GitBranchIcon } from "lucide-react";
import { validateSlugPattern } from "@/lib/utils";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const projectSlugLength = 150;

const projectFormSchema = z.object({
  slug: z
    .string()
    .min(3, {
      message: "🙅 Project Name must be at least 3 characters.",
    })
    .max(projectSlugLength, {
      message: `🙅 Project Name must be less than ${projectSlugLength} characters.`,
    })
    .refine(validateSlugPattern, {
      message:
        "🙅 Project Name must follow the pattern: lowercase letters or numbers, separated by dashes, and cannot start or end with a dash. For example: my-awesome-project",
    }),
  description: z
    .string()
    .max(180, "🙅 Description must be below 180 characters")
    .optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const NewProjectInformationForm = ({
  orgSlug,
  url,
  branch,
  repo,
  repoOrgSlug,
}: {
  orgSlug: string;
  url: string;
  branch: string;
  repo: string;
  repoOrgSlug: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createProject = api.projects.create.useMutation({
    onSuccess(project) {
      toast({
        title: "Created successfully",
        description: "Your project has been created successfully.",
      });
      setIsLoading(false);
      router.push(`/org/${orgSlug}/${project.slug}`);
    },
    onError: ({ data }) => {
      if (data?.code === "CONFLICT") {
        form.setError("slug", {
          message: "🙅 This name is already taken.",
        });
      } else {
        toast({
          title: "Unexpected error",
          description:
            "Something went wrong. Please contact support if this problem persists",
        });
      }
      setIsLoading(false);
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      slug: repo.toLowerCase(),
      description: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: ProjectFormValues) {
    setIsLoading(true);
    createProject.mutate({
      newProjectSlug: data.slug.toLowerCase(),
      organizationSlug: orgSlug,
      description: data.description ?? "",
      repoUrl: url,
      repoBranchName: branch,
      repoName: repo,
      repoOrgSlug,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="project-slug" {...field} />
              </FormControl>
              <FormDescription>
                Your project name is derived from your repository. You can edit
                it now or adjust it later in the project settings.{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the project! (optional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Providing a description will enable us to produce optimized
                documentation for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col">
          <span className="caption text-gray-500">IMPORTED GIT REPOSITORY</span>
          <div className="mt-1 flex flex-row items-center">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            {repo}
          </div>
          <div className="mt-1 flex flex-row items-center">
            <GitBranchIcon className="mr-2 h-4 w-4" />
            <span>{branch}</span>
          </div>
        </div>
        <Button className="w-full" type="submit" isLoading={isLoading}>
          👉 Create
        </Button>
      </form>
    </Form>
  );
};

export default NewProjectInformationForm;
