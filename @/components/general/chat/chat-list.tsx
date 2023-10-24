import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/components/general/chat/chat-message";
import { ChatHistory } from "@prisma/client";

export interface ChatList {
  messages: ChatHistory[];
}

export function ChatList({ messages, chat }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={message}
            isLastItem={index === messages.length - 1}
          />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  );
}
