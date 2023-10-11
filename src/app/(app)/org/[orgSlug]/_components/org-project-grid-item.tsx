import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { FileIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "~/trpc/server";

export default async function OrgProjectGridItem({
  description,
  slug,
  orgSlug,
  createdAt,
  projectId,
}: {
  description: string;
  slug: string;
  orgSlug: string;
  createdAt: Date;
  projectId: string;
}) {
  function formatDate() {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  }
  const docsQuantity = api.document.getDocumentQuantityByProject.query({
    projectId,
  });
  return (
    <Link href={`/org/${orgSlug}/${slug}`}>
      <Card className="hover:bg-slate-1/5 mt-4 w-full">
        <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>{slug}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Link
            href={`/org/${orgSlug}/${slug}/settings`}
            className="align-end flex justify-end"
          >
            <Button variant="secondary" className="px-2 shadow-none">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              {docsQuantity} docs
            </div>
            <div>Created {formatDate()}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
