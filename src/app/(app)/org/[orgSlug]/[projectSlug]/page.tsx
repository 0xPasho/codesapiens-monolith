import { ChatWithoutProvider as Chat } from "@/components/general/chat/chat";
import { type Metadata } from "next";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ChatPageProps {
  params: {
    projectSlug: string;
    orgSlug: string;
  };
}

export const metadata: Metadata = {
  title: "Project Overview Page",
  description: "Project Overview Page",
};

export default async function ChatPage({
  params: { projectSlug, orgSlug },
}: ChatPageProps) {
  const chat = await api.projects.getProjectChat.query({
    projectSlug,
    orgSlug,
  });

  return <Chat orgSlug={orgSlug} projectSlug={projectSlug} chat={chat} />;
}
