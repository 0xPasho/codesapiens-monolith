import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import UsageSSRContent from "../../org/[orgSlug]/[projectSlug]/settings/usage/_components/usage-ssr-content";
import { api } from "~/trpc/server";
export default async function AccountUsageSettingsPage() {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const profileInfo = await api.users.getAuthenticatedUser.query();

  return (
    <UsageSSRContent
      orgSlug={profileInfo?.defaultOrganization?.slug}
      title="Your Usage"
      description="This is the your usage"
      type="user"
    />
  );
}
