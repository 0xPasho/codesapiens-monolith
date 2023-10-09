import { Separator } from "@/components/ui/separator";
import { api } from "~/trpc/server";
import { getOrgSubscriptionPlan } from "@/lib/subscription";
import { stripe } from "@/lib/stripe";
import { BillingForm } from "~/app/(app)/account/billing/billing-information";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function BillingProfilePage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const orgInfo = await api.organizations.getOrgBySlug.query({ orgSlug });
  const subscriptionPlan = await getOrgSubscriptionPlan(orgInfo?.id!);

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
        <p className="text-sm text-muted-foreground">
          Manage billing and the organization subscription plan.
        </p>
      </div>
      <Separator />
      <BillingForm
        orgSlug={orgSlug}
        subscriptionPlan={{
          ...subscriptionPlan,
          isCanceled,
        }}
        from="org"
      />
    </div>
  );
}
