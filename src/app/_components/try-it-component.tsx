"use client";

import { ChatWithoutProvider as Chat } from "@/components/general/chat/chat";
import ListTryRepos from "./list-try-repos";
import { useState } from "react";
import { tryReposData } from "./try-repos-data";
import useChatStore from "@/components/general/chat/chat-context-provider";
import { EmptyScreen } from "@/components/general/chat/empty-chat-message";

const TryItComponent = () => {
  const [selectedListItem, setSelectedListItem] = useState(0);
  const { reset } = useChatStore();
  return (
    <div
      id="try"
      className="flex min-h-screen flex-col items-center justify-center bg-black/100 md:text-white"
    >
      <div className="px-6 py-12">
        <h1 className="text-center text-4xl font-bold">Give it a try!</h1>
        <span className="text-md text-center">
          Just start asking questions to it! All public repositories will be
          accessible soon to start asking questions
        </span>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-12 md:flex-row">
        <div className="py-6 md:w-1/3">
          <div className="flex flex-col">
            <div className="overflow-y-auto">
              <ListTryRepos
                selected={selectedListItem}
                onSelect={(newValue) => {
                  reset();
                  setSelectedListItem(newValue);
                }}
              />
            </div>
          </div>
        </div>
        <div className="space-between flex flex-col py-6 sm:px-6 md:w-2/3">
          <Chat
            orgSlug=""
            projectSlug=""
            chatId=""
            messages={[]}
            chat={null}
            repositoryId={tryReposData[selectedListItem].repositoryId}
            isPublicChat
            emptyChatComponent={() => (
              <EmptyScreen
                isPublicChat
                selectedPublicItem={tryReposData[selectedListItem]}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TryItComponent;
