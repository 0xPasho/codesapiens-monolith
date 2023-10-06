"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    url: "/org/[orgSlug]/[projectSlug]",
    label: "❓ Overview/Ask",
    id: "overview",
  },
  {
    url: "/org/[orgSlug]/[projectSlug]/wiki",
    label: "🌍 Wiki/Sources",
    id: "wiki",
  },
  {
    url: "/org/[orgSlug]/[projectSlug]/settings",
    label: "🛠️ Settings",
    id: "settings",
  },
];
export default function ProjectLayout({
  children,
  params: { projectSlug, orgSlug },
}: {
  children: React.ReactNode;
  params: { projectSlug: string; orgSlug: string };
}) {
  const [currentSelectedTab, setCurrentSelectedTab] = useState("overview");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.endsWith("/wiki")) {
      setCurrentSelectedTab("wiki");
    } else if (pathname?.endsWith("/settings")) {
      setCurrentSelectedTab("settings");
    } else if (currentSelectedTab !== "overview") {
      setCurrentSelectedTab("overview");
    }
  }, [pathname, currentSelectedTab]);

  return (
    <div className="w-full">
      <div
        className="justify-star flex w-full px-8 pt-2"
        style={{ justifyContent: "start" }}
      >
        <NavigationMenu className="flex">
          <NavigationMenuList>
            {menuItems.map((item) => (
              <div
                className={`border-b border-b-2 ${
                  currentSelectedTab === item.id
                    ? "border-b-white"
                    : "border-b-transparent"
                } pb-1`}
              >
                <NavigationMenuItem>
                  <Link
                    href={item.url
                      .replace("[orgSlug]", orgSlug)
                      .replace("[projectSlug]", projectSlug)}
                    legacyBehavior
                    passHref
                    className="p-0"
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle() + "px-1"}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </div>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator className="w-full" />
      {children}
    </div>
  );
}
