"use client";

import { Button } from "@/components/ui/button";
import { WikiSidebarNav } from "../../_components/wiki-sidenav";
import { ArrowLeftIcon } from "lucide-react";

interface WikiLayoutProps {
  children: React.ReactNode;
  params: {
    orgSlug: string;
    projectSlug: string;
    repositorySlug: string;
    documentSlugs: string[];
  };
}

export default function WikiLayout({ children, params }: WikiLayoutProps) {
  return (
    <div className="min-h-[90vh] flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed z-30 hidden w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-0">
        <WikiSidebarNav {...params} />
      </aside>
      {children}
    </div>
  );
}
