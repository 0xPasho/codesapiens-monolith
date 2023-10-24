import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { db } from "~/server/db";

type Payload = {
  documentSlug?: string;
  repositorySlug: string;
};

const createHierarchy = async (
  parentId: string | null,
  repositorySlug: string,
  innerList: any[],
  previousParentId?: string | null,
) => {
  let foundWithParentId = await db.document.findMany({
    where: {
      parentId,
      repositoryId: repositorySlug,
    },
  });

  // Needed to be able to correctly have the logic in the three component
  const tempData = [];
  for (const item of foundWithParentId) {
    tempData.push({ ...item, children: item.isFolder ? [] : undefined });
  }
  foundWithParentId = tempData;

  const folderInfo = !parentId
    ? null
    : await db.document.findFirst({
        where: {
          id: parentId,
        },
      });

  if (previousParentId) {
    const previousParentIndex = foundWithParentId.findIndex(
      (item) => item.id === previousParentId,
    );
    if (previousParentIndex !== -1) {
      foundWithParentId[previousParentIndex] = {
        ...foundWithParentId[previousParentIndex],
        children: innerList ?? [],
      };
    }
  }

  return !folderInfo || parentId === null || parentId === undefined
    ? foundWithParentId
    : await createHierarchy(
        folderInfo.parentId,
        repositorySlug,
        foundWithParentId,
        parentId,
      );
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "UNAUTHORIZED" });
  }

  const data: Payload = await req.json();
  const repositorySlug = data?.repositorySlug;
  const documentSlug = data?.documentSlug;
  if (!repositorySlug) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  let parentId: string | null = null;
  let initialList: any = [];
  if (documentSlug) {
    const document = await db.document.findFirst({
      where: {
        id: documentSlug,
      },
    });

    if (!document) {
      return new Response(null, {
        status: 404,
        statusText: "Not Found",
      });
    }
    parentId = document.parentId;
    initialList = await db.document.findMany({
      where: {
        parentId: document.parentId,
      },
    });
  }

  const completeHierarchy = await createHierarchy(
    parentId,
    repositorySlug,
    initialList,
  );

  return NextResponse.json({
    hierarchy: completeHierarchy,
  });
}
