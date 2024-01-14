"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { WikiSidebarNav } from "../wiki-sidenav";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WikiLayoutProps {
  children: React.ReactNode;
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlug: string;
  };
}

export default function WikiLayout({ children, params }: WikiLayoutProps) {
  const [sideMenuOpened, setSideMenuOpened] = useState(false);
  return (
    <div className="flex min-h-[90vh] flex-1 flex-col md:grid md:grid-cols-[220px_1fr] md:flex-row md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside
        className={` ${
          sideMenuOpened ? "" : "hidden"
        }  fixed z-30 max-h-[65vh] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 sm:max-h-full md:sticky md:block lg:py-0`}
      >
        <WikiSidebarNav
          {...params}
          onPressHide={() => {
            setSideMenuOpened(false);
          }}
        />
      </aside>
      <div className="mt-4 flex sm:hidden">
        <Button
          className="text-md flex w-full text-center sm:hidden"
          variant="link"
          onClick={() => {
            setSideMenuOpened(true);
          }}
        >
          <HamburgerMenuIcon className="mr-2 h-6 w-6" /> File List Menu
        </Button>
      </div>
      {children}
    </div>
  );
}
