import { Metadata } from "next";
import Image from "next/image";

import { SidebarNav } from "./components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { FaceIcon, PersonIcon } from "@radix-ui/react-icons";
import { BellIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "User Settings screen",
  description: "Screen for user settings",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account",
    icon: <PersonIcon className="mr-2 h-4 w-4" />,
  },
  {
    title: "Billing",
    href: "/account/billing",
    icon: <span className="mr-2 w-2 w-4 text-xs">💸</span>,
  },
  {
    title: "Appearance",
    href: "/account/appearance",
    icon: <FaceIcon className="mr-2 w-2 w-4" />,
  },
  {
    title: "Notifications",
    href: "/account/notifications",
    icon: <BellIcon className="mr-2 w-2 w-4" />,
  },
  // {
  //   title: "Display",
  //   href: "/account/display",
  // },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <div className=" space-y-6 p-2 pb-16 sm:p-10 md:block">
        <div className="mx-auto justify-center space-y-0.5 lg:max-w-2xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Settings
          </h2>
          <p className="text-center text-muted-foreground">
            Manage your account settings, billing and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="mx-auto flex flex-col justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 ">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
