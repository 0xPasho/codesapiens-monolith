import { Button } from "@/components/ui/button";
import { GearIcon, StopIcon } from "@radix-ui/react-icons";
import { ButtonScrollToBottom } from "../buttom-scroll-to-bottom";
import { PromptForm } from "./prompt-form";
import { useChat } from "./chat-context-provider";
import { ChatHistory } from "@prisma/client";

export interface ChatPanelProps {
  onNewMessage: (data: { prompt: string }) => Promise<void>;
  messages: ChatHistory[];
  stop: () => void;
  reload: () => void;
}

export function ChatPanel({
  stop,
  onNewMessage,
  reload,
  messages,
}: ChatPanelProps) {
  const { state } = useChat();

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {state.isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <StopIcon className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <GearIcon className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
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
