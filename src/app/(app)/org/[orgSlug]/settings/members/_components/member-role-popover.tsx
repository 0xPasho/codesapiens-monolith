"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrganizationMemberRole } from "@prisma/client";

export function MemberRolePopover({
  role,
  onSelect,
  className,
  disableActions,
}: {
  role: OrganizationMemberRole;
  onSelect: (role: OrganizationMemberRole) => void;
  className?: string;
  disableActions?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disableActions}>
        <Button variant="outline" className={`${className}`}>
          {role}
          <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onClick={() => {
                  if (!disableActions) {
                    onSelect("member");
                  }
                }}
                className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
              >
                <p>Member</p>
                <p className="text-sm text-muted-foreground">
                  Can view, comment and edit.
                </p>
              </CommandItem>
              <CommandItem
                onClick={() => {
                  if (!disableActions) {
                    onSelect("owner");
                  }
                }}
                className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
              >
                <p>Owner</p>
                <p className="text-sm text-muted-foreground">
                  Admin-level access to all resources.
                </p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
