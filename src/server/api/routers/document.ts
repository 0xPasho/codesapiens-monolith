import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const CreateDocumentInput = z.object({
  content: z.any(),
  title: z.string(),
  folderPath: z.string(),
  repositoryId: z.string(),
  projectId: z.string(),
});

const UpdateDocumentInput = z.object({
  content: z.any(),
  title: z.string(),
  folderPath: z.string().optional(),
  documentId: z.string(),
});

const GetDocumentQuantityByProjectInput = z.object({
  projectId: z.string(),
  repositoryId: z.string().optional(),
});

const GetDocumentsByPathInput = z.object({
  documentSlug: z.string(),
  repositorySlug: z.string(),
});

const GetDocumentsByIdInput = z.object({
  documentId: z.string(),
  projectSlug: z.string(),
});

const GetDocumentByIdInput = z.object({
  documentId: z.string(),
});

const GetSpecificFileByPath = z.object({
  documentId: z.string(),
});

type BlockType = {
  type: "header" | "paragraph" | "list" | "code" | "table" | "linkTool";
  data: {
    text?: string;
    items?: string[];
    style?: "ordered";
    code?: string;
    content?: any;
    meta?: any;
    level?: number;
    link?: string;
  };
};

const processBlocksToText = (blocks: BlockType[]) => {
  let text = "";
  for (const block of blocks) {
    console.log({ block });
    switch (block.type) {
      case "header":
      case "paragraph":
        for (let i = 0; i < (block.data.level || 0); i++) {
          text += "#";
        }
        // First level should be ##, second level ### and so on...
        if (block.data.level > 0) {
          text += "# ";
        }
        text += block.data.text;
        break;
      case "linkTool":
        text += `[${block.data.meta.title}](${block.data.link})`;
        break;
      case "list":
        text += "\n";
        for (let i = 0; i < block.data.items!.length; i++) {
          const listTypeStyle =
            block.data.style === "ordered" ? `${i + 1}` : "-";
          text += `${listTypeStyle}. ${block.data.items![i]}\n`;
        }
        break;
      case "code":
        text += "```\n" + block.data.code + "\n```";
        break;
      case "table":
        text += JSON.stringify(block.data.content);
        break;
    }
    text += "\n\n";
  }
  return text;
};

export const documentRouter = createTRPCRouter({
  createDocument: protectedProcedure
    .input(CreateDocumentInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const content = processBlocksToText(input.content);
        console.log({ content });
        const repository = await ctx.db.repository.findFirst({
          where: {
            id: input.repositoryId,
          },
        });
        const newDoc = await ctx.db.document.create({
          data: {
            content,
            content_obj: input.content,
            title: input.title,
            path: "/",
            status: "active",
            synced: false,
            repositoryId: input.repositoryId,
            pathName: input.title,
            projectId: input!.projectId!,
          },
        });
        return newDoc;
      } catch (err) {
        console.log({ err });
      }
      return null;
    }),
  updateDocument: protectedProcedure
    .input(UpdateDocumentInput)
    .mutation(async ({ ctx, input }) => {
      const content = processBlocksToText(input.content);

      let dataToUpdate: any = {
        content,
        content_obj: input.content,
        title: input.title,
      };
      if (input.folderPath) {
        dataToUpdate = { ...dataToUpdate, path: input.folderPath };
      }
      const updatedDoc = await ctx.db.document.update({
        where: { id: input.documentId },
        data: dataToUpdate,
      });
      return updatedDoc;
    }),
  getDocumentQuantityByProject: protectedProcedure
    .input(GetDocumentQuantityByProjectInput)
    .query(async ({ ctx, input }) => {
      const extraSearch = input.repositoryId ? { id: input.repositoryId } : {};
      return ctx.db.document.count({
        where: {
          repository: {
            project: {
              id: input.projectId,
            },
            ...extraSearch,
          },
        },
      });
    }),
  getDocumentById: protectedProcedure
    .input(GetDocumentByIdInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findFirst({
        where: {
          id: input.documentId,
        },
      });
    }),
  getSpecificFileByPath: protectedProcedure
    .input(GetSpecificFileByPath)
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findFirst({
        where: {
          id: input.documentId,
        },
        include: {
          repository: true,
        },
      });
    }),
  getDocumentsById: publicProcedure
    .input(GetDocumentsByIdInput)
    .query(async ({ ctx, input }) => {
      const docs = await ctx.db.document.findMany({
        where: {
          id: input.documentId,
        },
      });

      let tempDocs = [];
      for (const doc of docs) {
        tempDocs.push({ ...docs, children: doc.isFolder ? [] : undefined });
      }
      return tempDocs;
    }),
  getDocumentsByPath: protectedProcedure
    .input(GetDocumentsByPathInput)
    .query(async ({ ctx, input }) => {
      const allSlugsTemp = [""].concat(input.slugs ?? []);
      const createHierarchy = async (
        slugs: string[],
        currentPosition: number,
      ) => {
        const slugsTemp = allSlugsTemp.slice(0, currentPosition);
        const searchPath = slugsTemp.join("/") + "/";
        const files = await ctx.db.document.findMany({
          where: {
            path: searchPath,
            repositoryId: input.repositorySlug,
          },
          // in the array, the folders will be first
          orderBy: {
            isFolder: "desc", // 'desc' will order true values before false values
          },
        });
        const itemIndex = files.findIndex(
          (item) =>
            item.path === searchPath &&
            item.pathName === slugs[currentPosition],
        );
        const tempFiles = [];
        for (const file of files) {
          tempFiles.push({ ...file, children: file.isFolder ? [] : undefined });
        }
        if (itemIndex === -1) {
          return tempFiles;
        }
        tempFiles[itemIndex] = {
          ...tempFiles[itemIndex],
          children:
            currentPosition < slugs.length
              ? await createHierarchy(slugs, currentPosition + 1)
              : [],
        };

        return tempFiles;
      };

      const hierarchy = createHierarchy(allSlugsTemp, 1);
      return hierarchy;
    }),
});
