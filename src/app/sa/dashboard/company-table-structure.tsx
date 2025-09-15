import { Company } from "@/app/seed/companies";
import {
  DOption,
} from "@/components/built/dropdown/custom-dropdown";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { Building2, Eye, Edit, Trash, Upload, Users, Settings, Link } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";

const companyColumnHelper = createColumnHelper<Company>();
export const companyColumns = ({
  actions,
  router,
}: {
  actions: (row: Company) => DOption[];
  router: AppRouterInstance;
}) => [
  companyColumnHelper.accessor((row) => row, {
    id: "name",

    cell: (info) => {
      const row = info.getValue();
      const logo = row?.logo_url;
      return (
        <span
          onClick={() => router.push(`/c/${row.id}`)}
          className="font-semibold flex items-center gap-2 hover:underline hover:opacity-70 cursor-pointer transition-colors "
        >
          {logo ? (
            <Image
              alt={row.name}
              src={logo}
              width={50}
              height={50}
              className="object-contain"
            />
          ) : (
            <Building2 className="size-4" />
          )}

          {row.name}
        </span>
      );
    },
  }),
  // companyColumnHelper.accessor("employees", {
  //   id: "employees",

  //   cell: (info) => (
  //     <span
  //       className="font-medium text-xs rounded-lg px-2 py-0.5 bg-indigo-50 text-indigo-700 "
  //       style={{
  //         color: "oklch(0.541 0.281 293.009)",
  //         background: "oklch(0.95 0.05 293.009)",
  //       }}
  //     >
  //       {info.getValue()}
  //     </span>
  //   ),
  // }),
  // companyColumnHelper.accessor("candidates", {
  //   id: "candidates",

  //   cell: (info) => (
  //     <span
  //       className="font-medium rounded-lg text-xs px-2 py-0.5 bg-green-50 text-green-700 "
  //       style={{
  //         color: "#1e7f4c",
  //         background: "#e6f7ef",
  //       }}
  //     >
  //       {info.getValue()}
  //     </span>
  //   ),
  // }),
  // Add status column
  companyColumnHelper.accessor((row) => row.status || "active", {
    id: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <span className={`px-3 py-1 font-medium rounded-full text-xs flex items-center gap-1 ${
          status === "active" 
            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            status === "active" ? "bg-emerald-500" : "bg-red-500"
          }`} />
          {status === "active" ? "Active" : "Inactive"}
        </span>
      );
    },
  }),
  companyColumnHelper.accessor((row) => row.id, {
    id: "manage",
    header: "Manage",
    cell: (info) => {
      return (
        <button
          onClick={() => router.push(`/c/${info.row.original.id}`)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center gap-2"
          title="Manage Company"
        >
          <Settings className="w-4 h-4" />
          Manage
        </button>
      );
    },
  }),
  companyColumnHelper.accessor((row) => row.id, {
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const options = actions(info.row.original);

      return (
        <div className="flex items-center gap-2">
          {/* Edit Company */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const editAction = options.find(action => action.value === "edit");
              editAction?.onClick?.();
            }}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="Edit Company"
          >
            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </Button>

          {/* Upload Logo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const logoAction = options.find(action => action.value === "logo");
              logoAction?.onClick?.();
            }}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="Upload Logo"
          >
            <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
          </Button>

          {/* View Candidates */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const candidatesAction = options.find(action => action.value === "candidates");
              candidatesAction?.onClick?.();
            }}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="View Candidates"
          >
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </Button>

          {/* View Details */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const viewAction = options.find(action => action.value === "view-details");
              viewAction?.onClick?.();
            }}
            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </Button>

          {/* Generate Login Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const company = info.row.original as any; // Type assertion for API response
              const loginUrl = `${window.location.origin}/company-login?key=${company.api_key}`;
              navigator.clipboard.writeText(loginUrl);
              // You could add a toast notification here
              alert(`Login link copied to clipboard!\n\n${loginUrl}`);
            }}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="Generate Login Link"
          >
            <Link className="w-4 h-4 text-green-600 dark:text-green-400" />
          </Button>

          {/* Delete Company */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const deleteAction = options.find(action => action.value === "delete");
              deleteAction?.onClick?.();
            }}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="Delete Company"
          >
            <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      );
    },
  }),
];
