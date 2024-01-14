"use client";
import Pricing from "~/app/(app)/account/_components/pricing";
import { env } from "~/env.mjs";

const PricingInnerContent = () => {
  return (
    <Pricing
      orgSlug=""
      from="personal"
      onChoosePlan={() => {
        const baseUrl = `${env.NEXT_PUBLIC_APP_URL}/login?from=/account/billing`;
        //const encodedUrl = encodeURIComponent(`/account/billing`);
        window.location.href = `${baseUrl}`;
      }}
      currentPlan=""
    />
  );
};

export default PricingInnerContent;
