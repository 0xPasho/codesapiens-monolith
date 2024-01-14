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
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  ArrowLeftIcon,
  HistoryIcon,
  SearchCodeIcon,
  Settings2Icon,
  WholeWordIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WikiProvider } from "./wiki/[repositorySlug]/_components/wiki-context";

export default function ProjectLayout({
  children,
  params: { projectSlug, orgSlug },
}: {
  children: React.ReactNode;
  params: { projectSlug: string; orgSlug: string };
}) {
  const pathname = usePathname();
  const getRoute = () => {
    const pathnameSplit = pathname?.split("/");
    const currentSelectedTabByPath = pathnameSplit?.[4];

    if (currentSelectedTabByPath === "wiki") {
      return "wiki";
    } else if (currentSelectedTabByPath === "settings") {
      return "settings";
    } else if (currentSelectedTabByPath === "history") {
      return "history";
    }
    return "overview";
  };
  const [currentSelectedTab, setCurrentSelectedTab] = useState(getRoute());

  const menuItems = [
    {
      url: "/org/[orgSlug]/[projectSlug]",
      label: "Ask the Docs",
      id: "overview",
      icon: <ChatBubbleIcon className="mr-2 h-4 w-4" />,
    },
    {
      url: "/org/[orgSlug]/[projectSlug]/wiki",
      label: "Wiki, Docs and Repositories",
      id: "wiki",
      icon: <SearchCodeIcon className="mr-2 h-4 w-4" />,
    },
    {
      url: "/org/[orgSlug]/[projectSlug]/history",
      label: "Chat History",
      id: "history",
      icon: <HistoryIcon className="mr-2 h-4 w-4" />,
    },
    {
      url: "/org/[orgSlug]/[projectSlug]/settings",
      label: "Settings",
      id: "settings",
      icon: <Settings2Icon className="mr-2 h-4 w-4" />,
    },
  ];

  useEffect(() => {
    const route = getRoute();
    setCurrentSelectedTab(route);
  }, [getRoute]);

  return (
    <WikiProvider>
      <div className="w-full">
        <div
          className="flex w-full overflow-x-auto px-8 pt-2"
          style={{ justifyContent: "start" }}
        >
          <NavigationMenu className="flex">
            <NavigationMenuList>
              <Link
                href={`/org/${orgSlug}`}
                legacyBehavior
                passHref
                className="p-0"
              >
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "-mt-2 mr-2 px-2",
                  )}
                >
                  <ArrowLeftIcon />
                </NavigationMenuLink>
              </Link>
              {menuItems.map((item) => (
                <div
                  className={`border-b border-b-2 ${
                    currentSelectedTab === item.id
                      ? "border-b-black dark:border-b-white"
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
                        className={navigationMenuTriggerStyle() + "px-1 "}
                      >
                        {item.icon}
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
    </WikiProvider>
  );
}
