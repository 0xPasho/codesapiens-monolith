"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrgMember } from "./org-member";
import { OrganizationMember } from "@prisma/client";

export function OrgMembers({
  orgMembers,
}: {
  orgMembers: OrganizationMember[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {orgMembers
          ?.filter((item) => item.status === "active")
          .map((orgMember: any, index: number) => {
            return (
              <OrgMember
                name={orgMember.user.defaultOrganization.name}
                username={orgMember.user.defaultOrganization.slug}
                role={orgMember.role}
                avatar={orgMember.user.defaultOrganization.avatar}
                key={`org-member-${orgMember.id}-${index}`}
              />
            );
          })}
      </CardContent>
    </Card>
  );
}
