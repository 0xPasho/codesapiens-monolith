import { Chat } from "@/components/general/chat/chat";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ChatPageProps {
  params: {
    projectSlug: string;
  };
}

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing Page",
};

export default async function ChatPage({
  params: { projectSlug },
}: ChatPageProps) {
  return <Chat id={projectSlug} initialMessages={[]} />;
}
