import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export default UsageProjectLoading;
