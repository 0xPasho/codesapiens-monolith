import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "./_components/card-data-modifier-loading";

const ProfileLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Profile</h3>
      <p className="text-muted-foreground text-sm">
        This is how others will see you on the site.
      </p>
    </div>
    <Separator />
    {Array.from({ length: 3 }).map((_, i) => (
      <CardDataModifierLoading className="mt-4" />
    ))}
  </div>
);

export default ProfileLoading;
