import { api } from "~/trpc/server";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import OrgUsageContent from "./org-usage-content";

export default async function UsageSSRContent({
  orgSlug,
  projectSlug,
  title,
  description,
  type,
}: {
  orgSlug: string;
  projectSlug?: string;
  title: string;
  description: string;
  type: "project" | "org" | "user";
}) {
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
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description} </p>
      </div>
      <Separator />
      <div>
        {type === "project" ? (
          <Link href={`/org/${orgSlug}/settings/billing`}>
            <Button variant="link" className="px-1 py-0">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go to organization
              billing
            </Button>
          </Link>
        ) : null}
        {type === "project" ? (
          <div>
            <span>
              This project is under the organization's{" "}
              <b>{data.org.currentPlan?.toLowerCase()}</b> plan. If you want to
              limit the usage of this project, go to the organization's billing
              page.
            </span>
          </div>
        ) : type === "org" ? (
          <div>
            <span>
              This project is under <b>{data.org.currentPlan?.toLowerCase()}</b>{" "}
              plan. If you want to limit the usage of this project, go to the
              Billing tab.
            </span>
          </div>
        ) : (
          <div>
            <span>
              You are under <b>{data.org.currentPlan?.toLowerCase()}</b> plan.
              If you want to limit the usage of this project, go to the Billing
              tab.
            </span>
          </div>
        )}
      </div>
      <OrgUsageContent
        projectSlug={projectSlug}
        filesData={filesData}
        questionsData={questionsData}
      />
    </div>
  );
}
