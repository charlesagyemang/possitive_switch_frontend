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
import { LoaderCircle, Plus, Crown, Rainbow, Search, Calendar, Building2, Edit, Upload, Users, Eye, Trash } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { GenericTable } from "@/components/built/table/data-table";
import { companyColumns } from "./company-table-structure";
import { Company, companyData } from "@/app/seed/companies";
import { Button } from "@/components/ui/button";
import useModal from "@/components/built/modal/useModal";
import CompanyForm from "@/app/shared/forms/company-form";
import {
  useCompanyDeleteHandler,
  useCompanyList,
} from "@/api/companies/company-api";
import { useAuthenticatedUser } from "@/api/auth/auth";
import DeleteConfirmation from "@/components/built/dialogs/delete-confirmation";
import { useCallback, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Q_LIST_COMPANIES } from "@/api/auth/constants";
import { useRouter } from "next/navigation";
import UploadCompanyLogo from "@/app/c/[company_id]/upload-company-logo";

export default function SadminDashboard() {
  const { ModalPortal, open, close } = useModal();
  const { data: companyList, isPending } = useCompanyList();
  const { data: user } = useAuthenticatedUser();
  const { run, isPending: isDeleting } = useCompanyDeleteHandler();
  const client = useQueryClient();
  const router = useRouter();
  
  const [sparkles, setSparkles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    setIsClient(true);
    // Generate sparkles only on client
    const newSparkles = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setSparkles(newSparkles);
  }, []);

  const FloatingSparkles = () => {
    if (!isClient) return null;
    
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {sparkles.map((sparkle, i) => (
          <div
            key={i}
            className="absolute text-pink-300 dark:text-purple-400 animate-pulse opacity-30 dark:opacity-50"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>
    );
  };

  const addNewCompany = useCallback(
    (data?: Company) => {
      open(<CompanyForm data={data} close={close} />, "Add a new company");
    },
    [close]
  );

  const doApiDelete = (data?: Company) => {
    run(data?.id, {
      onSuccess: () => {
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

  const uploadLogo = (company: Company) => {
    open(
      <UploadCompanyLogo close={close} company={company} />,
      `${company.name}`
    );
  };

  const makeDropdownActions = (row: Company) => {
    return [
      {
        label: "Edit Company",
        value: "edit",
        Icon: Edit,
        onClick: () => {
          addNewCompany(row);
        },
      },
      {
        label: "Upload Logo",
        value: "logo",
        Icon: Upload,
        onClick: () => {
          uploadLogo(row);
        },
      },
      {
        label: "View Candidates",
        value: "candidates",
        Icon: Users,
        onClick: () => {
          router.push(`/c/${row.id}`);
        },
      },
      {
        label: "Company Details",
        value: "view-details",
        Icon: Eye,
        onClick: () => {
          router.push(`/c/${row.id}`);
        },
      },
      {
        label: "Delete Company",
        value: "delete",
        Icon: Trash,
        className: "text-red-600 dark:text-red-400",
        onClick: () => {
          deleteConfirmation(row);
        },
      },
    ];
  };

  // Filter and search companies
  const filteredCompanies = React.useMemo(() => {
    if (!companyList) return [];
    
    return companyList.filter((company: Company) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter (you can customize this based on your company status field)
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && company.status === "active") ||
        (statusFilter === "inactive" && company.status === "inactive");
      
      // Date filter
      const matchesDate = dateFilter === "all" || (() => {
        const companyDate = new Date(company.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - companyDate.getTime()) / (1000 * 3600 * 24));
        
        switch (dateFilter) {
          case "week": return daysDiff <= 7;
          case "month": return daysDiff <= 30;
          case "year": return daysDiff <= 365;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [companyList, searchTerm, statusFilter, dateFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const renderCompanies = () => {
    if (isPending)
      return (
        <div className="flex items-center font-medium text-purple-500 dark:text-purple-400">
          <LoaderCircle className="animate-spin mr-3" />
          <span>Loading companies... ✨</span>
        </div>
      );

    return (
      <GenericTable<Company, any>
        pageSize={8}
        name=""
        columns={companyColumns({ actions: makeDropdownActions, router })}
        noRecordsText="No companies found 🔍"
        data={filteredCompanies}
      />
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black relative overflow-hidden">
      {/* Beautiful Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-100/30 via-purple-100/30 to-blue-100/30 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-blue-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.2),transparent)] dark:bg-[radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(221,160,221,0.2),transparent)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(221,160,221,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(173,216,230,0.2),transparent)] dark:bg-[radial-gradient(circle_at_40%_40%,rgba(173,216,230,0.1),transparent)]"></div>
      </div>

      <FloatingSparkles />
      <ModalPortal />
      
      <div className="relative z-10">
        <SadminSpace>
          {/* Beautiful Header */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8">
            <div className="flex flex-row items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600">
                      Welcome {user?.name || "Beautiful Admin"} ✨
                    </h1>
                    <p className="text-purple-600 dark:text-purple-300 font-medium">
                      You&apos;re doing amazing! Manage your companies and candidates with style 💎
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button
                  onClick={() => addNewCompany()}
                  className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                >
                  <Plus className="mr-2" />
                  Add New Company ✨
                </Button>
              </div>
            </div>
          </div>


          {/* Beautiful Companies Table */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Rainbow className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
                      Companies Dashboard 🏢
                    </CardTitle>
                    <CardDescription className="text-purple-600 dark:text-purple-300 font-medium">
                      Search, filter, and manage all your beautiful companies!
                    </CardDescription>
                  </div>
                  <div className="text-sm bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-semibold text-purple-700 dark:text-purple-300">
                    {filteredCompanies.length} / {companyList?.length || 0} companies
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
                    <Input
                      placeholder="Search companies by name or email... ✨"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-12 placeholder:text-purple-400 dark:placeholder:text-purple-500"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500 z-10" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="pl-10 w-40 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-12">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600/30 rounded-2xl">
                          <SelectItem value="all">All Status ✨</SelectItem>
                          <SelectItem value="active">Active 🟢</SelectItem>
                          <SelectItem value="inactive">Inactive 🔴</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500 z-10" />
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="pl-10 w-40 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-12">
                          <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600/30 rounded-2xl">
                          <SelectItem value="all">All Time ⏰</SelectItem>
                          <SelectItem value="week">Last Week 📅</SelectItem>
                          <SelectItem value="month">Last Month 🗓️</SelectItem>
                          <SelectItem value="year">Last Year 📆</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-2xl h-12 px-4"
                      >
                        Clear 🧹
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {renderCompanies()}
            </CardContent>
          </Card>
        </SadminSpace>
      </div>
    </div>
  );
}
