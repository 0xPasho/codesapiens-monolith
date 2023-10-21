"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import React from "react";
import Pricing from "../_components/pricing";

export default function UpgradePlanModal({
  isVisible,
  onVisibleChange,
}: {
  isVisible: boolean;
  onVisibleChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        onVisibleChange(open);
      }}
    >
      <DialogContent className="max-h-[75vh] overflow-y-auto sm:max-w-[850px]">
        <h1 className="mt-4 text-4xl font-bold">Upgrade Your Experience</h1>
        <span>
          Discover the perfect plan tailored for your needs. Unlock powerful
          features and more to elevate your business efficiency.
        </span>
        <Pricing currentPlan="free" />
      </DialogContent>
    </Dialog>
  );
}
