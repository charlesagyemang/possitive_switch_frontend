import { LoaderCircle } from "lucide-react";
import React from "react";

function LoadingState({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-6 px-10 flex items-center gap-2">
      <LoaderCircle className="animate-spin text-primary font-medium" />{" "}
      {children ? children : "Loading company details..."}
    </div>
  );
}

export default LoadingState;
