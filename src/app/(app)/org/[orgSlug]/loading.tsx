import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "../../account/_components/card-data-modifier-loading";
import { Button } from "@/components/ui/button";

const OrgProjectsLoading = () => (
  <div className="flex flex-col p-10 pb-16">
    <div className="mx-auto justify-center space-y-0.5 pb-4 lg:max-w-2xl">
      <div className="flex  flex-row justify-center">
        <h2 className="mr-2 text-center text-2xl font-bold tracking-tight">
          Projects
        </h2>
        <Button disabled>New Project</Button>
      </div>
      <p className="text-center text-muted-foreground">
        Your current list of projects in this organization.
      </p>
    </div>
    <Separator />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardDataModifierLoading
          className="mt-4"
          key={`skeleton-org-item-${i}`}
        />
      ))}
    </div>
  </div>
);

export default OrgProjectsLoading;
