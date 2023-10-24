"use client";
import { Button } from "@/components/ui/button";
import { Process } from "@prisma/client";
import { useState } from "react";

export function ProcessItemLogs({ process }: { process: Process }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const logLines = (process?.logs ?? "").split("\n");
  return (
    <div className="overflow-x-auto">
      <Button
        className="p-0"
        variant="link"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? "🔙 Collapse logs" : "🧐 View logs"}
      </Button>
      {isExpanded ? (
        <div className="min-w-[1000px] max-w-[100%]">
          {logLines.map((line, index) => (
            <div
              key={index}
              className={`w-full px-2 py-1 ${
                index % 2 === 0 ? "bg-muted/50" : ""
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
