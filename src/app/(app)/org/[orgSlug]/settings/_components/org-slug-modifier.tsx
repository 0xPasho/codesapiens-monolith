import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";
import { validateSlugPattern } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";

const slugLength = 40;

const SlugSchema = z.object({
  slug: z
    .string()
    .min(3, {
      message: "🙅 Slug must be at least 3 characters.",
    })
    .max(slugLength, {
      message: `🙅 Slug must be less than ${slugLength} characters.`,
    })
    .refine(validateSlugPattern, {
      message:
        "🙅 Slug must follow the pattern: lowercase letters or numbers, separated by dashes, and cannot start or end with a dash. For example: my-awesome-organization",
    }),
});

const OrgSlugModifier = ({ orgInfo }: { orgInfo: Organization }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SlugSchema>>({
    resolver: zodResolver(SlugSchema),
    defaultValues: {
      slug: orgInfo?.slug ?? "",
    },
  });

  const updateOrgSlugMutation = api.organizations.updateOrgSlug.useMutation({
    onSuccess(data) {
      toast({
        title: "Update successful",
        description: "The organization slug has been updated successfully.",
      });
      router.replace(`/org/${data.slug}/settings `);
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

  const onSubmit = (data: z.infer<typeof SlugSchema>) => {
    setIsLoading(true);
    updateOrgSlugMutation.mutate({
      slug: data.slug,
      orgSlug: orgInfo?.slug ?? "",
    });
  };

  useEffect(() => {
    if (orgInfo?.slug !== form.getValues("slug")) {
      form.setValue("slug", orgInfo?.slug ?? "");
    }
  }, [orgInfo?.slug]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardDataModifier
        title="Organization Slug"
        description="Please enter the organization slug"
        content={
          <>
            <Input
              placeholder="Organization Slug"
              {...form.register("slug")}
              defaultValue={orgInfo?.name ?? ""}
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

export default OrgSlugModifier;
