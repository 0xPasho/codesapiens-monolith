import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useLockBody } from "@/lib/hooks/use-lock-body";
import { siteConfig } from "~/config/site";
import OrgSwitcherWrapperMobile from "./org-switcher-wrapper-mobile";

interface MobileNavProps {
  children?: React.ReactNode;
  orgSlug?: string;
  items: {
    title: string;
    href: string;
  }[];
  hasAuth?: boolean;
}

export function MobileNav({
  children,
  orgSlug,
  items,
  hasAuth,
}: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
        <img src="/logo.png" className="mr-2 w-7" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {hasAuth ? <OrgSwitcherWrapperMobile orgSlug={orgSlug} /> : null}
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href.replace("[orgSlug]", orgSlug || "")}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
