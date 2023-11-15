import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useChat } from "./chat-context-provider";
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
}: {
  chat: any;
  projectSlug: string;
}) {
  const { setPromptInput } = useChat();
  console.log({ chat });
  console.log({ chat });
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <img src="/logo.png" className="mb-2 w-24" />
        <h1 className="mb-2 text-lg font-semibold">Hey, I'm here to help.</h1>
        <p className="leading-normal text-muted-foreground">
          {chat?.processes?.length
            ? chat.processes?.some((item) => !item.endDate)
              ? "Files are still being synced"
              : "You can start a conversation with this smart monkey by asking for example"
            : `This project don't have any synced file, you can ask questions but for results related to the project you need to sync files first.`}
        </p>
        {chat.processes?.length &&
        chat.processes.every((item) => item.endDate) ? (
          <div className="mt-4 flex flex-col items-start space-y-2">
            {exampleMessages.map((message, index) => (
              <Button
                key={index}
                variant="link"
                className="h-auto p-0 text-base"
                onClick={() => setPromptInput(message.message)}
              >
                <ArrowRightIcon className="mr-2 text-muted-foreground" />
                {message.heading}
              </Button>
            ))}
          </div>
        ) : (
          <SyncFilesButton projectSlug={projectSlug} className="mt-4" />
        )}
      </div>
    </div>
  );
}
