import { Process } from "@prisma/client";

import { formatDate } from "@/lib/utils";
import { ProcessItemLogs } from "./process-item-logs";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export function ProcessItem({ process }: { process: Process }) {
  const status = useMemo(() => {
    if (process.startDate && process.endDate) {
      return "Completed";
    }
    return "In progress";
  }, [process]);

  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <span className="font-semibold">
          {process.repository?.title}
          <span className="text-sm text-muted-foreground">
            {"  · " + formatDate(process.startDate?.toDateString())}
          </span>
        </span>
        <div>
          <Badge>{status}</Badge>
        </div>
        <ProcessItemLogs process={process} />
      </div>
    </div>
  );
}
