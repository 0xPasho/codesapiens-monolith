import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "~/app/(app)/account/_components/card-data-modifier-loading";

const Loading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Display</h3>
      <p className="text-sm text-muted-foreground">
        Turn items on or off to control what&apos;s displayed in the app.
      </p>
    </div>
    <Separator />
    {Array.from({ length: 2 }).map((_, i) => (
      <CardDataModifierLoading className="mt-4" />
    ))}
  </div>
);

export default Loading;
