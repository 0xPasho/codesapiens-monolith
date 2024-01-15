import { ButtonScrollToBottom } from "../buttom-scroll-to-bottom";
import { PromptForm } from "./prompt-form";
import { ChatHistory } from "@prisma/client";
import clsx from "clsx";
import useChatStore from "./chat-context-provider";

export interface ChatPanelProps {
  onNewMessage: (data: { prompt: string }) => Promise<void>;
  messages: ChatHistory[];
  stop: () => void;
  reload: () => void;
  orgSlug: string;
  projectSlug: string;
  isPublicChat?: boolean;
  error: string | null;
}

export function ChatPanel({
  stop,
  onNewMessage,
  reload,
  messages,
  orgSlug,
  projectSlug,
  isPublicChat,
  error,
}: ChatPanelProps) {
  const { isLoading } = useChatStore();

  return (
    <div
      className={clsx(
        "bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%",
        isPublicChat ? "" : "fixed inset-x-0 bottom-0 ",
      )}
    >
      {!isPublicChat && <ButtonScrollToBottom />}
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
            error={error}
            orgSlug={orgSlug}
            isPublicChat={isPublicChat}
            projectSlug={projectSlug}
            onSubmit={async (value) => {
              onNewMessage({
                prompt: value,
              });
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
