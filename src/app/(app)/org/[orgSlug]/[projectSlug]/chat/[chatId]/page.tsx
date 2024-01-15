import { ChatWithoutProvider as Chat } from "@/components/general/chat/chat";
import { type Metadata } from "next";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ChatPageProps {
  params: {
    projectSlug: string;
    orgSlug: string;
    chatId: string;
  };
}

export const metadata: Metadata = {
  title: "Specific Project Overview Page",
  description: "Specific Project Overview Page",
};

export default async function SpecificChatPage({
  params: { projectSlug, orgSlug, chatId },
}: ChatPageProps) {
  const chat = await api.chat.getChat.query({ chatId });

  return (
    <Chat
      orgSlug={orgSlug}
      projectSlug={projectSlug}
      messages={chat}
      chatId={chatId}
      chat={null}
    />
  );
}
