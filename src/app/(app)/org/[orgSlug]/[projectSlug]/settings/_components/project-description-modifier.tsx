import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";
import { Project } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

const DescriptionSchema = z.object({
  description: z
    .string()
    .max(180, "🙅 Description must be below 180 characters")
    .optional(),
});

const ProjectDescriptionModifier = ({
  projectInfo,
  projectSlug,
  orgSlug,
}: {
  projectInfo: Project;
  projectSlug: string;
  orgSlug: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof DescriptionSchema>>({
    resolver: zodResolver(DescriptionSchema),
    defaultValues: {
      description: projectInfo?.desc ?? "",
    },
  });

  const updateProjectDescription =
    api.projects.updateProjectDescription.useMutation({
      onSuccess() {
        toast({
          title: "Update successful",
          description: "The project description has been updated successfully.",
        });
        setIsLoading(false);
      },
      onError: () => {
        toast({
          title: "Unexpected error",
          description:
            "Something went wrong. Please contact support if this problem persists",
        });
        setIsLoading(false);
      },
    });

  const onSubmit = (data: z.infer<typeof DescriptionSchema>) => {
    setIsLoading(true);
    updateProjectDescription.mutate({
      description: data.description ?? "",
      orgSlug,
      projectSlug,
    });
  };

  useEffect(() => {
    if (projectInfo?.desc !== form.getValues("description")) {
      form.setValue("description", projectInfo?.desc ?? "");
    }
  }, [projectInfo?.desc]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardDataModifier
        title="Description"
        description="Please enter the description of the project"
        content={
          <>
            <Textarea
              placeholder="Project Description"
              {...form.register("description")}
              defaultValue={projectInfo?.desc ?? ""}
              className="max-h-[150px]"
            />
            {form.formState.errors.description ? (
              <div className="mt-2 text-sm text-red-500">
                {form.formState.errors.description.message}
              </div>
            ) : null}
          </>
        }
        footer={
          <div className="flex w-full flex-1 justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={Boolean(form.formState.errors.description)}
            >
              Save
            </Button>
          </div>
        }
      />
    </form>
  );
};

export default ProjectDescriptionModifier;
