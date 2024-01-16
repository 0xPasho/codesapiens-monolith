"use client";

import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat-panel";
import { ChatList } from "./chat-list";
import { EmptyScreen } from "./empty-chat-message";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { ChatHistory } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { UserAuthForm } from "~/app/(auth)/login/components/user-auth-form";
import useChatStore from "./chat-context-provider";

export interface ChatProps extends React.ComponentProps<"div"> {
  projectSlug: string;
  orgSlug: string;
  chatId?: string;
  messages?: Array<any>;
  chat: any;
  isPublicChat?: boolean;
  repositoryId?: string;
  emptyChatComponent?: () => React.ReactNode;
}

const ErrorMessagesContext = ({ error }: { error: string | null }) => {
  if (!error) return null;
  if (error === "UNAUTHORIZED") {
    return (
      <div>
        <UserAuthForm
          from="/#try"
          header={() => {
            return (
              <div className="w-full">
                <div className="flex  justify-center">
                  <img src="/logo.png" className="w-16" />
                </div>
                <h1 className="text-center text-lg font-bold text-primary md:text-2xl">
                  You need an account
                </h1>
                <div className="flex w-full">
                  <span className="text-md w-full self-center text-center">
                    One las thing, before asking questions please log in
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  }
  if (error === "NO_MORE_CREDITS") {
    return (
      <div className="relative mx-auto max-w-2xl rounded-lg border p-5 px-4 text-red-500">
        🫣 You are out of credits in your free plan! Please subscribe to our
        plans to continue using our product.
      </div>
    );
  }
  if (error === "INTERNAL_ERROR") {
    return (
      <div className="relative mx-auto max-w-2xl rounded-lg border p-5 px-4 text-red-500">
        😪 There was a problem continuing with the conversation. Please try
        again with otoher conversation. If this issue persists, please contact
        support!
      </div>
    );
  }
};

const ChatHeaderContext = ({
  error,
  chat,
  messages,
  emptyChatComponent,
  isLoading,
  projectSlug,
  isPublicChat,
}: {
  error: string | null;
  chat: any;
  projectSlug: string;
  isLoading: boolean;
  messages: Array<any>;
  emptyChatComponent: () => React.ReactNode;
  isPublicChat?: boolean;
}) => {
  if (error) return <ErrorMessagesContext error={error} />;

  return emptyChatComponent ? (
    emptyChatComponent()
  ) : (
    <EmptyScreen
      chat={chat}
      projectSlug={projectSlug}
      isPublicChat={isPublicChat}
    />
  );
};

export function ChatWithoutProvider({
  orgSlug,
  projectSlug,
  className,
  messages: propsMsgs,
  chat,
  isPublicChat,
  repositoryId,
  emptyChatComponent,
}: ChatProps) {
  const {
    addMessage,
    setChatIsLoading,
    setChatId,
    setConversationHistory,
    reset,
    chatId,
    isLoading,
    messages,
  } = useChatStore();
  // Forced is ONLY for free chat on home screen, as they won't
  // have a project related to this repository they want to ask
  const [forcedProjectSlug, setForcedProjectSlug] = useState("");
  const [forcedOrgSlug, setForcedOrgSlug] = useState("");
  const { data: sessionData } = useSession();
  const storeCleared = useRef(false);
  const [msgError, setMsgError] = useState<string>(null);
  useEffect(() => {
    if (propsMsgs?.length) {
      setConversationHistory((msgs) => [...msgs, ...propsMsgs]);
    }
  }, [propsMsgs, setConversationHistory]);

  useEffect(() => {
    if (storeCleared.current) return;
    storeCleared.current = true;
    reset();
  }, []);

  const createChatAnswer = api.chat.createChatAnswer.useMutation({
    onSuccess(data) {
      try {
        console.log({ data });
        console.log({ data });
        console.log({ data });
        if (data.error) {
          if (messages.length > 0) {
            toast({ title: "You reached the limit of FREE daily questions" });
          }
          setMsgError(data.error);
          return;
        }
        if (!chatId) {
          // router.push(
          //   `/org/${orgSlug}/${projectSlug}/chat/${data.chatId}`,
          //   undefined,
          //   { shallow: true },
          // );

          setChatId(data.chatId!);
        }
        if (!projectSlug && !forcedProjectSlug) {
          setForcedProjectSlug(data.projectSlug);
        }
        if (!orgSlug && !forcedOrgSlug) {
          setForcedOrgSlug(data.orgSlug);
        }
        setConversationHistory((providedMsgs) => {
          const newMessages = [...providedMsgs];
          console.log({ newMessages });
          console.log({ newMessages });
          const fakeMsgIndex = newMessages.findIndex(
            (msg) => msg.id === "the-new-msg",
          );
          console.log({ fakeMsgIndex });
          console.log({ fakeMsgIndex });

          if (fakeMsgIndex !== -1) {
            newMessages[fakeMsgIndex] = data.userMessage as ChatHistory;
          }
          newMessages.push(data.assistanceMessage as ChatHistory);
          console.log({ newMessages });
          console.log({ newMessages });
          return newMessages;
        });
        setChatIsLoading(false);
      } catch (e) {
        toast({ title: "Something went wrong" });
      }
    },
    onError: ({ data }: { data?: { code: string } }) => {
      if (data?.code === "UNAUTHORIZED") {
        setMsgError(data.code);
        setConversationHistory(() => []);
      }
      setChatIsLoading(false);
    },
  });

  const handleNewMessage = async (data: { prompt: string }) => {
    setChatIsLoading(true);
    setConversationHistory((listMsg) => {
      return [
        ...listMsg,
        {
          id: "the-new-msg",
          content: data.prompt,
          type: "user",
          userId: sessionData?.user.id || "",
          createdAt: new Date(),
          feedback: null,
          chatId: chatId || "",
        },
      ];
    });

    createChatAnswer.mutate({
      project_slug: forcedProjectSlug || projectSlug,
      prompt: data.prompt,
      chatId: chatId,
      orgSlug: forcedOrgSlug || orgSlug,
      repositoryId,
    });
  };

  const reload = () => {
    console.log("reload");
  };
  const stop = () => {
    console.log("stop");
  };
  //h-[calc(100%-15rem)]
  console.log({ messages });
  return (
    <>
      <div
        className={cn(
          isPublicChat
            ? "flex max-h-[70vh] flex-1 flex-col overflow-y-auto sm:px-8"
            : "pb-[200px] pt-4 md:pt-10",
          className,
        )}
      >
        {(messages.length === 0 || msgError === "NO_MORE_CREDITS") && (
          <ChatHeaderContext
            messages={messages}
            chat={chat}
            emptyChatComponent={emptyChatComponent}
            error={msgError}
            isLoading={isLoading}
            projectSlug={forcedProjectSlug || projectSlug}
            isPublicChat={isPublicChat}
          />
        )}
        <div className="w-full">
          <ChatList messages={messages} />
          {!isPublicChat && <ChatScrollAnchor trackVisibility={isLoading} />}
        </div>
      </div>
      {createChatAnswer.isLoading && (
        <div
          className={cn(
            isPublicChat
              ? "flex max-h-[70vh] flex-1 flex-col overflow-y-auto sm:px-8"
              : "pb-[200px] pt-4 md:pt-10",
            className,
            "text-center",
          )}
        >
          Loading reponse...
        </div>
      )}
      <ChatPanel
        error={msgError}
        stop={stop}
        reload={reload}
        isPublicChat={isPublicChat}
        orgSlug={forcedOrgSlug || orgSlug}
        projectSlug={forcedProjectSlug || projectSlug}
        messages={messages}
        onNewMessage={handleNewMessage}
        chat={chat}
      />
    </>
  );
}
const Chat = ChatWithoutProvider;
export default Chat;

// export function Chat(props: ChatProps) {
//   return (
//     <ChatProvider
//       initialChatId={props.chatId || ""}
//       initialMsgs={props.messages}
//     >
//       <ChatWithoutProvider {...props} />
//     </ChatProvider>
//   );
// }
