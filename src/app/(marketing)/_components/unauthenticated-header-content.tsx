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
            <img src="/logo.png" className="mr-2 w-7" />

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
