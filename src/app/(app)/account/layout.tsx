"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
const menuItems = [
  { url: "/account", label: "General" },
  { url: "/account/billing", label: "Billing" },
  { url: "/account/projects", label: "Projects" },
  { url: "/account/notifications", label: "Notifications" },
];
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-row">
      <h1 className="py-8 text-center text-2xl md:text-4xl">
        Personal information
      </h1>
      <Separator className="w-full" />
      <div className="flex w-full justify-center py-6">
        <div className="flex w-[1024px] max-w-full flex-row">
          <div className="flex flex-col">
            <NavigationMenu
              orientation="vertical"
              className="flex flex-col justify-start"
            >
              <NavigationMenuList className="flex flex-col">
                {menuItems.map((item) => (
                  <NavigationMenuItem className="mb-4">
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex flex-1 flex-col px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
