import Link from "next/link";
import { siteConfig } from "~/config/site";
import OrgSwitcherWrapper from "./org-switcher-wrapper";
import HeaderProfileButton from "./header-profile-button";
import QuickActionsButton from "./quick-actions-button";
import MobileNavTrigger from "./mobile-nav-trigger";
import { Badge } from "@/components/ui/badge";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "New document",
    href: "/org/[orgSlug]/new-doc",
  },
];

export async function HeaderContent({
  orgSlug,
  session,
}: {
  orgSlug: string;
  session: any;
}) {
  return (
    <header className="border-slate-6 bg-slate-1/5 w-full  border-b backdrop-blur-lg">
      <nav
        aria-label="Global"
        className="flex w-full flex-row justify-between px-4 py-2 md:px-12"
      >
        <MobileNavTrigger
          orgSlug={orgSlug || session?.user.orgSlug}
          items={items}
        />

        <div className="flex hidden flex-row items-center sm:flex">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex flex-row pr-3"
          >
            <img src="/logo.png" className="mr-2  w-7" />
            <span className="font-bold">{siteConfig.name}</span>
            <Badge
              variant="ghost"
              className="ml-1 mt-0 px-0.5 py-0.5 text-[8px]"
            >
              <span className="text-[8px]">BETA</span>
            </Badge>
          </Link>
          <span className="hidden pr-3 font-bold sm:inline-block">/</span>
          <OrgSwitcherWrapper orgSlug={orgSlug || session?.user.orgSlug} />
        </div>
        <div className="flex flex-row">
          <QuickActionsButton orgSlug={orgSlug || session?.user.orgSlug} />

          <HeaderProfileButton session={session} />
        </div>
      </nav>
    </header>
  );
}
