import React from "react";
import { Metadata } from "next";
import { ReadmeCreatorContent } from "./_components/ReadmeCreatorContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Readme Creator for GitHub - CodeSapiens",
  description:
    "Easily craft compelling READMEs for your GitHub projects. CodeSapiens' Readme Creator simplifies the process of creating detailed, professional, and engaging documentation for your repositories.",
};

export default async function ReadmeCreatorPage() {
  return <ReadmeCreatorContent />;
}
