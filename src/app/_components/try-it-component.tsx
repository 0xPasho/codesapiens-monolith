"use client";

import { Chat } from "@/components/general/chat/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrophyIcon } from "lucide-react";
import ListTryRepos from "./list-try-repos";

const TryItComponent = () => {
  return (
    <div
      id="try"
      className="flex min-h-screen flex-col items-center justify-center bg-black/100 md:text-white"
    >
      <div className="py-12">
        <h1 className="text-center text-4xl font-bold">Give it a try!</h1>
        <span className="text-md text-center">
          Just start asking questions to it! All public repositories will be
          accessible soon to start asking questions
        </span>
      </div>
      <div className="mx-auto flex w-full max-w-6xl px-12">
        <div className="py-6 md:w-1/3">
          <div className="flex flex-col">
            <div className="overflow-y-auto">
              <ListTryRepos />
            </div>
          </div>
        </div>
        <div
          className="p-6 md:w-2/3"
          style={{
            background: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='10' stroke-dasharray='15%2c 15%2c 1' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");`,
          }}
        >
          <Chat
            orgSlug=""
            projectSlug=""
            chatId=""
            messages={[]}
            chat={null}
            isPublicChat
            emptyChatComponent={() => (
              <div>
                <h1>Twitter algorithm Repository</h1>
                <p>Insights into the algorithm used by Twitter.</p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TryItComponent;
