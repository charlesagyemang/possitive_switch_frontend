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
import { Plus } from "lucide-react";
import { GenericTable } from "@/components/built/table/data-table";
import { companyColumns } from "./company-table-structure";
import { Company, companyData } from "@/app/seed/companies";
import { Button } from "@/components/ui/button";
import { dashboardCards } from "./values";
import useModal from "@/components/built/modal/useModal";
import CompanyForm from "@/app/shared/forms/company-form";
import { useCompanyList } from "@/api/companies/company-api";
import { useAuthenticatedUser } from "@/api/auth/auth";

export default function SadminDashboard() {
  const { ModalPortal, open, close } = useModal();
  const { data: companyList } = useCompanyList();
  const { data: user } = useAuthenticatedUser();

  console.log("User Data: ", user);
  const addNewCompany = () => {
    open(<CompanyForm close={close} />, "Add a new company");
  };

  console.log("Companies Data: ", companyList);
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

          <Button onClick={addNewCompany} variant="outline" className="mt-4">
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
            <CardContent>
              <GenericTable<Company, any>
                pageSize={6}
                name="Companies"
                columns={companyColumns}
                // data={companyData}
                noRecordsText="No companies found"
                data={companyList || []}
              />
            </CardContent>
          </Card>
        </div>
      </SadminSpace>
    </div>
  );
}
