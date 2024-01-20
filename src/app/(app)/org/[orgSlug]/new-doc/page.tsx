import { Metadata } from "next";
import { Editor } from "./_components/editor";

export const metadata: Metadata = {
  title: "New Document Page",
  description: "New Document Page",
};

export default async function NewDocumentPage({
  params: { orgSlug },
  headers,
}: {
  params: { orgSlug: string };
  headers: any;
}) {
  console.log({ headers });
  console.log({ headers });
  return <Editor orgSlug={orgSlug} />;
}
