import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "~/app/(app)/account/_components/card-data-modifier-loading";

const UsageProjectLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Org Usage</h3>
      <p className="text-sm text-muted-foreground">
        This is the usage of the org
      </p>
    </div>
    <Separator />
    {Array.from({ length: 2 }).map((_, i) => (
      <CardDataModifierLoading className="mt-4" />
    ))}
  </div>
);

export default UsageProjectLoading;
