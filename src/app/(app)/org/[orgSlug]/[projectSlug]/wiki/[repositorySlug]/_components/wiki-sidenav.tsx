"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useWikiContext } from "./wiki-context";
import { api } from "~/trpc/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  FileIcon,
  Folder,
  FolderIcon,
  Workflow,
} from "lucide-react";
import { Document } from "@prisma/client";
import { Tree } from "@/components/ui/three";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface WikiSidebarNavProps {
  orgSlug: string;
  projectSlug: string;
  repositorySlug: string;
  documentSlugs: string[];
}

export function WikiSidebarNav({
  orgSlug,
  projectSlug,
  repositorySlug,
  documentSlugs,
}: WikiSidebarNavProps) {
  const documentSlug = documentSlugs?.[0];
  const {
    menuItems,
    setMenuItems,
    updateLeafById,
    setCurrentSelectedMenuItem,
    initialLoadDone,
    setInitialLoadDone,
  } = useWikiContext();
  const router = useRouter();
  const [leafLoading, setLeafLoading] = useState<string | undefined>(undefined);

  const firstCallMade = useRef(false);
  const getHierarchyFromLeaf = async (document: Document) => {
    setLeafLoading(document.id);
    try {
      const wikiNavigatorList = await fetch("/api/wiki-navigator-list", {
        method: "POST",
        body: JSON.stringify({
          repositorySlug,
          docId: document.id,
        }),
      });
      const hierarchy = await wikiNavigatorList.json();
      updateLeafById(document.id, hierarchy.documents);
      setLeafLoading(undefined);
    } catch (e) {}
  };

  const getHierarchy = async () => {
    try {
      const wikiNavigatorList = await fetch("/api/wiki-recursive-navigation", {
        method: "POST",
        body: JSON.stringify({
          repositorySlug,
          documentSlug,
        }),
      });
      const hierarchyResponse = await wikiNavigatorList.json();
      //    const hierarchy = await getDocumentsByPathAsync();
      setMenuItems(hierarchyResponse.hierarchy ?? []);
      // Only redirect if no documentSlug is provided
      if (documentSlug) return;

      // console.log({
      //   shallow: `/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}${hierarchy.data?.[0].path}${hierarchy.data?.[0].pathName}`,
      // });
      // router.replace(
      //   `/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}${hierarchy.data?.[0].path}${hierarchy.data?.[0].pathName}`,
      // );
    } catch (e) {
    } finally {
      setInitialLoadDone(true);
    }
  };

  useEffect(() => {
    if (firstCallMade.current) return;
    firstCallMade.current = true;
    getHierarchy();
  }, [getHierarchy]);

  const initialSelectedItem = useMemo(() => {
    const readme = menuItems.find(
      (item) => item.pathName?.toLowerCase()?.startsWith("readme"),
    );
    if (readme) return readme.id;
    return documentSlug || menuItems[0]?.id;
  }, [menuItems]);

  if (!initialLoadDone) {
    return (
      <div className="mt-2 px-4">
        <h1 className="mt-4 text-lg font-bold">File list</h1>
        <Separator className="mb-1 mt-2" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton className={`${i > 0 ? "mt-4" : ""} h-6 w-full`} />
        ))}
      </div>
    );
  }

  return menuItems.length ? (
    <div className="mt-2 px-4">
      <h1 className="mt-4 text-lg font-bold">File list</h1>
      <Separator className="mb-1 mt-2" />
      <Tree
        data={menuItems}
        initialSelectedItemId={initialSelectedItem}
        onSelectChange={(item) => {
          if (!item) throw "no item";
          getHierarchyFromLeaf(item);
          if (item.isFolder) return;
          setCurrentSelectedMenuItem(item);
          // router.push(
          //   `/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}/${item.id}`,
          // );
        }}
        leafLoading={leafLoading}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center p-2">
      <span className="flex text-center text-lg font-bold">
        No items to show
      </span>
      <span className="flex text-center">
        Go ahead and create a new document
      </span>
      <Link href={`/org/${orgSlug}/new-doc`}>
        <Button className="mt-4">Create new document</Button>
      </Link>
    </div>
  );
}
