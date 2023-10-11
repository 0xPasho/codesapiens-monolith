"use client";
import { WikiProvider } from "../_components/wiki-context";
import { WikiSidebarNav } from "../_components/wiki-sidenav";

interface WikiLayoutProps {
  children: React.ReactNode;
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
  };
}

export default function WikiLayout({ children, params }: WikiLayoutProps) {
  return (
    <WikiProvider>
      <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
          <WikiSidebarNav {...params} />
        </aside>
        {children}
      </div>
    </WikiProvider>
  );
}
