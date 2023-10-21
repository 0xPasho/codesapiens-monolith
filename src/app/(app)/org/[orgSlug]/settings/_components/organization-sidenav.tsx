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
    icon: React.ReactNode;
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
        "flex space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-1",
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
              "h-auto justify-start px-2 py-0 md:h-9 md:px-4",
            )}
          >
            {item.icon}
            <span className="flex-1">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
