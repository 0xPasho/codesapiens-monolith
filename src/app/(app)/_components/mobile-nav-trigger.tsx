"use client";

import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

const MobileNavTrigger = ({
  orgSlug,
  hasAuth = true,
}: {
  orgSlug: string;
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
        className={hasAuth ? "px-1 sm:hidden" : "px-1 md:hidden"}
      >
        {isMobileNavOpen ? (
          <PlusIcon className="rotate-45" />
        ) : (
          <img src="/logo.png" className="mr-2 w-7" />
        )}
        <span className="ml-1 text-lg font-semibold">Menu</span>
      </Button>
      {isMobileNavOpen ? (
        <MobileNav orgSlug={orgSlug} hasAuth={hasAuth} />
      ) : null}
    </>
  );
};

export default MobileNavTrigger;
