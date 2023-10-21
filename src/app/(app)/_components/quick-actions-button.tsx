"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon, GroupIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { CreateNewOrganizationDialog } from "../account/_components/create-new-organization-dialog";

const QuickActionsButton = ({ orgSlug }: { orgSlug: string }) => {
  return (
    <div className="mr-2 flex hidden items-center space-x-1 rounded-md bg-secondary text-secondary-foreground md:flex">
      <Link href={`/org/${orgSlug}/new-doc`}>
        <Button variant="secondary" className="px-2 shadow-none">
          <PlusIcon className="mr-2 h-4 w-4" />
          New document
        </Button>
      </Link>
      <Separator
        orientation="vertical"
        className="h-[38px] bg-gray-300 dark:bg-gray-800"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="px-2 shadow-none">
            <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-5}
          className="w-[200px]"
          forceMount
        >
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <CreateNewOrganizationDialog>
            <DropdownMenuCheckboxItem>
              Create Organization
            </DropdownMenuCheckboxItem>
          </CreateNewOrganizationDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default QuickActionsButton;
