"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditorJS, { OutputBlockData } from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import * as z from "zod";

import "~/styles/editor.css";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/general/icons";
import NewDocumentExtraInfoModal from "./new-document-extra-info-modal";
import { api } from "~/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";

interface EditorProps {
  documentId?: string;
  title?: string;
  content?: any;
  orgSlug: string;
}

export const DocumentPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
});

type FormData = z.infer<typeof DocumentPatchSchema>;

export function Editor({ documentId, title, content, orgSlug }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(DocumentPatchSchema),
  });
  const ref = React.useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [editorIsReady, setEditorIsReady] = React.useState<boolean>(false);
  const [outputInsertBlocks, setOutputInsertBlocks] = React.useState<
    OutputBlockData<string, any>[] | undefined
  >();
  const [insertTitle, setInsertTitle] = React.useState<string>("");

  const createDocumentMutation = api.document.updateDocument.useMutation({
    onSuccess(data) {
      toast({
        title: "Document updated successfully",
        description: "Your document was been updated successfully",
      });
      router.refresh();
      setIsSaving(false);
    },
    onError() {
      toast({
        title: "Error saving document",
        description:
          "Something went wrong while saving your document. Please try again later.",
      });
      setIsSaving(false);
    },
  });

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          setEditorIsReady(true);
          ref.current = editor;
          ref.current.blocks.insertMany(content);
        },
        placeholder: "Type here to write your document...",
        inlineToolbar: true,
        data: content, //body.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, [content]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const handleUpdateDoc = (blocks) => {
    createDocumentMutation.mutate({
      documentId: documentId!,
      title: title!,
      content: blocks,
    });
  };

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    const blocks = await ref.current?.save();
    if (!documentId) {
      setInsertTitle(data.title);
      setOutputInsertBlocks(blocks?.blocks);
      return;
    }
    handleUpdateDoc(blocks?.blocks);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mt-8  flex w-full justify-center">
      <div className="flex w-[850px] max-w-full flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-10">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-10">
                <Link
                  href=".."
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </>
                </Link>
              </div>
              <Button
                isLoading={isSaving}
                type="submit"
                className={cn(buttonVariants())}
                disabled={!editorIsReady}
              >
                <span>Save</span>
              </Button>
            </div>
            <div className="prose prose-stone dark:prose-invert mx-auto w-[800px]">
              <TextareaAutosize
                autoFocus
                id="title"
                placeholder="Post title"
                className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                {...register("title")}
                defaultValue={title}
              />
              <div
                id="editor"
                className={` ${editorIsReady ? "min-h-[500px]" : "h-0"}`}
              />
              {!editorIsReady ? (
                <Skeleton className="mt-4 min-h-[500px] w-full" />
              ) : null}

              <p className="text-sm text-gray-500">
                Use{" "}
                <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                  Tab
                </kbd>{" "}
                to open the command menu.
              </p>
            </div>
          </div>
        </form>
      </div>
      {Boolean(outputInsertBlocks) ? (
        <NewDocumentExtraInfoModal
          isVisible
          onVisibleChange={(open) => {
            if (!open) {
              setOutputInsertBlocks(undefined);
              setIsSaving(false);
            }
          }}
          blocks={outputInsertBlocks}
          orgSlug={orgSlug}
          title={insertTitle}
        />
      ) : null}
    </div>
  );
}
