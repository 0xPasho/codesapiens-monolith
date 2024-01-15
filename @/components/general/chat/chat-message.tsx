// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { MemoizedReactMarkdown } from "@/components/general/markdown";
import { ChatMessageActions } from "./chat-message-actions";
import { CodeBlock } from "@/components/ui/codeblock";
import { ChatHistory } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { UserIcon } from "lucide-react";
import { useAtBottom } from "@/lib/hooks/use-at-bottom";

export interface ChatMessageProps {
  message: ChatHistory;
  isLastItem?: boolean;
}

export function ChatMessage({
  message = {},
  isLastItem,
  ...props
}: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const running = useRef(false);

  const typer = (pos: number) => {
    running.current = true;
    const timer = setTimeout(() => {
      if (pos < message.content.length) {
        console.log({
          current: pos,
          msg: message.content[pos],
        });
        setDisplayedMessage((prev) => prev + message.content[pos]);
        typer(pos + 1);

        //indexRef.current += 1; // Increment the ref's current value
      } else {
        clearTimeout(timer);
        running.current = false;
      }
    }, 10);
  };
  useEffect(() => {
    if (!message.type) return;
    if (message.type === "assistant" && isLastItem) {
      if (running.current) return;
      typer(0);
    } else {
      setDisplayedMessage(message.content); // Display full content instantly for non-assistant messages
    }
  }, [message, isLastItem]);

  // means data retrieved is incorrect
  if (!message.type) {
    return (
      <div className="rounded-lg border p-5 text-red-500">
        😪 There was a problem continuing with the conversation. Please try
        again with otoher conversation. If this issue persists, please contact
        support!
      </div>
    );
  }

  return (
    <div
      className={cn("group relative mb-4 flex items-start md:-ml-12")}
      {...props}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          message.type === "user"
            ? "bg-background"
            : "bg-white text-primary-foreground",
        )}
      >
        {message.type === "assistant" ? (
          <img src="/logo.png" className="h-4 w-5" />
        ) : (
          <UserIcon />
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  );
                }

                children[0] = (children[0] as string).replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {displayedMessage}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
