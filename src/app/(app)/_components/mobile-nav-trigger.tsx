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
          <img src="/logo.png" className="mr-2 w-7" />
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
