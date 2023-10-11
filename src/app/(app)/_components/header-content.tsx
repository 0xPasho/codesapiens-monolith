import Link from "next/link";
import { siteConfig } from "~/config/site";
import OrgSwitcherWrapper from "./org-switcher-wrapper";
import HeaderProfileButton from "./header-profile-button";
import { getServerAuthSession } from "~/server/auth";
import QuickActionsButton from "./quick-actions-button";

export async function HeaderContent({ orgSlug }: { orgSlug: string }) {
  const session = await getServerAuthSession();
  return (
    <header className="border-slate-6 bg-slate-1/5 w-full  border-b backdrop-blur-lg">
      <nav
        aria-label="Global"
        className="flex w-full flex-row justify-between px-12 py-2"
      >
        <div className="flex flex-row items-center">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex flex-row pr-3"
          >
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
            <span className="hidden font-bold sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>
          <span className="hidden pr-3 font-bold sm:inline-block">/</span>
          <OrgSwitcherWrapper orgSlug={orgSlug} />
        </div>
        <div className="flex flex-row">
          <QuickActionsButton orgSlug={orgSlug} />

          <HeaderProfileButton session={session} />
        </div>
      </nav>
    </header>
  );
}
