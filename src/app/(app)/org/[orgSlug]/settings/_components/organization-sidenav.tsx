"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  orgSlug: string;
  projectSlug?: string;
  items: {
    href: string;
    title: string;
  }[];
}

export function OrganizationSidebarNav({
  className,
  items,
  orgSlug,
  projectSlug,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 overflow-auto lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        let link = item.href.replace("[orgSlug]", orgSlug);
        if (projectSlug) {
          link = link.replace("[projectSlug]", projectSlug);
        }
        return (
          <Link
            key={`link-item-${index}-${link}`}
            href={link}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === link
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
