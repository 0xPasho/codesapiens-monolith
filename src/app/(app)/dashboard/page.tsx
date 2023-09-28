import React from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard, Home Auth Page",
};

export default async function DashboardPage() {
  return <Button>This should be the content of Dashboard</Button>;
}
