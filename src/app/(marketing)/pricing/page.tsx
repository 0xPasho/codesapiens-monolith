import React from "react";
import { Metadata } from "next";
import { UnauthenticatedHeaderContent } from "../_components/unauthenticated-header-content";
import PricingInnerContent from "./PricingInnerContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Pricing Page",
  description: "Pricing Page",
};

export default async function PricingPage() {
  return (
    <>
      <UnauthenticatedHeaderContent />
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl">Upgrade Your Experience</h1>
          <p>
            Discover the perfect plan tailored for your needs. Unlock powerful
            features and more to elevate your business efficiency.
          </p>
          <PricingInnerContent />
        </div>
      </section>
    </>
  );
}
