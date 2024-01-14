"use client";

import { useState } from "react";
import PlanCard from "./pricing-card";
import { redirectToStripe } from "../billing/utils";
import { StripeSuccessUrlType } from "@/lib/utils";
import { siteConfig } from "~/config/site";

export default function Pricing({
  currentPlan,
  from,
  orgSlug,
  onChoosePlan,
}: {
  currentPlan?: string;
  from: StripeSuccessUrlType;
  orgSlug: string;
  onChoosePlan: (selectedPlanName: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const plans = [
    {
      key: "free",
      title: "Free",
      price: "$0",
      isTheMostPopular: false,
      description: "No cost, full access to start",
      features: [
        "Ask a limited amount of questions to public repositories",
        `Access to our extension`,
        "Unlimited repository exploration",
        "Manual documentation can be created",
      ],
    },
    {
      key: "pro",
      title: "Pro",
      price: "$29",
      description: "Ideal for individuals or small teams",
      isTheMostPopular: true,
      features: [
        "Enjoy 500 questions monthly",
        `Full access to our powerful extension`,
        "Unlimited repository exploration",
        "Manual documentation is available",
        "1,500 file analyses per month",
        "Includes 5 seats for team access",
      ],
    },
    {
      key: "max",
      title: "Max",
      price: "$79",
      description: "Built for large teams and extensive documentation needs",
      isTheMostPopular: false,
      features: [
        "Enjoy 2,500 questions monthly",
        `Full access to our powerful extension`,
        "Unlimited repository exploration",
        "Manual documentation is available",
        "5,000 file analyses included",
        "10 seats to empower your team",
      ],
    },
  ];

  async function handleStripe(planItem?: any) {
    if (!isLoading) {
      setIsLoading(true);
    }
    try {
      await redirectToStripe({
        from,
        orgSlug,
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  return (
    <div className="mx-auto w-full">
      <div className="flex flex-col px-2 md:flex-row md:px-0">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            plan={plan}
            currentPlan={currentPlan}
            hasAuth={!!currentPlan}
            onChoosePlan={onChoosePlan}
          />
        ))}
      </div>
    </div>
  );
}
