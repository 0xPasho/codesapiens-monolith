import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "~/app/(app)/account/_components/card-data-modifier-loading";

const OrgProfileLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Profile</h3>
      <p className="text-sm text-muted-foreground">
        This is the organization profile.
      </p>
    </div>
    <Separator />
    {Array.from({ length: 3 }).map((_, i) => (
      <CardDataModifierLoading className="mt-4" />
    ))}
  </div>
);

export default OrgProfileLoading;
