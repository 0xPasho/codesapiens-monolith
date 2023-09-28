"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { env } from "~/env.mjs";
import { Separator } from "@/components/ui/separator";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { validateSlugPattern } from "@/lib/utils";

const slugLength = 40;

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "🙅 Organization name must be below 3 characters.",
    })
    .max(150, {
      message: "🙅 Organization name cannot be longer than 150 characters.",
    }),
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

export function CreateNewOrganizationDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createOrganizationMutation = api.organizations.create.useMutation({
    onSuccess(data) {
      router.push(`/org/${data.slug}`);
      setIsLoading(false);
      setIsVisible(false);
    },
    onError: ({ data }) => {
      setIsSlugEditable(true);
      if (data?.code === "CONFLICT") {
        form.setError("slug", {
          message: "🙅 This slug is already taken.",
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

  const appOrganizationUrl = useMemo(() => {
    const url = env.NEXT_PUBLIC_APP_URL;
    return url.replace("https://", "").replace("http://", "") + "/p/";
  }, [env.NEXT_PUBLIC_APP_URL]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    createOrganizationMutation.mutate({
      name: data.name,
      slug: data.slug.toLowerCase(),
    });
  }
  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Organization"
                        {...field}
                        onChange={(...events) => {
                          if (!isSlugEditable) {
                            const e = events[0];
                            const newSlugValue = e.target.value
                              .toLowerCase()
                              .replace(/ /g, "-")
                              .substring(0, slugLength);
                            form.setValue("slug", newSlugValue);
                          }
                          field.onChange(...events);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => {
                  const slugToShow = field.value ?? `<your-slug>`;
                  if (!isSlugEditable) {
                    return (
                      <div>
                        <Button
                          variant="link"
                          onClick={() => setIsSlugEditable(true)}
                          className="w-full text-start font-normal"
                        >
                          <span>
                            👉 Your url will be{` ${appOrganizationUrl}`}
                            <span className="font-bold text-white">{`${slugToShow}`}</span>
                          </span>
                        </Button>
                      </div>
                    );
                  }
                  return (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="my-amazing-org"
                          id="slug"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        <span>
                          🧐 Once it's created, your organization will be
                          waiting for you at:{` ${appOrganizationUrl}`}
                          <span className="font-bold text-white">{`${slugToShow}`}</span>
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="py-4">
              <Separator />
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button type="submit" variant="ghost">
                  Cancel
                </Button>
              </DialogTrigger>
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
