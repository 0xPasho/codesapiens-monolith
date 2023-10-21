import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "~/app/(app)/account/_components/card-data-modifier-loading";

const UsageProjectLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Project Usage</h3>
      <p className="text-sm text-muted-foreground">
        This is amount of questions asked by this project
      </p>
    </div>
    <Separator />
    {Array.from({ length: 2 }).map((_, i) => (
      <CardDataModifierLoading className="mt-4" />
    ))}
  </div>
);

export default UsageProjectLoading;
