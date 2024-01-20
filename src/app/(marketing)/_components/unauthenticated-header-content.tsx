import { Button } from "@/components/ui/button";

import Link from "next/link";
import MobileNavTrigger from "~/app/(app)/_components/mobile-nav-trigger";
import { siteConfig } from "~/config/site";
import { ScanFaceIcon } from "lucide-react";
import LinkItemsMenuDisplayer from "./link-items-menu-displayer";
import { Badge } from "@/components/ui/badge";

export async function UnauthenticatedHeaderContent() {
  return (
    <header className="z-10 w-full">
      <nav
        aria-label="Global"
        className="flex w-full flex-row justify-between py-2 md:mt-4 md:px-4 lg:px-24"
      >
        <MobileNavTrigger orgSlug={""} hasAuth={false} />

        <div className="flex hidden flex-row items-center md:flex">
          <Link href={"/"} className="flex flex-row pr-3">
            <img src="/logo.png" className="mr-2 w-7" />

            <span className="font-bold">{siteConfig.name}</span>
            <Badge
              variant="ghost"
              className="ml-1 mt-0 px-0.5 py-0.5 text-[8px]"
            >
              <span className="text-[8px]">BETA</span>
            </Badge>
          </Link>
          <LinkItemsMenuDisplayer mobile={false} />
        </div>
        <div className="flex flex-row">
          <Link href="/login" className="flex flex-row pr-3">
            <Button variant="default">
              <ScanFaceIcon className="mr-1.5 h-4 w-4" /> Log in
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
