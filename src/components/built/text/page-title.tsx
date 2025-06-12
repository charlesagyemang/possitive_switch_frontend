import { IconNode, type LucideIcon } from "lucide-react";
import React from "react";

function PageTitle({
  title,
  description,
  Icon,
}: {
  title?: string;
  description?: string;
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center">
      {Icon && <Icon className="mr-4 h-14 w-14 text-gray-300" />}
      <div>
        <h2 className="text-3xl font-bold text-primary">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default PageTitle;
