// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { MemoizedReactMarkdown } from "@/components/general/markdown";
import { ChatMessageActions } from "./chat-message-actions";
import { CodeBlock } from "@/components/ui/codeblock";
import { ChatHistory } from "@prisma/client";
import { useEffect, useState } from "react";

export interface ChatMessageProps {
  message: ChatHistory;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");

  useEffect(() => {
    let index = 0;
    if (message.type === "assistant") {
      const timer = setInterval(() => {
        if (index < message.content.length - 1) {
          setDisplayedMessage((prev) => prev + message.content[index]);
          index += 1;
        } else {
          clearInterval(timer);
        }
      }, 10);

      return () => clearInterval(timer); // Cleanup on component unmount
    } else {
      setDisplayedMessage(message.content); // Display full content instantly for non-assistant messages
    }
  }, [message]);

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
            : "bg-primary text-primary-foreground",
        )}
      >
        {message.type === "assistant" ? <PersonIcon /> : <GearIcon />}
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
