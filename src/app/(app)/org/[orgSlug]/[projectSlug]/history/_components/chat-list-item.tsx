"use client";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function ChatListItem({
  chat,
  projectSlug,
  orgSlug,
}: {
  chat: any;
  projectSlug: string;
  orgSlug: string;
}) {
  const date = formatDate(chat.createdAt?.toDateString());
  return (
    <Link href={`/org/${orgSlug}/${projectSlug}/chat/${chat.id}`}>
      <div className="flex cursor-pointer items-center justify-between py-4 hover:bg-muted/50">
        <div className="grid gap-1">
          <span className="flex items-center justify-center font-semibold">
            Conversation created on {date}{" "}
            <Badge className="ml-2">{chat.status}</Badge>
          </span>
        </div>
      </div>
    </Link>
  );
}
