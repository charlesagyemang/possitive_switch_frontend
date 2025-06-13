import { type LucideIcon } from "lucide-react";
import React from "react";

function PageTitle({
  title,
  description,
  Icon,
  customIcon,
}: {
  title?: string;
  description?: string;
  Icon?: LucideIcon;
  customIcon?: () => any;
}) {
  const renderIcon = () => {
    if (customIcon) return customIcon();

    return Icon && <Icon className="mr-4 h-14 w-14 text-violet-100" />;
  };
  return (
    <div className="flex items-center">
      {renderIcon()}
      {/* {Icon && <Icon className="mr-4 h-14 w-14 text-gray-300" />} */}
      <div>
        <h2 className="text-4xl font-bold text-primary">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default PageTitle;
