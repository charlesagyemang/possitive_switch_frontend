import { Company } from "@/app/seed/companies";
import { AsDropdownMenu } from "@/components/built/dropdown/custom-dropdown";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import {  Building2, Ellipsis } from "lucide-react";

const companyColumnHelper = createColumnHelper<Company>();
export const companyColumns = [
  companyColumnHelper.accessor("name", {
    id: "name",

    cell: (info) => (
      <span className="font-semibold flex items-center gap-2 hover:underline cursor-pointer transition-colors ">
        <Building2 className="size-4" />
        {info.getValue()}
      </span>
    ),
  }),
  companyColumnHelper.accessor("employees", {
    id: "employees",

    cell: (info) => (
      <span
        className="font-medium text-xs rounded-lg px-2 py-0.5 bg-indigo-50 text-indigo-700 "
        style={{
          color: "oklch(0.541 0.281 293.009)",
          background: "oklch(0.95 0.05 293.009)",
        }}
      >
        {info.getValue()}
      </span>
    ),
  }),
  companyColumnHelper.accessor("candidates", {
    id: "candidates",

    cell: (info) => (
      <span
        className="font-medium rounded-lg text-xs px-2 py-0.5 bg-green-50 text-green-700 "
        style={{
          color: "#1e7f4c",
          background: "#e6f7ef",
        }}
      >
        {info.getValue()}
      </span>
    ),
  }),
  companyColumnHelper.accessor((row) => row.created_at, {
    id: "Created",

    cell: (info) => (
      <span className="bg-gray-100 text-gray-700 px-3 py-1 font-medium rounded-full text-xs ">
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

    cell: (info) => (
      <AsDropdownMenu
        options={[
          {
            label: "View Details",
            value: "view-details",

            onClick: () => {
              // Handle view details action
              console.log("View Details for company ID:", info.getValue());
            },
          },
          {
            label: "Add Employee",
            value: "add-employee",

            onClick: () => {
              // Handle add employee action
              console.log("Add Employee for company ID:", info.getValue());
            },
          },
        ]}
        className="text-xs font-medium text-gray-600 hover:text-gray-900"
      >
        <Button variant="ghost" size="sm" className="p-2">
          <Ellipsis className="size-4" />
        </Button>
      </AsDropdownMenu>
    ),
  }),
];
