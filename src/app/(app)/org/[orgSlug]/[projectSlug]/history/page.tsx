import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/server";
import { ChatListItem } from "./_components/chat-list-item";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ProjectWikiPageProps {
  params: {
    projectSlug: string;
    orgSlug: string;
  };
}

export const metadata: Metadata = {
  title: "Chat History page",
  description: "Chat History Page",
};

export default async function HistoryPage({
  params: { projectSlug, orgSlug },
}: ProjectWikiPageProps) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const chats = await api.chat.getListOfChats.query({
    project_slug: projectSlug,
  });
  return (
    <div className="mt-14  flex w-full justify-center">
      <div className="flex w-[1200px] max-w-full flex-col px-4 sm:px-8 md:px-0">
        <div className="flex w-full flex-col sm:flex-row ">
          <div className="flex flex-1 flex-col">
            <div className="flex  flex-row">
              <h2 className="mb-4 mr-2 text-4xl font-bold tracking-tight">
                Conversations history
              </h2>
            </div>
          </div>
        </div>
        {chats.length > 0 ? (
          chats.map((chat, index: number) => {
            return (
              <>
                {index > 0 ? <Separator /> : null}
                <ChatListItem
                  chat={chat}
                  projectSlug={projectSlug}
                  orgSlug={orgSlug}
                />
              </>
            );
          })
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="user" />
            <EmptyPlaceholder.Title>No history yet</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Go ahead and start a conversation with the documentation! 👇
            </EmptyPlaceholder.Description>
            <Link href={`/org/${orgSlug}/${projectSlug}`}>
              <Button>Start asking!</Button>
            </Link>
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  );
}
