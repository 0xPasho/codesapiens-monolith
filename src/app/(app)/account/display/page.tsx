import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "./display-form";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function SettingsDisplayPage() {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <p className="text-sm text-muted-foreground">
          Turn items on or off to control what&apos;s displayed in the app.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  );
}
