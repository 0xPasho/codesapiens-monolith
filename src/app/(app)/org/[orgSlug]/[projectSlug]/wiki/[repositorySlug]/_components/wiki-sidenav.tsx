"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  console.log(slug?.[slug.length - 1]);
  console.log(slug?.[slug.length - 1]);
  console.log(slug?.[slug.length - 1]);
  console.log(slug);
  console.log(slug);
  console.log(slug);
  const {
    menuItems,
    setMenuItems,
    updateLeafById,
    setCurrentSelectedMenuItem,
  } = useWikiContext();
  const [leafLoading, setLeafLoading] = useState<string | undefined>(undefined);
  const pathname = slug?.join("/") || "";
  const router = useRouter();
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
    // setCurrentSelectedMenuItem(hierarchy.data?.[0]);
    if (slug || slug[0]) return;
    console.log({
      shallow: `/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}${hierarchy.data?.[0].path}${hierarchy.data?.[0].pathName}`,
    });
    router.replace(
      `/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}${hierarchy.data?.[0].path}${hierarchy.data?.[0].pathName}`,
    );
  };

  useEffect(() => {
    if (firstCallMade.current) return;
    firstCallMade.current = true;
    getHierarchy();
  }, [getHierarchy]);

  return menuItems.length ? (
    <div className="w-full px-4">
      <Tree
        data={menuItems}
        className="h-[460px] w-[200px] flex-shrink-0 border-[1px]"
        initialSlelectedItemId={slug ? slug[0] : menuItems[0]?.id}
        onSelectChange={(item) => {
          getHierarchyFromLeaf(item);
          router.push(
            `/org/${orgSlug}/${projectSlug}/wiki/${repositorySlug}${item.path}${item.pathName}`,
          );
        }}
        folderIcon={Folder}
        itemIcon={Workflow}
        leafLoading={leafLoading}
      />
    </div>
  ) : null;
}
