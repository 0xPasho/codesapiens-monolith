import UsageSSRContent from "../../org/[orgSlug]/[projectSlug]/settings/usage/_components/usage-ssr-content";
import { api } from "~/trpc/server";
export default async function AccountUsageSettingsPage() {
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
