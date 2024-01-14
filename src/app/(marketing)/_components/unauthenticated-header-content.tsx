import { Button } from "@/components/ui/button";
import { LayersIcon, ListBulletIcon } from "@radix-ui/react-icons";
import {
  BadgeHelpIcon,
  CalendarCheck2Icon,
  Globe2Icon,
  ScanFaceIcon,
} from "lucide-react";
import Link from "next/link";
import MobileNavTrigger from "~/app/(app)/_components/mobile-nav-trigger";
import { siteConfig } from "~/config/site";

const items = [
  {
    title: "Pricing",
    href: "/pricing",
  },
];

export async function UnauthenticatedHeaderContent() {
  return (
    <header className="z-10 w-full">
      <nav
        aria-label="Global"
        className="flex w-full flex-row justify-between py-2 md:mt-4 md:px-4 lg:px-24"
      >
        <MobileNavTrigger orgSlug={""} items={items} hasAuth={false} />

        <div className="flex hidden flex-row items-center md:flex">
          <Link href={"/"} className="flex flex-row pr-3">
            <img src="/logo.png" className="mr-2 w-7" />

            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <Link href="#try">
            <Button
              className="text-md mx-4 hidden p-1 dark:text-white md:flex"
              variant="link"
            >
              <Globe2Icon className="mr-1.5 h-4 w-4" /> Explore
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              className="text-md mx-4 hidden p-1 dark:text-white md:flex"
              variant="link"
            >
              <LayersIcon className="mr-1.5 h-4 w-4" /> Pricing
            </Button>
          </Link>
          <Link href="https://twitter.com/codesapiens.ai" target="_blank">
            <Button
              className="text-md mx-4 hidden p-1 dark:text-white md:flex"
              variant="link"
            >
              <BadgeHelpIcon className="mr-1.5 h-4 w-4" /> Support
            </Button>
          </Link>
          <Link href="https://calendly.com/codesapiens/30min" target="_blank">
            <Button
              className="text-md ml-2 hidden p-1 dark:text-white md:flex"
              variant="link"
            >
              <CalendarCheck2Icon className="mr-1.5 h-4 w-4" /> Schedule a Demo
            </Button>
          </Link>
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
