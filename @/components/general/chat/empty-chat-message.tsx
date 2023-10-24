import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useChat } from "./chat-context-provider";

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

export function EmptyScreen() {
  const { setPromptInput } = useChat();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Hey, ask me anything!</h1>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
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
      </div>
    </div>
  );
}
