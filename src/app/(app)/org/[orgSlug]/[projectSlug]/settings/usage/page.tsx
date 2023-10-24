import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import UsageSSRContent from "./_components/usage-ssr-content";

export default async function ProjectUsageSettingsPage({
  params: { orgSlug, projectSlug },
}: {
  params: { orgSlug: string; projectSlug: string };
}) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <UsageSSRContent
      orgSlug={orgSlug}
      projectSlug={projectSlug}
      title="Project Usage"
      description="This is amount of questions asked by this project"
      type="project"
    />
  );
}
