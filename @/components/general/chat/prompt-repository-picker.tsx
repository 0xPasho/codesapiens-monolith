"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "~/trpc/react";
import useChatStore, { ChatRepositoriesItems } from "./chat-context-provider";

export function PromptRepositoryPicker({
  orgSlug,
  projectSlug,
}: {
  orgSlug?: string;
  projectSlug?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const {
    repositoriesItems,
    setChatRepositories,
    setSelectedRepositoriesItem,
    selectedRepositoriesItem,
    resetExceptRepositoryItems,
  } = useChatStore();
  const { data: repositoriesByChatData } =
    api.chat.getRepositoriesByChat.useQuery({
      orgSlug,
      project_slug: projectSlug,
    });

  React.useEffect(() => {
    const reposToAdd: ChatRepositoriesItems[] =
      repositoriesByChatData?.map((repo) => ({
        value: repo.id,
        metadata: { isSynced: repo.processes.length === 0, hasDocuments: true },
        label:
          repo.repositoryType === "manual"
            ? "Manually added documents"
            : `${repo.repoOrganizationName}/${repo.repoProjectName}`,
      })) || [];

    reposToAdd.unshift({ value: "all", label: "All documents" });
    setChatRepositories(reposToAdd);
  }, [repositoriesByChatData]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mr-2 mt-2 w-full justify-between md:m-0 md:w-[10rem]"
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedRepositoriesItem
              ? repositoriesItems.find(
                  (repo) => repo.value === selectedRepositoriesItem,
                )?.label
              : "All documents"}
          </span>

          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[10rem] p-0">
        <Command>
          <CommandInput placeholder="Search repositories..." className="h-9" />
          <CommandEmpty>No repositories found.</CommandEmpty>
          <CommandGroup>
            {repositoriesItems.map((repo) => (
              <CommandItem
                key={repo.value}
                value={repo.value}
                onSelect={(currentValue) => {
                  resetExceptRepositoryItems();
                  setSelectedRepositoriesItem(currentValue);
                  setOpen(false);
                }}
              >
                {repo.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedRepositoriesItem === repo.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
