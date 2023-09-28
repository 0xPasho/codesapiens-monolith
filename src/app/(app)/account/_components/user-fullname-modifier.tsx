import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";
import CardDataModifier from "./card-data-modifier";

const NameSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "🙅 Name must be at least 2 characters.",
    })
    .max(90, {
      message: "🙅 Name cannot be longer than 90 characters.",
    })
    .refine((name) => /^[a-zA-Z\- ]+$/.test(name), {
      message: "🙅 Name can only contain alphabets, spaces, and hyphens.",
    }),
});

const UserFullNameModifier = ({ profileInfo }: { profileInfo: any }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: profileInfo?.defaultOrganization?.name ?? "",
    },
  });

  const updateUserMutation = api.users.updateUserFullName.useMutation({
    onSuccess() {
      toast({
        title: "Update successful",
        description: "Your name has been updated successfully.",
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
    });
  };

  useEffect(() => {
    if (profileInfo?.defaultOrganization?.name !== form.getValues("name")) {
      form.setValue("name", profileInfo?.defaultOrganization?.name ?? "");
    }
  }, [profileInfo?.defaultOrganization?.name]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardDataModifier
        title="Your Name"
        description="Please enter your full name, or a display name you are comfortable with."
        content={
          <>
            <Input
              placeholder="Your display name"
              {...form.register("name")}
              defaultValue={profileInfo?.defaultOrganization?.name ?? ""}
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

export default UserFullNameModifier;
