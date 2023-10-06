"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberRolePopover } from "./member-role-popover";
import { OrganizationMemberRole } from "@prisma/client";
import { useMemo } from "react";

function OrgMemberMessage({ status }: { status: string }) {
  const textColor = useMemo(() => {
    switch (status) {
      case "pending":
        return "text-muted-foreground";
      case "success":
        return "text-green-500";
      case "already_member":
        return "text-muted-foreground";
      case "preview":
        return "text-muted-foreground";
      case "failed_to_send_invitation":
        return "text-red-500";
      default:
        return null;
    }
  }, [status]);

  const message = useMemo(() => {
    switch (status) {
      case "pending":
        return "Pending acceptance";
      case "success":
        return "Invited";
      case "already_member":
        return "User already invited to organization";
      case "preview":
        return "Submit needed";
      case "failed_to_send_invitation":
        return "Failed to send invitation";
      default:
        return null;
    }
  }, [status]);
  return <p className={`text-sm ${textColor}`}>{message}</p>;
}
export function OrgMember({
  name,
  username,
  role,
  avatar,
  disableActions,
  status,
  className,
}: {
  name: string;
  username?: string;
  avatar?: string;
  role: OrganizationMemberRole;
  disableActions?: boolean;
  status?:
    | "pending"
    | "mail_sent_successfully"
    | "mail_sent_failed"
    | "preview";
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between space-x-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          {username ? (
            <p className="text-sm text-muted-foreground">@{username}</p>
          ) : null}
          {status ? <OrgMemberMessage status={status} /> : null}
        </div>
      </div>
      <MemberRolePopover
        disableActions={disableActions}
        role={role}
        onSelect={() => {}}
      />
    </div>
  );
}
