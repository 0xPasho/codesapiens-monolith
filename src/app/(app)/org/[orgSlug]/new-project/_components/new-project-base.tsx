"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewProjectBase = ({
  title,
  description,
  children,
  step,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  step: number;
}) => {
  return (
    <div className="mt-8  flex w-full justify-center">
      <div className="flex w-[850px] max-w-full flex-col">
        {step > 0 ? (
          <Link href="../">
            <Button variant="link">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go back
            </Button>
          </Link>
        ) : null}
        <RadioGroup
          orientation="horizontal"
          className="align-center mb-4 flex flex-row justify-center"
        >
          <div className="flex flex-row items-center space-x-2 ">
            <RadioGroupItem value="repository" checked={step > 0} />
            <Label htmlFor="repository">Select Repository</Label>
          </div>
          <Separator orientation="vertical" className="mx-2" />
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="details"
              checked={step > 1}
              className={`${step < 1 ? "border-gray-500" : ""}`}
            />
            <Label
              htmlFor="details"
              className={`${step < 1 ? "text-gray-500" : ""}`}
            >
              Project Details
            </Label>
          </div>
        </RadioGroup>
        <h1 className="text-center text-4xl">{title}</h1>
        <h2 className="mb-6 text-center text-2xl text-gray-400">
          {description}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default NewProjectBase;
