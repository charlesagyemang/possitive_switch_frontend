import { ApiCandidate } from "@/app/seed/candidates";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import {
  AsDropdownMenu,
  DOption,
} from "@/components/built/dropdown/custom-dropdown";
import { MoreVertical, Eye, Edit, Trash, UserPlus, Mail, Calendar, Sparkles, Settings } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const candidateColumnHelper = createColumnHelper<ApiCandidate>();

const statusColors: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-700/30",
    dot: "bg-yellow-500"
  },
  signed: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-700/30",
    dot: "bg-blue-500"
  },
  orrientation: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-700/30",
    dot: "bg-purple-500"
  },
  completed: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-700/30",
    dot: "bg-green-500"
  },
};

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || statusColors.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color.bg} ${color.text} ${color.border}`}
    >
      <div className={`w-2 h-2 rounded-full ${color.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export const companyCandidateColumns = ({
  actions,
  companyId,
  router,
  apiKey,
}: {
  actions: (r: ApiCandidate) => DOption[];
  companyId?: string;
  router?: ReturnType<typeof useRouter>;
  apiKey?: string;
}) => {
  return [
    candidateColumnHelper.accessor((row) => row, {
      header: "Candidate",
      cell: (info) => {
        const row = info.getValue();
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {row.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                onClick={() => router?.push(`/company-dashboard/${apiKey}/candidates/${row.id}`)}
                className="font-medium text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {row.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{row.email}</div>
            </div>
          </div>
        );
      },
    }),
    candidateColumnHelper.accessor((row) => row.status || "pending", {
      header: "Status",
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    candidateColumnHelper.accessor((row) => row.created_at || new Date().toISOString(), {
      header: "Joined",
      cell: (info) => {
        const date = info.getValue();
        return (
          <span className="text-gray-900 dark:text-white">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
        );
      },
    }),
    candidateColumnHelper.accessor((row) => row.id, {
      id: "manage",
      header: "Manage",
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            onClick={() => router?.push(`/company-dashboard/${apiKey}/candidates/${row.id}`)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center gap-2"
            title="Manage Candidate"
          >
            <Settings className="w-4 h-4" />
            Manage
          </button>
        );
      },
    }),
    candidateColumnHelper.accessor((row) => row.id, {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-2">
            {/* Quick View */}
            <button
              onClick={() => router?.push(`/company-dashboard/${apiKey}/candidates/${row.id}`)}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105 group"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
            </button>
            
            {/* Actions Dropdown */}
            <AsDropdownMenu
              options={actions(row)}
            >
              <button className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105 group">
                <MoreVertical className="w-4 h-4 text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              </button>
            </AsDropdownMenu>
          </div>
        );
      },
    }),
  ];
};
