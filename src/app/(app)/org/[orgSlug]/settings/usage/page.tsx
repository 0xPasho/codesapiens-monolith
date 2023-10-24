import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import UsageSSRContent from "../../[projectSlug]/settings/usage/_components/usage-ssr-content";

export default async function ProjectUsageSettingsPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <UsageSSRContent
      orgSlug={orgSlug}
      title="Org Usage"
      description="This is the usage of the org"
      type="org"
    />
  );
}
