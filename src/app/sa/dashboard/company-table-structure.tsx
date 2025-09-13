import { Company } from "@/app/seed/companies";
import {
  AsDropdownMenu,
  DOption,
} from "@/components/built/dropdown/custom-dropdown";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { Building2, Ellipsis, Mail, Eye, Edit, Trash, Upload, Users, Calendar } from "lucide-react";
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
  companyColumnHelper.accessor("email", {
    id: "email",

    cell: (info) => (
      <span className=" flex items-center gap-2 hover:underline cursor-pointer transition-colors ">
        {/* <Mail className="size-4" /> */}
        {info.getValue()}
      </span>
    ),
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
  companyColumnHelper.accessor((row) => row.created_at, {
    id: "Created",
    header: "Created",
    cell: (info) => (
      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 font-medium rounded-full text-xs flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {new Date(info.getValue()).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  }),
  companyColumnHelper.accessor((row) => row.id, {
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const options = actions(info.row.original);

      return (
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/c/${info.row.original.id}`)}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </Button>

          {/* Dropdown Menu */}
          <AsDropdownMenu
            options={options}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Ellipsis className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </Button>
          </AsDropdownMenu>
        </div>
      );
    },
  }),
];
