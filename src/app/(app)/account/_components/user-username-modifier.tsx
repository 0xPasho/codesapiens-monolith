import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";
import CardDataModifier from "./card-data-modifier";
import { validateSlugPattern } from "@/lib/utils";

const slugLength = 40;
const UsernameSchema = z.object({
  slug: z
    .string()
    .min(3, {
      message: "🙅 Username must be at least 3 characters.",
    })
    .max(slugLength, {
      message: `🙅 Username must be less than ${slugLength} characters.`,
    })
    .refine(validateSlugPattern, {
      message:
        "🙅 Username must follow the pattern: lowercase letters or numbers, separated by dashes, and cannot start or end with a dash. For example: my-awesome-organization",
    }),
});

const UserUsernameModifier = ({ profileInfo }: { profileInfo: any }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      slug: profileInfo?.defaultOrganization?.slug ?? "",
    },
  });

  const updateUserMutation = api.users.updateUserUsername.useMutation({
    onSuccess() {
      toast({
        title: "Update successful",
        description: "Your new username has been updated successfully.",
      });
      setIsLoading(false);
    },
    onError: ({ data }) => {
      if (data?.code === "CONFLICT") {
        form.setError("slug", {
          message: "🙅 This username is already taken.",
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

  const onSubmit = (data: z.infer<typeof UsernameSchema>) => {
    setIsLoading(true);
    updateUserMutation.mutate({
      slug: data.slug,
    });
  };

  useEffect(() => {
    if (profileInfo?.defaultOrganization?.slug !== form.getValues("slug")) {
      form.setValue("slug", profileInfo?.defaultOrganization?.slug ?? "");
    }
  }, [profileInfo?.defaultOrganization?.slug]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardDataModifier
        title="Your username"
        description="Please enter the username you like"
        content={
          <>
            <Input
              placeholder="Your display name"
              {...form.register("slug")}
              defaultValue={profileInfo?.defaultOrganization?.slug ?? ""}
            />
            {form.formState.errors.slug ? (
              <div className="mt-2 text-sm text-red-500">
                {form.formState.errors.slug.message}
              </div>
            ) : null}
          </>
        }
        footer={
          <div className="flex w-full flex-1 justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={Boolean(form.formState.errors.slug)}
            >
              Save
            </Button>
          </div>
        }
      />
    </form>
  );
};

export default UserUsernameModifier;
