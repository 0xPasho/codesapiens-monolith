import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import useChatStore from "./chat-context-provider";
import { LandingPageRepositoryInfo } from "~/app/_components/try-repos-data";
import { useMemo, useState } from "react";
import SyncFilesButton from "~/app/(app)/org/[orgSlug]/[projectSlug]/wiki/_components/sync-files-button";

const exampleMessages = [
  {
    heading: "How do I run this the project?",
    message: `How do I run the project?`,
  },
  {
    heading: "What is the purpose of this project?",
    message: "What is the purpose of this project?",
  },
  {
    heading: "How do I deploy this project?",
    message: `How do I deploy this project?`,
  },
];

export function EmptyScreen({
  chat,
  projectSlug,
  isPublicChat,
  selectedPublicItem,
}: {
  chat: any;
  projectSlug?: string;
  isPublicChat?: boolean;
  selectedPublicItem?: LandingPageRepositoryInfo;
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { setPromptInput, selectedRepositoriesItem, repositoriesItems } =
    useChatStore();

  if (isPublicChat) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-background p-8">
          <img src="/logo.png" className="mb-2 w-24" />
          <h1 className="mb-2 text-lg font-semibold">Hey, I'm here to help.</h1>
          <p className="leading-normal text-muted-foreground">
            You can start a conversation with this smart monkey by asking
            anything about this repository.{" "}
            {selectedPublicItem ? "You are asking about the next project:" : ""}
          </p>
          <div className="flex flex-col items-center justify-center md:flex-row">
            <img
              src={selectedPublicItem.image}
              className="mr-4 mt-4 h-8 w-8 rounded-full"
            />
            <div className="pt-3">
              <p className="font-bold leading-normal text-muted-foreground">
                {selectedPublicItem.title}
              </p>
              <p className="leading-normal text-muted-foreground">
                {selectedPublicItem.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const headerMsg = useMemo(() => {
    const hasProcesses = !!chat?.processes?.length;

    const currentSelectedItem = repositoriesItems?.find(
      (item) => item.value === selectedRepositoriesItem,
    );
    if (selectedRepositoriesItem !== "all") {
      if (!currentSelectedItem?.metadata?.isSynced) {
        return `The files from ${currentSelectedItem?.label} are currently being synced, it may take up to 10 minutes, depending on project size and current server usag. Please wait a bit while it finishes. The current status of the process is under Settings => Documents Sync History.`;
      } else {
        return "You can start a conversation with this smart monkey by asking for example";
      }
    } else {
      if (isSyncing) {
        return "Some of your files are currently being synced, please wait until this process is finished. The current status of the process is under Settings => Documents Sync History. You can still ask questions to the already processed files.";
      }
      if (!hasProcesses) {
        if (!chat?.documents?.length) {
          return "To be able to chat you will need to have your repository synced correctly, please click the button below.";
        } else {
          return `This project don't have any synced file, you can ask questions but for results related to the project you need to sync files first`;
        }
      }
      // you can't have procceses without docs, so, that case's avoided

      if (chat?.processes?.find((item) => !item.endDate)) {
        return "Some of your documents are currently being synced. It may take up to 10 minutes, depending on project size and current server usage";
      }
    }

    return "You can start a conversation with this smart monkey to all your documents by asking for example";
  }, [chat, selectedRepositoriesItem, repositoriesItems]);

  const shouldShowExamples = useMemo(() => {
    if (selectedRepositoriesItem !== "all") {
      const currentSelectedItem = repositoriesItems?.find(
        (item) => item.value === selectedRepositoriesItem,
      );
      return currentSelectedItem?.metadata?.isSynced;
    }

    if (
      chat?.documents?.length &&
      chat?.processes?.length &&
      chat?.processes?.every((item) => item.endDate)
    ) {
      return true;
    }

    return false;
  }, [chat, selectedRepositoriesItem, repositoriesItems]);

  const shouldShowSyncButton = useMemo(() => {
    if (selectedRepositoriesItem !== "all") {
      const currentSelectedItem = repositoriesItems?.find(
        (item) => item.value === selectedRepositoriesItem,
      );
      return !currentSelectedItem?.metadata?.isSynced;
    }
    if (!chat?.processes?.length && !chat?.documents?.length) {
      return true;
    }
    return false;
  }, [chat, selectedRepositoriesItem, repositoriesItems]);

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <img src="/logo.png" className="mb-2 w-24" />
        <h1 className="mb-2 text-lg font-semibold">Hey, I'm here to help.</h1>
        <p className="leading-normal text-muted-foreground">{headerMsg}</p>
        {shouldShowExamples ? (
          <div className="mt-4 flex flex-col items-start space-y-2">
            {exampleMessages.map((message, index) => (
              <Button
                key={index}
                variant="link"
                className="h-auto p-0 text-base dark:text-white"
                onClick={() => setPromptInput(message.message)}
              >
                <ArrowRightIcon className="mr-2 text-muted-foreground" />
                {message.heading}
              </Button>
            ))}
          </div>
        ) : null}
        {shouldShowSyncButton ? (
          <SyncFilesButton
            projectSlug={projectSlug}
            onSync={() => {
              setIsSyncing(true);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
