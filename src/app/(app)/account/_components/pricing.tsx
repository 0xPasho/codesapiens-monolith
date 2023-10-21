"use client";

import { useState } from "react";
import PlanCard from "./pricing-card";
import { redirectToStripe } from "../billing/utils";

export default function Pricing({
  currentPlan,
  from,
  orgSlug,
}: {
  currentPlan?: string;
  from: "user" | "org";
  orgSlug: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const plans = [
    {
      key: "free",
      title: "Free",
      price: "$0",
      isTheMostPopular: false,
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
    },
    {
      key: "pro",
      title: "Pro",
      price: "$39",
      isTheMostPopular: true,
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
    },
    {
      key: "max",
      title: "Max",
      price: "$99",
      isTheMostPopular: false,
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
    },
  ];

  async function handleStripe(planItem?: any) {
    if (!isLoading) {
      setIsLoading(true);
    }
    try {
      await redirectToStripe({
        targetPlan: planItem.key,
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
            onManagePlan={handleStripe}
            onUpgrade={handleStripe}
            onDowngrade={() => {}}
            onGetStarted={() => {
              // never should be called
            }}
            onChoosePlan={handleStripe}
          />
        ))}
      </div>
    </div>
  );
}
