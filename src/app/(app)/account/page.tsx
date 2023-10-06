import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { api } from "~/trpc/server";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function SettingsProfilePage() {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const profileInfo = await api.users.getAuthenticatedUser.query();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm profileInfo={profileInfo} />
    </div>
  );
}
