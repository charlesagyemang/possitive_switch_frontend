import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import React from "react";
type addons = {
  loading?: boolean;
};
function CustomButton(props: React.ComponentProps<"button"> & addons) {
  const { loading, children, className, ...rest } = props;
  return (
    <Button className={`flex items-center ${className || ""}`} {...rest}>
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  );
}

export default CustomButton;
