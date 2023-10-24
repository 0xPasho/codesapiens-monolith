import { api } from "~/trpc/server";
import { Separator } from "@/components/ui/separator";
import { ProcessItem } from "./_components/process-item";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

export default async function ProjectUsageSettingsPage({
  params: { orgSlug, repoSlug, projectSlug },
}: {
  params: { orgSlug: string; projectSlug: string };
}) {
  const processes = await api.processes.getProcessesByProject.query({
    projectSlug,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Documents Sync History</h3>
        <p className="text-sm text-muted-foreground">
          See the history of documents sync
        </p>
      </div>
      <Separator />
      <div className="w-full space-y-2">
        {processes?.length > 0 ? (
          processes.map((process, index) => {
            return (
              <>
                {index > 0 ? <Separator /> : null}
                <ProcessItem process={process} />
              </>
            );
          })
        ) : (
          <EmptyPlaceholder className="border-none">
            <EmptyPlaceholder.Icon name="settings" />
            <EmptyPlaceholder.Title>Nothing to show!</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              There haven't been any documents sync yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  );
}
