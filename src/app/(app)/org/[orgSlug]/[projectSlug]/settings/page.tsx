import { api } from "~/trpc/server";
import { Separator } from "@/components/ui/separator";
import ProjectInformation from "./_components/project-information";

export default async function ProjectSettingsPage({
  params: { orgSlug, projectSlug },
}: {
  params: { orgSlug: string; projectSlug: string };
}) {
  const projectInfo = await api.projects.getProjectBySlugs.query({
    orgSlug,
    projectSlug,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Information</h3>
        <p className="text-sm text-muted-foreground">
          This is the project information.
        </p>
      </div>
      <Separator />
      <ProjectInformation
        orgSlug={orgSlug}
        projectSlug={projectSlug}
        projectInfo={projectInfo}
      />
    </div>
  );
}
