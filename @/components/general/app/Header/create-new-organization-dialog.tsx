"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons";
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
import Link from "next/link";
import { CreateNewOrganizationDialog } from "~/app/(app)/account/_components/create-new-organization-dialog";

type OrgItem = {
  value: string;
  label: string;
};

export function OrgPicker({ orgMembers }: { orgMembers: any }) {
  const router = useParams();
  const orgSlug = (router?.orgSlug ?? "") as string;
  const [open, setOpen] = React.useState(false);
  const [selectedOrg, setSelectedOrgs] = React.useState<OrgItem | null>(null);

  const orgOptions = React.useMemo(() => {
    const tempData = orgMembers.data ?? [];
    return tempData.map((orgMember) => ({
      value: orgMember.organization.slug,
      label: orgMember.organization.name,
    }));
  }, [orgMembers.data]);

  const findOrg = React.useCallback(
    (findingSlug: string) => {
      return (
        orgOptions?.find((orgMember) => orgMember.value === findingSlug) ?? null
      );
    },
    [orgOptions],
  );

  React.useEffect(() => {
    if (orgSlug) {
      setSelectedOrgs(findOrg(orgSlug));
    }
  }, [orgSlug, findOrg]);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="max-w-[250px] justify-start pr-2"
          >
            <span className="pr-2">
              {selectedOrg ? (
                <>{selectedOrg.label}</>
              ) : (
                <>{"<select your org>"}</>
              )}
            </span>
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Find org" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Orgs">
                <CommandItem>
                  <CreateNewOrganizationDialog>
                    <div className="flex w-full items-center">
                      <PlusCircledIcon className="mr-2 h-4 w-4" />
                      <span>New Organization</span>
                    </div>
                  </CreateNewOrganizationDialog>
                </CommandItem>
                {orgOptions.map((org, index) => (
                  <Link href={`/org/${org.value}`}>
                    <CommandItem
                      key={`org-${org.value}-${index}`}
                      onSelect={(value) => {
                        setSelectedOrgs(findOrg(value));
                        setOpen(false);
                      }}
                    >
                      <span>
                        {`${org.label} `}
                        <span className="text-gray-500">{`(${org.value})`}</span>
                      </span>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
