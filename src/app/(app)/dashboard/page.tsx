import React from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard, Home Auth Page",
};

export default async function DashboardPage() {
  const user = await getServerAuthSession();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return <Button>This should be the content of Dashboard</Button>;
}
