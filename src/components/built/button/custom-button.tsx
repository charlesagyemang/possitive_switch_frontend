import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import React from "react";
type addons = {
  loading?: boolean;
};
function CustomButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> &
    addons
) {
  const { loading, children, className, ...rest } = props;
  return (
    <Button className={`flex items-center cursor-pointer ${className || ""}`} {...rest}>
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  );
}

export default CustomButton;
