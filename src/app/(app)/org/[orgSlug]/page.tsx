import React from "react";
import { Metadata } from "next";
import OrgsPageContent from "./_components/OrgsPageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Org Page",
  description: "Org Page",
};

export default async function OrgsSlugPage() {
  return <OrgsPageContent />;
}
