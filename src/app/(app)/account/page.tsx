import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { api } from "~/trpc/server";

export default async function SettingsProfilePage() {
  const profileInfo = await api.users.getAuthenticatedUser.query();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm profileInfo={profileInfo} />
    </div>
  );
}
