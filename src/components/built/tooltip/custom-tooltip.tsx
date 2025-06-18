import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

function CustomTooltip({
  children,
  title,
  tip,
  message,
}: {
  children?: React.ReactNode;
  title?: string;
  tip?: string;
  message?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{title || tip || message}</TooltipContent>
    </Tooltip>
  );
}

export default CustomTooltip;
