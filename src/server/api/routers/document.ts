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
});

const UpdateDocumentInput = z.object({
  content: z.any(),
  title: z.string(),
  folderPath: z.string().optional(),
  documentId: z.string(),
});

const GetDocumentQuantityByProjectInput = z.object({
  projectId: z.string(),
});

const GetDocumentsByPathInput = z.object({
  slugs: z.array(z.string()).optional(),
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
  folderPath: z.string(),
  pathName: z.string(),
});

type BlockType = {
  type: "header" | "paragraph" | "list" | "code" | "table";
  data: {
    text?: string;
    items?: string[];
    style?: "ordered";
    code?: string;
    content?: any;
  };
};

const processBlocksToText = (blocks: BlockType[]) => {
  let text = "";
  for (const block of blocks) {
    switch (block.type) {
      case "header":
      case "paragraph":
        text += block.data.text;
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
  }
  return text;
};

export const documentRouter = createTRPCRouter({
  createDocument: protectedProcedure
    .input(CreateDocumentInput)
    .mutation(async ({ ctx, input }) => {
      const content = processBlocksToText(input.content);
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
        },
      });
      //const idDoc = newDoc.id;
      //const newDocPath = `/${input.folderPath}/${idDoc}`;

      // await ctx.db.document.update({
      //   where: { id: idDoc },
      //   data: {
      //     path: newDocPath,
      //   },
      // });
      // return { ...newDoc, path: newDocPath };
      return newDoc;
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
      return ctx.db.document.count({
        where: {
          repository: {
            project: {
              id: input.projectId,
            },
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
          pathName: input.pathName,
          path: input.folderPath,
        },
      });
    }),
  getDocumentsById: publicProcedure
    .input(GetDocumentsByIdInput)
    .query(async ({ ctx, input }) => {
      console.log({ todos: "xdxddd" });
      console.log({ todos: "xdxddd" });
      console.log({ todos: "xdxddd" });
      console.log({ todos: "xdxddd" });
      console.log({ todos: "xdxddd" });
      const docs = await ctx.db.document.findMany({
        where: {
          id: input.documentId,
        },
      });
      console.log({ manyu: "z xcjizx czx o" });
      console.log({ manyu: "z xcjizx czx o" });
      console.log({ manyu: "z xcjizx czx o" });

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
        console.log({ searchPath });
        console.log({ searchPath });
        console.log({ slugsTemp });
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
