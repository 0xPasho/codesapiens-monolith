import { Separator } from "@/components/ui/separator";
import { api } from "~/trpc/server";
import { BillingForm } from "./billing-information";
import { getOrgSubscriptionPlan } from "@/lib/subscription";
import { stripe } from "@/lib/stripe";

export default async function SettingsProfilePage() {
  const profileInfo = await api.users.getAuthenticatedUser.query();
  const subscriptionPlan = await getOrgSubscriptionPlan(
    profileInfo!.organizationId!,
  );

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false;
  if (
    subscriptionPlan.isInPlan &&
    subscriptionPlan.billing.stripeSubscriptionId
  ) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.billing.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-muted-foreground text-sm">
          Manage billing and your subscription plan.
        </p>
      </div>
      <Separator />
      <BillingForm
        subscriptionPlan={{
          ...subscriptionPlan,
          isCanceled,
        }}
      />
    </div>
  );
}
