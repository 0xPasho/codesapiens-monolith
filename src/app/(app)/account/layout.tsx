import { Metadata } from "next";
import Image from "next/image";

import { SidebarNav } from "./components/sidebar-nav";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "User Settings screen",
  description: "Screen for user settings",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account",
  },
  {
    title: "Billing",
    href: "/account/billing",
  },
  {
    title: "Appearance",
    href: "/account/appearance",
  },
  {
    title: "Notifications",
    href: "/account/notifications",
  },
  {
    title: "Display",
    href: "/account/display",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="bg-background overflow-hidden rounded-[0.5rem] border shadow">
      {/*<div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
  </div>*/}
      <div className=" space-y-6 p-10 pb-16 md:block">
        <div className="mx-auto justify-center space-y-0.5 lg:max-w-2xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Settings
          </h2>
          <p className="text-muted-foreground text-center">
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
