import { api } from "~/trpc/server";
import { Separator } from "@/components/ui/separator";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import UsageBarChart from "./_components/UsageBar";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";
import OrgUsageContent from "./_components/OrgUsageContent";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function ProjectUsageSettingsPage({
  params: { orgSlug, projectSlug },
}: {
  params: { orgSlug: string; projectSlug: string };
}) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const data = await api.billing.getUsageGraph.query({
    orgSlug,
  });

  let questionsData = [];
  let filesData = [];
  let questionsSum = 0;
  let filesSum = 0;

  for (const item of data.graph) {
    questionsData.push({
      value: item.totalQuestionsUsed,
      title: item.projectSlug,
    });
    filesData.push({ value: item.totalFiles, title: item.projectSlug });

    questionsSum += item.totalQuestionsUsed;
    filesSum += item.totalFiles;
  }

  if (data.org?.planMaxQuestions) {
    questionsData.unshift({
      value:
        questionsSum > data.org.planMaxQuestions
          ? 0
          : data.org.planMaxQuestions - questionsSum,
      title: "Remaining questions",
      isUnprocessedItem: true,
    });
  }

  if (data.org?.planMaxProcessedFiles) {
    filesData.unshift({
      value:
        filesSum > data.org.planMaxProcessedFiles
          ? 0
          : data.org.planMaxProcessedFiles - filesSum,
      title: "Remaining processed files",
      isUnprocessedItem: true,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Project Usage</h3>
        <p className="text-sm text-muted-foreground">
          This is amount of questions asked by this project
        </p>
      </div>
      <Separator />
      <div>
        <Link href={`/org/${orgSlug}/settings/billing`}>
          <Button variant="link" className="px-1 py-0">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go to organization
            billing
          </Button>
        </Link>
        <div>
          <span>
            This project is under the organization's{" "}
            <b>{data.org.currentPlan?.toLowerCase()}</b> plan. If you want to
            limit the usage of this project, go to the organization's billing
            page.
          </span>
        </div>
      </div>
      <OrgUsageContent
        projectSlug={projectSlug}
        filesData={filesData}
        questionsData={questionsData}
      />
    </div>
  );
}
