"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { api } from "~/trpc/react";

type Props = {
  children?: React.ReactNode;
};

const TrpcProvider = ({ children }: Props) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default api.withTRPC(TrpcProvider);
