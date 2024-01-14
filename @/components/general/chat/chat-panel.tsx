import { Button } from "@/components/ui/button";
import { GearIcon, StopIcon } from "@radix-ui/react-icons";
import { ButtonScrollToBottom } from "../buttom-scroll-to-bottom";
import { PromptForm } from "./prompt-form";
import { useChat } from "./chat-context-provider";
import { ChatHistory } from "@prisma/client";
import clsx from "clsx";

export interface ChatPanelProps {
  onNewMessage: (data: { prompt: string }) => Promise<void>;
  messages: ChatHistory[];
  stop: () => void;
  reload: () => void;
  orgSlug: string;
  projectSlug: string;
  isPublicChat?: boolean;
}

export function ChatPanel({
  stop,
  onNewMessage,
  reload,
  messages,
  orgSlug,
  projectSlug,
  isPublicChat,
}: ChatPanelProps) {
  const { state } = useChat();

  return (
    <div
      className={clsx(
        "bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%",
        isPublicChat ? "" : "fixed inset-x-0 bottom-0 ",
      )}
    >
      <ButtonScrollToBottom />
      <div
        className={clsx(
          "mx-auto sm:max-w-2xl sm:px-4",
          isPublicChat ? "p-0" : " ",
        )}
      >
        <div className="flex h-10 items-center justify-center"></div>
        <div
          className={clsx(
            isPublicChat
              ? "p-0 "
              : "space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4",
          )}
        >
          <PromptForm
            orgSlug={orgSlug}
            isPublicChat={isPublicChat}
            projectSlug={projectSlug}
            onSubmit={async (value) => {
              onNewMessage({
                prompt: value,
              });
            }}
            isLoading={state.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
