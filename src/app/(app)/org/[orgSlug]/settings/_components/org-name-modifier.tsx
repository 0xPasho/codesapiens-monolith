import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";

const NameSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "🙅 Organization name must be below 3 characters.",
    })
    .max(150, {
      message: "🙅 Organization name cannot be longer than 150 characters.",
    }),
});

const OrgNameModifier = ({ orgInfo }: { orgInfo: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: orgInfo?.name ?? "",
    },
  });

  const updateUserMutation = api.organizations.updateOrgName.useMutation({
    onSuccess() {
      toast({
        title: "Update successful",
        description: "The organization name has been updated successfully.",
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

  const onSubmit = (data: z.infer<typeof NameSchema>) => {
    setIsLoading(true);
    updateUserMutation.mutate({
      name: data.name,
      orgSlug: orgInfo?.slug ?? "",
    });
  };

  useEffect(() => {
    if (orgInfo?.name !== form.getValues("name")) {
      form.setValue("name", orgInfo?.name ?? "");
    }
  }, [orgInfo?.name]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardDataModifier
        title="Organization Name"
        description="Please enter the organization name"
        content={
          <>
            <Input
              placeholder="Organization name"
              {...form.register("name")}
              defaultValue={orgInfo?.name ?? ""}
            />
            {form.formState.errors.name ? (
              <div className="mt-2 text-sm text-red-500">
                {form.formState.errors.name.message}
              </div>
            ) : null}
          </>
        }
        footer={
          <div className="flex w-full flex-1 justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={Boolean(form.formState.errors.name)}
            >
              Save
            </Button>
          </div>
        }
      />
    </form>
  );
};

export default OrgNameModifier;
