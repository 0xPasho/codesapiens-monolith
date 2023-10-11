import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Editor } from "./_components/editor";

export default async function NewDocumentPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return <Editor orgSlug={orgSlug} />;
}
