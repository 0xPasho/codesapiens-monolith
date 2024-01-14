"use client";

import * as React from "react";

import { StripeSuccessUrlType, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CardDataModifier from "../_components/card-data-modifier";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import UpgradePlanModal from "./upgrade-plan-modal";
import { redirectToStripe } from "./utils";
import { SubscriptionPlan } from "types";

export function BillingForm({
  subscriptionPlan,
  className,
  from,
  orgSlug,
}: {
  from: StripeSuccessUrlType;
  subscriptionPlan: any & { isCancelled?: boolean };
  orgSlug?: string;
  className?: string;
}) {
  const params = useSearchParams();
  // st = stripeStatus
  const stripeStatus = params.get("st");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { toast } = useToast();
  const errorStripeFired = React.useRef(false);

  React.useEffect(() => {
    if (stripeStatus === "fail" && !errorStripeFired.current) {
      errorStripeFired.current = true;
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  }, [stripeStatus]);

  return (
    <>
      <CardDataModifier
        title={<h1 className="text-xl">Subscription Plan</h1>}
        description={
          <span>
            You are currently on the{" "}
            <b className="font-bold">{subscriptionPlan.plan.name}</b> plan.
          </span>
        }
        content={
          <div>
            <span>{subscriptionPlan.description}</span>
            {subscriptionPlan.isInPlan ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
              </p>
            ) : null}
            {stripeStatus === "fail" ? (
              <p className="text-sm text-red-500">
                Payment failed or cancelled. If this is an error, please try
                again or contact support.
              </p>
            ) : null}
            {subscriptionPlan.plan.name === "free" ? (
              <span className="text-sm">
                <span className="block">Upgrade to next plan and get</span>
                <span className="block">
                  <b>✓</b> More questions
                </span>
                <span className="block">
                  <b>✓</b> More processed files
                </span>
                <span className="block">
                  <b>✓</b> More users seats
                </span>
              </span>
            ) : null}
          </div>
        }
        footer={
          <div className="align-center flex flex-1 flex-col items-center justify-between sm:flex-row">
            {subscriptionPlan.isInPlan ? (
              <Button
                variant="ghost"
                disabled={isLoading}
                isLoading={isLoading}
                onClick={() => {
                  redirectToStripe({
                    orgSlug,
                    from: "personal",
                  });
                }}
              >
                Manage Subscription
              </Button>
            ) : (
              <div></div>
            )}

            {subscriptionPlan.plan.name === "free" ||
            subscriptionPlan.plan.name === "pro" ? (
              <Button
                disabled={isLoading}
                //className="mt-4 bg-yellow-400 text-black sm:mt-0"
                className="mt-4 inline-flex h-9 transform items-center justify-center rounded-md bg-gradient-to-r from-yellow-400 to-yellow-300 px-4 py-2 text-sm font-medium text-black shadow-lg transition-all duration-150 ease-in-out hover:scale-105 hover:from-yellow-300 hover:to-yellow-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:mt-0"
                isLoading={isLoading}
                onClick={async () => {
                  setIsModalVisible(true);
                  if (subscriptionPlan.plan.name === "free") {
                    return redirectToStripe({
                      from,
                      orgSlug,
                    });
                  }
                  setIsLoading(true);
                  const params = `?orgSlug=${orgSlug}&from=${from}&plan=max&actionType=upgrade`;
                  await fetch(`/api/stripe${params}`);
                  setIsLoading(false);
                }}
              >
                <span
                  className="mr-1 text-lg"
                  style={{
                    textShadow: "1px 2px 2px black",
                  }}
                >
                  ✨
                </span>
                {subscriptionPlan.plan.name === "free"
                  ? "Upgrade to next plan"
                  : "Upgrade to next plan"}
              </Button>
            ) : subscriptionPlan.plan.name === "max" ? (
              <Link href="/support">
                <Button variant="link" className="px-1">
                  Need custom plan? Contact us
                </Button>
              </Link>
            ) : (
              <span>
                You are in custom plan, if you need help{" "}
                <a href="/support">contact us</a>
              </span>
            )}
          </div>
        }
      />
      <UpgradePlanModal
        isVisible={isModalVisible}
        onVisibleChange={setIsModalVisible}
        from={from}
        onChoosePlan={async (newPlan) => {
          const isUpgradeFromFree =
            subscriptionPlan.plan.name === "free" &&
            (newPlan === "pro" || newPlan === "max");
          const isUpgradeFromPro =
            subscriptionPlan.plan.name === "pro" && newPlan === "max";
          let params = `?from=${from}`;
          if (orgSlug) {
            params += "&orgSlug=" + orgSlug;
          }
          const isUpgrade = isUpgradeFromFree || isUpgradeFromPro;
          if (isUpgrade) {
            params += "&callIntent=upgrade";
          }
          // if it's not an upgrade
          // and it's not the same plan
          // then it means it's a downgrade
          else if (newPlan !== subscriptionPlan.plan.name) {
            params += "&downgradeTo=" + newPlan;
          }
          const response = await fetch(`/api/stripe${params}`);

          const data = await response.json();

          if (data.url) {
            window.location.href = data.url;
          }
          setIsLoading(false);
        }}
        orgSlug={orgSlug}
        currentPlan={subscriptionPlan.plan.name}
      />
    </>
  );
}
