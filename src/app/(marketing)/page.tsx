import React from "react";
import { Metadata } from "next";
import LandingDefaultContent from "../_components/landing-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing Page",
};

export default async function LandingPage() {
  return <LandingDefaultContent />;
}
