"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  projectId: z.string({
    required_error: "Please select a project",
  }),
});

export default function NewDocumentExtraInfoModal({
  isVisible,
  onVisibleChange,
  blocks,
  orgSlug,
  title,
}: {
  isVisible: boolean;
  onVisibleChange: (open: boolean) => void;
  blocks: any;
  orgSlug: string;
  title: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const createDocumentMutation = api.document.createDocument.useMutation({
    onSuccess(data) {
      toast({
        title: "Document created successfully",
        description:
          "Your document was created successfully. You can now start editing it.",
      });
      const project = projects?.find((project) => project.id === projectId);
      router.push(`/org/${orgSlug}/${project!.slug!}/wiki/edit/${data.id}`);
    },
    onError(e) {
      console.log({ e });
      toast({
        title: "Error creating document",
        description:
          "Something went wrong while creating your document. Please try again later.",
      });
      setDocSaving(false);
    },
  });

  const [projectId, setProjectId] = React.useState<string>("");
  const [docSaving, setDocSaving] = React.useState<boolean>(false);
  const { data: projects, isLoading: areProjectsLoading } =
    api.projects.getAllProjectsBySlug.useQuery({
      slug: orgSlug,
    });
  const { data: repositories, isLoading: areReposLoading } =
    api.repositories.getManualRepositoriesByProject.useQuery({ projectId });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setDocSaving(true);
    const repositoryFound = repositories.find(
      (item) => item.repository.isDefault,
    );
    createDocumentMutation.mutate({
      title,
      content: blocks,
      folderPath: "",
      repositoryId: repositoryFound.repositoryId,
      projectId: data.projectId,
    });
  }

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        if (!docSaving) {
          onVisibleChange(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Creating new document</DialogTitle>
              <DialogDescription>
                To create a new document, please fill the following information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setProjectId(value);
                        //fetchRepositoryByProjectId();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areProjectsLoading ? (
                          <span>Projects are loading...</span>
                        ) : null}
                        {!areProjectsLoading && !(projects?.length > 0) ? (
                          <span>
                            No project was created yet, go ahead and create a
                            new project
                          </span>
                        ) : null}
                        {projects?.map((project) => {
                          return (
                            <SelectItem value={project.id}>
                              {project.slug}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a project to create a new document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="repositoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a repository " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areReposLoading ? (
                          <span>Repositories are loading...</span>
                        ) : null}
                        {!areReposLoading && !(repositories?.length > 0) ? (
                          <span>No repository found.</span>
                        ) : null}
                        {repositories?.map((repository) => {
                          return (
                            <SelectItem value={repository.repository.id}>
                              {repository.repository.title}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a repository to create a new document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                isLoading={createDocumentMutation.isLoading || areReposLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
