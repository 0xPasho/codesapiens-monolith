import * as React from "react";
import Textarea from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import Link from "next/link";
import { ArrowUp, SearchCodeIcon } from "lucide-react";
import useChatStore from "./chat-context-provider";

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  orgSlug: string;
  projectSlug: string;
  isPublicChat?: boolean;
  error: string | null;
}

export function PromptForm({
  orgSlug,
  projectSlug,
  onSubmit,
  isLoading,
  isPublicChat,
  error,
}: PromptProps) {
  const { promptInput, setPromptInput } = useChatStore();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current && !isPublicChat) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!promptInput?.trim()) {
          return;
        }
        await onSubmit(promptInput);
        setPromptInput("");
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pl-2 pr-8 sm:rounded-md sm:border sm:pr-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={!!error}
          value={promptInput}
          onChange={(e: any) => setPromptInput(e.target.value)}
          placeholder="Ask something"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || promptInput === ""}
                >
                  <ArrowUp />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {isPublicChat ? null : (
        <Link href={`/org/${orgSlug}/${projectSlug}/wiki`}>
          <Button variant="link" className="w-full text-center dark:text-white">
            <SearchCodeIcon className="mr-2 h-4 w-4" /> Not sure what to search?
            Look at the wiki
          </Button>
        </Link>
      )}
    </form>
  );
}
