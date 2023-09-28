"use client";

import * as React from "react";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CardDataModifier from "../_components/card-data-modifier";

export function BillingForm({ subscriptionPlan, className }: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const fireErrorMessage = (type?: string) => {
    switch (type) {
      case "UNAUTHORIZED":
        return {
          title: "Something went wrong.",
          description: "Please refresh the page and try again.",
        };
      case "RETRIEVE_SUBSCRIPTION_PLAN":
        return {
          title: "There was an error retreiving your plan.",
          description:
            "Please refresh the page and try again. If this issue persist please contact support.",
        };
      case "MISSING_PLAN":
        return {
          title: "Seems like there wasn't a plan selected",
          description:
            "Please refresh the page and try again. If this issue persist please contact support.",
        };
      case "CREATE_CHECKOUT_SESSION":
        return {
          title: "There was an error creating a checkout for your plan.",
          description:
            "Please refresh the page and try again If this issue persist please contact support..",
        };
      case "BILLING_URL":
        return {
          title: "There was an error getting the billing url for your plan",
          description:
            "Please refresh the page and try again. If this issue persist please contact support.",
        };

      default:
        return {
          title: "Something went wrong.",
          description: "Please refresh the page and try again.",
        };
    }
  };
  async function redirectToStripe(targetPlan?: string) {
    if (!isLoading) {
      setIsLoading(true);
    }
    try {
      // If there's a target plan it will be used to create a checkout session.
      // Otherwise, it will be used to create a portal session.
      const response = await fetch(
        `/api/stripe${targetPlan ? `?plan=${targetPlan}` : "?plan="}}`,
      );
      if (!response?.ok) {
        const errorMessages = fireErrorMessage(response.statusText);

        toast({
          ...errorMessages,
          variant: "destructive",
        });
        return;
      }

      // Redirect to the Stripe session.
      // This could be a checkout page for initial upgrade.
      // Or portal to manage existing subscription.
      const session = await response.json();
      if (session) {
        window.location.href = session.url;
      }
    } catch (e) {
      const errorMessages = fireErrorMessage();
      return toast({
        ...errorMessages,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardDataModifier
      title="Subscription Plan"
      description={`You are currently on the ${subscriptionPlan.plan.name} plan.`}
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
        </div>
      }
      footer={
        <div className="align-center flex flex-1 items-center justify-between">
          {subscriptionPlan.isInPlan ? (
            <Button
              variant="ghost"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={() => {
                redirectToStripe();
              }}
            >
              Manage Subscription
            </Button>
          ) : null}
          {subscriptionPlan.plan.name !== "max" ? (
            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={() => {
                redirectToStripe(
                  subscriptionPlan.plan.name === "free" ? "pro" : "max",
                );
              }}
            >
              {subscriptionPlan.plan.name === "free"
                ? "Upgrade to PRO plan"
                : "Upgrade to MAX plan"}
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
