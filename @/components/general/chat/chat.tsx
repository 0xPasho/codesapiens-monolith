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
import { toast } from "@/components/ui/use-toast";

export interface ChatProps extends React.ComponentProps<"div"> {
  projectSlug: string;
  orgSlug: string;
  chatId?: string;
  messages?: Array<any>;
  chat: any;
  isPublicChat?: boolean;
  emptyChatComponent?: () => React.ReactNode;
}

function ChatWithoutProvider({
  orgSlug,
  projectSlug,
  className,
  messages,
  chat,
  isPublicChat,
  emptyChatComponent,
}: ChatProps) {
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
    if (messages?.length) {
      setConversationHistory(messages);
    }
  }, [messages]);
  useEffect(() => {
    if (storeCleared.current) return;
    storeCleared.current = true;
    reset();
  }, []);

  const createChatAnswer = api.chat.createChatAnswer.useMutation({
    onSuccess(data) {
      try {
        console.log({ data });
        if (!state.chatId) {
          // router.push(
          //   `/org/${orgSlug}/${projectSlug}/chat/${data.chatId}`,
          //   undefined,
          //   { shallow: true },
          // );

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
      } catch (e) {
        toast({ title: "Something went wrong" });
        console.log(e);
      }
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
      chatId: state.chatId || "",
    });

    createChatAnswer.mutate({
      project_slug: projectSlug,
      prompt: data.prompt,
      chatId: state.chatId,
      orgSlug: orgSlug,
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
        ) : emptyChatComponent ? (
          emptyChatComponent()
        ) : (
          <EmptyScreen
            chat={chat}
            projectSlug={projectSlug}
            isPublicChat={isPublicChat}
          />
        )}
      </div>
      <ChatPanel
        stop={stop}
        reload={reload}
        isPublicChat={isPublicChat}
        orgSlug={orgSlug}
        projectSlug={projectSlug}
        messages={state.messages}
        onNewMessage={handleNewMessage}
      />
    </>
  );
}

export function Chat(props: ChatProps) {
  return (
    <ChatProvider
      initialChatId={props.chatId || ""}
      initialMsgs={props.messages}
    >
      <ChatWithoutProvider {...props} />
    </ChatProvider>
  );
}
