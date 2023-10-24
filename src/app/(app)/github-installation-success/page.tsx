import React from "react";
import { Metadata } from "next";
import GithubInstallationSuccessContent from "./_components/GithubInstallationSuccessContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Github Permissions Success Page",
  description: "Github Permissions Success Page",
};

export default async function GithubInstallationSuccessPage() {
  return <GithubInstallationSuccessContent />;
}
