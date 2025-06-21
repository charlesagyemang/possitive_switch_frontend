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
  asChild,
}: {
  children?: React.ReactNode;
  title?: string;
  tip?: string;
  message?: string;
  asChild?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent>{title || tip || message}</TooltipContent>
    </Tooltip>
  );
}

export default CustomTooltip;
