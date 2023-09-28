"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { CreateNewOrganizationDialog } from "../account/_components/create-new-organization-dialog";

function OrgItem({
  org,
  onSelect,
  selectedOrg,
}: {
  org: any;
  onSelect: (org: any) => void;
  selectedOrg: any;
}) {
  return (
    <Link href={`/org/${org.organization.slug}`} key={org.organization.id}>
      <CommandItem onSelect={() => onSelect(org)} className="text-sm">
        <Avatar className="mr-2 h-5 w-5">
          <AvatarImage
            src={`https://avatar.vercel.sh/${org.organization.slug}.png`}
            alt={org.organization.name}
            className="grayscale"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        {org.organization.name}
        <CheckIcon
          className={cn(
            "ml-auto h-4 w-4",
            selectedOrg?.organization?.slug === org.organization.slug
              ? "opacity-100"
              : "opacity-0",
          )}
        />
      </CommandItem>
    </Link>
  );
}
export default function OrgSwitcher({ orgs }: { orgs: Array<any> }) {
  const [open, setOpen] = React.useState(false);
  const personalOrg = React.useMemo(() => {
    return orgs.find((org) => org.organization.isPersonal);
  }, [orgs]);

  const [selectedOrg, setSelectedOrg] = React.useState<any>(personalOrg);

  const otherOrgs = React.useMemo(() => {
    return orgs.filter((org) => !org.organization.isPersonal);
  }, [orgs]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an organization"
          className={"w-[200px] justify-between"}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${selectedOrg.organization.slug}.png`}
            />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          {selectedOrg.organization.name ?? "You"}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search organization..." />
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup key={"personal"} heading={"Personal Acount"}>
              <OrgItem
                org={{
                  ...personalOrg,
                  organization: {
                    ...personalOrg.organization,
                    name: personalOrg.organization.name ?? "You",
                  },
                }}
                onSelect={setSelectedOrg}
                selectedOrg={selectedOrg}
              />
            </CommandGroup>
            <CommandGroup key={"organizations"} heading={"Organizations"}>
              {otherOrgs.map((org) => (
                <OrgItem
                  org={org}
                  onSelect={setSelectedOrg}
                  selectedOrg={selectedOrg}
                />
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem>
              <CreateNewOrganizationDialog>
                <div className="flex w-full items-center">
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  <span>New Organization</span>
                </div>
              </CreateNewOrganizationDialog>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
