"use client";

import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useState } from "react";
import { PlusIcon, SidebarCloseIcon } from "lucide-react";

const MobileNavTrigger = ({
  orgSlug,
  items,
  hasAuth = true,
}: {
  orgSlug: string;
  items: {
    title: string;
    href: string;
  }[];
  hasAuth?: boolean;
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsMobileNavOpen(!isMobileNavOpen);
        }}
        variant="secondary"
        className="px-1 sm:hidden"
      >
        {isMobileNavOpen ? (
          <PlusIcon className="rotate-45" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-6 w-6"
          >
            <rect width="256" height="256" fill="none"></rect>
            <line
              x1="208"
              y1="128"
              x2="128"
              y2="208"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></line>
            <line
              x1="192"
              y1="40"
              x2="40"
              y2="192"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></line>
          </svg>
        )}
        <span className="ml-1 text-lg font-semibold">Menu</span>
      </Button>
      {isMobileNavOpen ? (
        <MobileNav orgSlug={orgSlug} items={items} hasAuth={hasAuth} />
      ) : null}
    </>
  );
};

export default MobileNavTrigger;
