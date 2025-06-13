import { Candidate, CandidateInvitation } from "@/app/seed/candidates";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"; // Adjust the import path as needed
import React from "react";
import {
  AsDropdownMenu,
  DOption,
} from "@/components/built/dropdown/custom-dropdown";
import { MoreVertical } from "lucide-react";

const candidateColumnHelper = createColumnHelper<CandidateInvitation>();

const statusColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  signed: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  orrientation: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  onboarding: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  completed: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
  },
  default: {
    bg: "bg-gray-50",
    text: "text-gray-800",
    border: "border-gray-200",
  },
};

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || statusColors["default"];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${color.bg} ${color.text} ${color.border}`}
    >
      {status}
    </span>
  );
}

export const invitationColumns = [
  candidateColumnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  candidateColumnHelper.accessor("first_name", {
    header: "First Name",
    cell: (info) => info.getValue(),
  }),
  candidateColumnHelper.accessor("last_name", {
    header: "Last Name",
    cell: (info) => info.getValue(),
  }),
  candidateColumnHelper.accessor("deadline", {
    header: "Deadline",
    cell: (info) => info.getValue(),
  }),
  candidateColumnHelper.accessor((row) => String(row.status), {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      return <StatusBadge status={status} />;
    },
  }),
  candidateColumnHelper.accessor((row) => row.id, {
    id: "id",
    header: "Actions",
    cell: (info) => {
      const row = info.row.original;
      const options: DOption[] = [
        {
          label: "View",
          value: "view",
          onClick: () => {
            // handle view action
            // e.g., open modal or navigate
          },
        },
        {
          label: "Delete",
          value: "delete",
          onClick: () => {
            // handle delete action
            // e.g., show confirmation dialog
          },
        },
      ];
      return (
        <AsDropdownMenu options={options}>
          <button className="p-2 rounded hover:bg-muted">
            <MoreVertical className="w-4 h-4" />
          </button>
        </AsDropdownMenu>
      );
    },
  }),
];
