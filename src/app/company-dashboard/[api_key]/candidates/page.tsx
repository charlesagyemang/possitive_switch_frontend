"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Eye,
  Settings,
  LayoutDashboard,
  LoaderCircle,
  Crown
} from "lucide-react";
import { useCandidateList, useCreateCandidateHandler, useEditCandidateHandler, useDeleteCandidateHandler } from "@/api/candidates/candidates-api";
import { useValidateCompanyApiKey } from "@/api/companies/company-api";
import { ApiCandidate } from "@/app/seed/candidates";
import { DOption } from "@/components/built/dropdown/custom-dropdown";
import useModal from "@/components/built/modal/useModal";
import EditCandidateForm from "../edit-candidate-form";
import DeleteCandidateDialog from "../delete-candidate-dialog";
import CandidateForm from "../candidate-form";
import { GenericTable } from "@/components/built/table/data-table";
import { companyCandidateColumns } from "../company-table-structure";

interface Company {
  id: string;
  name: string;
  email: string;
  location: string;
  phone_number: string;
  api_key: string;
}

function CompanyCandidatesContent() {
  const params = useParams();
  const router = useRouter();
  const apiKey = params.api_key as string;
  const { open, close, ModalPortal } = useModal();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  // Get company data from localStorage
  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      const parsed = JSON.parse(companyData);
      setCompany(parsed);
    }
  }, []);

  // Fetch candidates for this company
  const {
    data: candidates,
    isPending: loadingCandidates,
  } = useCandidateList(company?.id || "");

  // Log the candidates data when it changes
  useEffect(() => {
    if (candidates) {
      console.log("✨ Candidates received in component:", candidates);
      console.log("📊 Number of candidates:", candidates.length);
      console.log("🎯 Sample candidate structure:", candidates[0]);
    }
  }, [candidates]);

  const makeActions = (row: ApiCandidate): DOption[] => {
    return [
      {
        label: "Edit",
        value: "edit",
        Icon: Edit,
        onClick: () => {
          open(
            <EditCandidateForm 
              close={close} 
              candidate={row} 
              companyId={company?.id || ""} 
            />,
            `Edit ${row.name}`
          );
        },
      },
      {
        label: "Manage",
        value: "manage",
        Icon: LayoutDashboard,
        onClick: () => {
          router.push(`/company-dashboard/${apiKey}/candidates/${row.id}`);
        },
      },
      {
        label: "Delete",
        value: "delete",
        Icon: Trash,
        onClick: () => {
          open(
            <DeleteCandidateDialog 
              close={close} 
              candidate={row} 
              companyId={company?.id || ""} 
            />,
            `Delete ${row.name}`
          );
        },
      },
    ];
  };

  const openCandidateForm = () => {
    open(
      <CandidateForm companyId={company?.id || ""} close={close} />,
      "Add a new candidate"
    );
  };

  // Filter and search candidates - EXACT COPY from main admin
  const filteredCandidates = React.useMemo(() => {
    if (!candidates) return [];
    
    return candidates.filter((candidate: ApiCandidate) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const candidateStatus = candidate.status || "pending";
      const matchesStatus = statusFilter === "all" || candidateStatus === statusFilter;
      
      // Position filter
      const candidatePosition = candidate.job_title || "not-specified";
      const matchesPosition = positionFilter === "all" || candidatePosition.toLowerCase().includes(positionFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [candidates, searchTerm, statusFilter, positionFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPositionFilter("all");
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading company data...</p>
        </div>
      </div>
    );
  }

  const renderCandidates = () => {
    if (loadingCandidates)
      return (
        <div className="flex items-center font-medium text-purple-500 dark:text-purple-400">
          <LoaderCircle className="animate-spin mr-3" />
          <span>Loading candidates... ✨</span>
        </div>
      );

    return (
      <GenericTable<ApiCandidate, any>
        pageSize={8}
        name=""
        columns={companyCandidateColumns({
          actions: makeActions,
          companyId: company.id,
          router,
          apiKey: apiKey,
        })}
        data={filteredCandidates}
        noRecordsText="No candidates found 🔍"
      />
    );
  };

  return (
    <div className="relative">
      <ModalPortal />
      <div className="space-y-8">
        {/* Beautiful Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 flex items-center gap-2">
                  {company?.name || "..."} Candidates <Crown className="w-6 h-6 text-purple-500" />
                </h1>
                <p className="text-purple-600 dark:text-purple-300 font-medium">
                  Company candidates management - manage with style! 💎
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={openCandidateForm}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Plus className="mr-2" />
                New Candidate ✨
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div>
            {/* Enhanced Candidates Table */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
              {/* Header with Search and Filters */}
              <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30 p-6">
                <div className="space-y-4">
                  {/* Title and Counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
                          Candidates
                        </h2>
                        <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                          Manage your amazing candidates here!
                        </p>
                      </div>
                    </div>
                    <div className="text-sm bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-semibold text-purple-700 dark:text-purple-300">
                      {filteredCandidates.length} / {candidates?.length || 0} candidates
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
                      <Input
                        placeholder="Search candidates by name or email... ✨"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-10 placeholder:text-purple-400 dark:placeholder:text-purple-500"
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-36 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-10">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600/30 rounded-2xl">
                          <SelectItem value="all">All Status ✨</SelectItem>
                          <SelectItem value="pending">Pending 🟡</SelectItem>
                          <SelectItem value="signed">Signed 🔵</SelectItem>
                          <SelectItem value="onboarding">Onboarding 🟣</SelectItem>
                          <SelectItem value="completed">Completed 🟢</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || statusFilter !== "all" || positionFilter !== "all") && (
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-2xl h-10 px-4"
                      >
                        Clear 🧹
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Table Content */}
              <CardContent className="p-8">{renderCandidates()}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyCandidatesPage() {
  return <CompanyCandidatesContent />;
}
