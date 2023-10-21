import { Button } from "@/components/ui/button";
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
    <header className="border-slate-6 bg-slate-1/5 w-full  border-b backdrop-blur-lg">
      <nav
        aria-label="Global"
        className="flex w-full flex-row justify-between px-4 py-2 md:px-12"
      >
        <MobileNavTrigger orgSlug={""} items={items} hasAuth={false} />

        <div className="flex hidden flex-row items-center sm:flex">
          <Link href={"/"} className="flex flex-row pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-6 w-6"
            >
              <rect width="256" height="256" fill="none"></rect>
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
            </svg>
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <Link href="/pricing">
            <Button className="hidden p-1 md:flex" variant="link">
              Pricing
            </Button>
          </Link>
        </div>
        <div className="flex flex-row">
          <Link href="/login" className="flex flex-row pr-3">
            <Button variant="default">Sign in</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
