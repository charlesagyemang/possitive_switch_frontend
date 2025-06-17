"use client";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import PageTitle from "@/components/built/text/page-title";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LoaderCircle, Plus } from "lucide-react";
import { GenericTable } from "@/components/built/table/data-table";
import { companyColumns } from "./company-table-structure";
import { Company, companyData } from "@/app/seed/companies";
import { Button } from "@/components/ui/button";
import { dashboardCards } from "./values";
import useModal from "@/components/built/modal/useModal";
import CompanyForm from "@/app/shared/forms/company-form";
import {
  useCompanyDeleteHandler,
  useCompanyList,
} from "@/api/companies/company-api";
import { useAuthenticatedUser } from "@/api/auth/auth";
import DeleteConfirmation from "@/components/built/dialogs/delete-confirmation";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Q_LIST_COMPANIES } from "@/api/auth/constants";
import { useRouter } from "next/navigation";

export default function SadminDashboard() {
  const { ModalPortal, open, close } = useModal();
  const { data: companyList, isPending } = useCompanyList();
  const { data: user } = useAuthenticatedUser();
  const { run, isPending: isDeleting } = useCompanyDeleteHandler();
  const client = useQueryClient();

  const router = useRouter();

  const addNewCompany = useCallback(
    (data?: Company) => {
      open(<CompanyForm data={data} close={close} />, "Add a new company");
    },
    [close]
  );

  const doApiDelete = (data?: Company) => {
    run(data?.id, {
      onSuccess: () => {
        console.log("Company created successfully", data);
        client.refetchQueries({
          queryKey: [Q_LIST_COMPANIES],
        });
      },
    });
  };

  const deleteConfirmation = (data?: Company) => {
    open(
      <DeleteConfirmation
        cancel={{ onClick: close }}
        confirm={{ loading: isDeleting, onClick: () => doApiDelete(data) }}
      />,
      `Delete '${data?.name || "Company"}'` // Use company name or default text
    );
  };

  const makeDropdownActions = (row: Company) => {
    return [
      {
        label: "Edit",
        value: "edit",

        onClick: () => {
          addNewCompany(row);
        },
      },
      {
        label: "View Details",
        value: "view-details",

        onClick: () => {
          // Handle add employee action
          // console.log("View Details for company ID:", row);
          router.push(`/c/${row.id}`);
        },
      },
      {
        label: "Delete",
        value: "delete",

        onClick: () => {
          deleteConfirmation(row);
        },
      },
    ];
  };

  const renderCompanies = () => {
    if (isPending)
      return (
        <div className="flex items-center font-medium">
          <LoaderCircle className="animate-spin text-primary mr-2" /> Loading
          companies...
        </div>
      );

    return (
      <GenericTable<Company, any>
        pageSize={6}
        name="Companies"
        columns={companyColumns({ actions: makeDropdownActions })}
        // data={companyData}
        noRecordsText="No companies found"
        data={companyList || []}
      />
    );
  };
  return (
    <div>
      <ModalPortal />
      <SadminSpace>
        <div className="flex flex-row items-center justify-between">
          <PageTitle
            // Icon={Smile}
            title={`Welcome ${user?.name || "Super Admin"}`}
            description="You are a super admin, manage all the companies and candidates from here!"
          />

          <Button
            onClick={() => addNewCompany()}
            variant="outline"
            className="mt-4"
          >
            <Plus className="" />
            Add New Company
          </Button>
        </div>

        <div className="mt-6">
          {/*
            Dashboard cards data
            */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCards.map((card) => (
              <Card
                key={card.title}
                className={`border-none shadow-lg hover:shadow-xl transition-shadow duration-200 ${card.cardBg}`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                      {card.description}
                    </CardDescription>
                  </div>
                  <span
                    className={`rounded-full p-3 flex items-center justify-center ${card.iconBg} shadow-md`}
                  >
                    <card.icon className="w-6 h-6" />
                  </span>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {card.value}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <Card className="shadow-none bg-white">
            <CardContent>{renderCompanies()}</CardContent>
          </Card>
        </div>
      </SadminSpace>
    </div>
  );
}
