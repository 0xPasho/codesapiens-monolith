"use client";

import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat-panel";
import { ChatList } from "./chat-list";
import { EmptyScreen } from "./empty-chat-message";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { ChatProvider } from "./chat-context-provider";
import { useChat as useChatProvider } from "./chat-context-provider";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { ChatHistory } from "@prisma/client";
import { useEffect, useRef } from "react";

export interface ChatProps extends React.ComponentProps<"div"> {
  projectSlug: string;
  orgSlug: string;
}

function ChatWithoutProvider({ orgSlug, projectSlug, className }: ChatProps) {
  const {
    addMessage,
    state,
    setChatIsLoading,
    setChatId,
    setConversationHistory,
    reset,
  } = useChatProvider();
  const { data: sessionData } = useSession();
  const storeCleared = useRef(false);

  useEffect(() => {
    if (storeCleared.current) return;
    storeCleared.current = true;
    reset();
  }, []);

  const createChatAnswer = api.chat.createChatAnswer.useMutation({
    onSuccess(data) {
      console.log({ data });
      if (!state.chatId) {
        setChatId(data.chatId!);
      }
      const newMessages: ChatHistory[] = [...state.messages];
      const fakeMsgIndex = newMessages.findIndex(
        (msg) => msg.id === "the-new-msg",
      );

      if (fakeMsgIndex !== -1) {
        newMessages[fakeMsgIndex] = data.userMessage as ChatHistory;
      }
      newMessages.push(data.assistanceMessage as ChatHistory);
      setConversationHistory(newMessages);
      setChatIsLoading(false);
    },
    onError: ({ data }) => {
      console.log(data);
      setChatIsLoading(false);
    },
  });

  const handleNewMessage = async (data: { prompt: string }) => {
    setChatIsLoading(true);
    addMessage({
      id: "the-new-msg",
      content: data.prompt,
      type: "user",
      userId: sessionData?.user.id ?? "",
      createdAt: new Date(),
      feedback: null,
      chatId: state.chatId ?? "",
    });

    createChatAnswer.mutate({
      project_slug: projectSlug,
      prompt: data.prompt,
    });
  };

  const reload = () => {
    console.log("reload");
  };
  const stop = () => {
    console.log("stop");
  };

  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {state.messages.length ? (
          <>
            <ChatList messages={state.messages} />
            <ChatScrollAnchor trackVisibility={state.isLoading} />
          </>
        ) : (
          <EmptyScreen />
        )}
      </div>
      <ChatPanel
        stop={stop}
        reload={reload}
        messages={state.messages}
        onNewMessage={handleNewMessage}
      />
    </>
  );
}

export function Chat(props: ChatProps) {
  return (
    <ChatProvider initialChatId="">
      <ChatWithoutProvider {...props} />
    </ChatProvider>
  );
}
