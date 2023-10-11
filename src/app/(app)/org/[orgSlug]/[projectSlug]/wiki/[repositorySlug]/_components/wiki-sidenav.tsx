"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useWikiContext } from "./wiki-context";
import { api } from "~/trpc/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  FileIcon,
  Folder,
  FolderIcon,
  Workflow,
} from "lucide-react";
import { Document } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Tree } from "@/components/ui/three";

export interface WikiSidebarNavProps {
  orgSlug: string;
  projectSlug: string;
  repositorySlug: string;
  slug: Array<string>;
}

export function WikiSidebarNav({
  orgSlug,
  projectSlug,
  repositorySlug,
  slug,
}: WikiSidebarNavProps) {
  const { menuItems, setMenuItems, updateLeafById } = useWikiContext();
  const [leafLoading, setLeafLoading] = useState<string | undefined>(undefined);
  const pathname = slug?.join("/") || "";
  let goBackPathname = "";
  const firstCallMade = useRef(false);
  if (pathname) {
    const pathArray = pathname.split("/");
    pathArray.pop();
    goBackPathname = pathArray.join("/");
  }
  const fileNameOrFolderFromUrl = slug?.[slug.length - 1] || "";
  const currentSelectedMenuItem = menuItems.find(
    (item) => item.pathName === fileNameOrFolderFromUrl,
  );
  const { refetch: getDocumentsByPathAsync } =
    api.document.getDocumentsByPath.useQuery(
      {
        slugs: slug,
        repositorySlug,
      },
      {
        refetchOnMount: false,
        retry: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
      },
    );

  const getHierarchyFromLeaf = async (document: Document) => {
    setLeafLoading(document.id);
    const wikiNavigatorList = await fetch("/api/wiki-navigator-list", {
      method: "POST",
      body: JSON.stringify({
        projectSlug,
        docId: document.id,
      }),
    });
    const hierarchy = await wikiNavigatorList.json();
    updateLeafById(document.id, hierarchy.documents);
  };

  const getHierarchy = async () => {
    const hierarchy = await getDocumentsByPathAsync();
    console.log({ hierarchy });
    setMenuItems(hierarchy.data ?? []);
  };

  useEffect(() => {
    if (firstCallMade.current) return;
    firstCallMade.current = true;
    getHierarchy();
  }, [getHierarchy]);

  return menuItems.length ? (
    <div className="w-full px-4">
      {(pathname && currentSelectedMenuItem?.isFolder) ||
      (!currentSelectedMenuItem?.isFolder && slug?.length > 1) ? (
        <div className="mb-2">
          <Link
            href={`/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}/${goBackPathname}`}
          >
            <Button variant="ghost" className="w-full px-1">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go back
            </Button>
          </Link>
        </div>
      ) : null}

      <Tree
        data={menuItems}
        className="h-[460px] w-[200px] flex-shrink-0 border-[1px]"
        initialSlelectedItemId="f12"
        onSelectChange={(item) => getHierarchyFromLeaf(item)}
        folderIcon={Folder}
        itemIcon={Workflow}
        leafLoading={leafLoading}
      />
    </div>
  ) : null;
}

export function WikiDocsSidebarNavItem({
  orgSlug,
  projectSlug,
  repositorySlug,
  item,
  onClickItem,
}: {
  orgSlug: string;
  projectSlug: string;
  repositorySlug: string;
  item: Document;
  onClickItem?: (item: Document) => void;
}) {
  const { currentSelectedMenuItem, setCurrentSelectedMenuItem } =
    useWikiContext();

  const remainingSlug = `${item.path ? `${item.path}/` : ""}${item.pathName}`;
  return (
    <Link
      href={`/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}/${remainingSlug}`}
      onClick={() => {
        setCurrentSelectedMenuItem(item);
        onClickItem?.(item);
      }}
      className={`flex w-full items-center rounded-md p-2 hover:underline ${
        currentSelectedMenuItem?.id === item.id ? "bg-muted" : ""
      }`}
    >
      {item.isFolder ? (
        <FolderIcon className="mr-2 h-4 w-4" />
      ) : (
        <FileIcon className="color-gray-500 mr-2 h-4 w-4" />
      )}{" "}
      {item.title}
    </Link>
  );
}
