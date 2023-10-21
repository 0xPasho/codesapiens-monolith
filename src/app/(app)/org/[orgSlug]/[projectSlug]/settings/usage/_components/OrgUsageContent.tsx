"use client";

import UsageBarChart from "./UsageBar";
import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";

export default async function OrgUsageContent({
  filesData,
  questionsData,
  projectSlug,
}: {
  filesData: any;
  questionsData: any;
  projectSlug?: string;
}) {
  return (
    <>
      <CardDataModifier
        title="Files Usage"
        description="This is the files usage on this project"
        content={<UsageBarChart projectSlug={projectSlug} data={filesData} />}
      />
      <CardDataModifier
        title="Questions Usage"
        description="This is the files usage on this project"
        content={
          <UsageBarChart projectSlug={projectSlug} data={questionsData} />
        }
      />
    </>
  );
}
