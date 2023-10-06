"use client";
import { GithubConnectButton } from "@/components/general/github/connect-to-github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

const GithubOrgPicker = ({
  selectedOrg,
  isOpen,
  onSelect,
  orgs,
}: {
  selectedOrg: any;
  isOpen: boolean;
  onSelect: (org: any) => void;
  orgs: any;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Select a Github Organization"
          className={"w-[200px] justify-between"}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={selectedOrg?.account?.avatar_url} />
            <AvatarFallback>GA</AvatarFallback>
          </Avatar>
          {selectedOrg?.account?.login}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Find Github org" />
          <CommandList>
            <CommandEmpty>No github org found.</CommandEmpty>
            <CommandItem>
              <GithubConnectButton onlyChildren>
                <div className="flex w-full items-center px-2 py-2">
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  <span>Connect Github Organization</span>
                </div>
              </GithubConnectButton>
            </CommandItem>
            <CommandGroup heading="Organizations">
              {orgs.map((org, index) => (
                <CommandItem
                  className="text-sm"
                  key={`github-org-${index}`}
                  onSelect={() => onSelect(org)}
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      alt={org.account.login}
                      src={org.account.avatar_url}
                    />
                    <AvatarFallback>GA</AvatarFallback>
                  </Avatar>
                  {`${org.account.login}`}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrg?.account?.login === org.account.login
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GithubOrgPicker;
