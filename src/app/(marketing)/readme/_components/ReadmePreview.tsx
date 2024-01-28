"use client";
import Markdown from "marked-react";
import { useState } from "react";
import { ReadmePreviewItemPopover } from "./ReadmePreviewItemPopover";

const ReadmePreviewItem = ({ text }: { text: string }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => {
        setIsMouseOver(false);
      }}
    >
      <Markdown value={text} />
      <ReadmePreviewItemPopover isOpen={isMouseOver} />
    </div>
  );
};

export { ReadmePreviewItem };
