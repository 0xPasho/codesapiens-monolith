import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function OrgProjectGridItem({
  description,
  slug,
  orgSlug,
}: {
  description: string;
  slug: string;
  orgSlug: string;
}) {
  return (
    <Link href={`/org/${orgSlug}/${slug}`}>
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{slug}</CardTitle>
          <Link href={`/org/${orgSlug}/${slug}/settings`}>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{description}</div>
          {/* { <p className="text-xs text-muted-foreground">+20.1% from last month</p>} */}
        </CardContent>
      </Card>
    </Link>
  );
}
