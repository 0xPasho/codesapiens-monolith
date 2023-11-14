import { Editor } from "./_components/editor";

export default async function NewDocumentPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  return <Editor orgSlug={orgSlug} />;
}
