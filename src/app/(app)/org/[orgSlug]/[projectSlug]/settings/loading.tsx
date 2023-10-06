import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "~/app/(app)/account/_components/card-data-modifier-loading";

const ProjectProfileLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Projects</h3>
      <p className="text-sm text-muted-foreground">
        This is the projects profile.
      </p>
    </div>
    <Separator />
    {Array.from({ length: 3 }).map((_, i) => (
      <CardDataModifierLoading className="mt-4" />
    ))}
  </div>
);

export default ProjectProfileLoading;
