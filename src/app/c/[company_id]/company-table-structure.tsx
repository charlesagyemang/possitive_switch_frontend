import { ApiCandidate, CandidateInvitation } from "@/app/seed/candidates";
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
  onboarding: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-700/30",
    dot: "bg-purple-500"
  },
  completed: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-700/30",
    dot: "bg-emerald-500"
  },
  default: {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700/30",
    dot: "bg-gray-500"
  },
};

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || statusColors["default"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color.bg} ${color.text} ${color.border}`}
    >
      <div className={`w-2 h-2 rounded-full ${color.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export const invitationColumns = ({
  actions,
  companyId,
  router,
}: {
  actions: (r: ApiCandidate) => DOption[];
  companyId?: string;
  router?: ReturnType<typeof useRouter>;
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
                onClick={() => router?.push(`/c/${companyId}/candidate/${row.id}`)}
                className="font-bold text-gray-900 dark:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 cursor-pointer transition-all duration-300"
              >
                {row.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {row.email}
              </div>
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
        const dateValue = info.getValue();
        const date = new Date(dateValue);
        const isValidDate = !isNaN(date.getTime());
        
        return (
          <div className="bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {isValidDate ? format(date, "MMM dd, yyyy") : "Recently"}
          </div>
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
            onClick={() => router?.push(`/c/${companyId}/candidate/${row.id}`)}
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
              onClick={() => router?.push(`/c/${companyId}/candidate/${row.id}`)}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105 group"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300" />
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                // Handle edit action
                const editAction = actions(row).find(action => action.value === "edit");
                editAction?.onClick?.();
              }}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 hover:scale-105 group"
              title="Edit Candidate"
            >
              <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                // Handle delete action
                const deleteAction = actions(row).find(action => action.value === "delete");
                deleteAction?.onClick?.();
              }}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 hover:scale-105 group"
              title="Delete Candidate"
            >
              <Trash className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300" />
            </button>
          </div>
        );
      },
    }),
  ];
};

export const candidateColumns = ({
  actions,
  companyId,
  router,
}: {
  actions: (r: ApiCandidate) => DOption[];
  companyId?: string;
  router?: ReturnType<typeof useRouter>;
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
                onClick={() => router?.push(`/c/${companyId}/candidate/${row.id}`)}
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
    candidateColumnHelper.accessor((row) => row.job_title || "Not specified", {
      header: "Job Title",
      cell: (info) => (
        <span className="text-gray-900 dark:text-white">{info.getValue()}</span>
      ),
    }),
    candidateColumnHelper.accessor((row) => row.created_at || "Not set", {
      header: "Created Date",
      cell: (info) => {
        const date = info.getValue();
        return (
          <span className="text-gray-900 dark:text-white">
            {date === "Not set" ? date : format(new Date(date), "MMM dd, yyyy")}
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
            onClick={() => router?.push(`/c/${companyId}/candidate/${row.id}`)}
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
