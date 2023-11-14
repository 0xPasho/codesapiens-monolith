import UsageSSRContent from "../../[projectSlug]/settings/usage/_components/usage-ssr-content";

export default async function ProjectUsageSettingsPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  return (
    <UsageSSRContent
      orgSlug={orgSlug}
      title="Org Usage"
      description="This is the usage of the org"
      type="org"
    />
  );
}
