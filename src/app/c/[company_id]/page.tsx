"use client";
import { ACTIVITIES_EXAMPLE, Activity } from "@/app/seed/activities";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import { GenericTable } from "@/components/built/table/data-table";
import PageTitle from "@/components/built/text/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Handshake,
  Landmark,
  LayoutDashboard,
  LoaderCircle,
  Mail,
  PersonStanding,
  Plus,
  PlusIcon,
  Trash,
  Sparkles,
  Crown,
  Heart,
  Star,
  Gem,
  Search,
  Filter,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { invitationColumns } from "./company-table-structure";
import { ApiCandidate } from "@/app/seed/candidates";
import { DOption } from "@/components/built/dropdown/custom-dropdown";
import { useRouter, useParams } from "next/navigation";
import { companyDashboardCards } from "./values";
import useModal from "@/components/built/modal/useModal";
import CandidateForm from "@/app/shared/forms/candidate-form";
import { useCandidateList } from "@/api/candidates/candidates-api";
import { useCompanyFetchHandler } from "@/api/companies/company-api";
import Image from "next/image";
import UploadCompanyLogo from "./upload-company-logo";

function OneCompanyDashboard() {
  const router = useRouter();
  const params = useParams();

  const companyId = params.company_id as string;
  
  const [sparkles, setSparkles] = React.useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [isClient, setIsClient] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [positionFilter, setPositionFilter] = React.useState("all");

  React.useEffect(() => {
    setIsClient(true);
    // Generate sparkles only on client
    const newSparkles = [...Array(15)].map(() => ({
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
  const {
    data: company,
    isPending,
    error,
    isFetched,
  } = useCompanyFetchHandler(companyId);
  const {
    data: candidates,
    isPending: loadingCandidates,
    // isFetched: candidateListIsFetched,
  } = useCandidateList(companyId);

  const makeActions = (row: ApiCandidate): DOption[] => {
    return [
      {
        label: "Manage",
        value: "manage",
        Icon: LayoutDashboard,
        onClick: () => {
          router.push(`/c/${companyId}/candidate/${row.id}`);
          // handle view details
        },
      },
      {
        label: "Delete",
        value: "delete",
        Icon: Trash,
        onClick: () => {
          // router.push(`/c/${companyId}/invitation/${row.id}`);
          // handle view details
        },
      },
    ];
  };

  const { ModalPortal, open, close } = useModal();

  const openCandidateForm = () => {
    open(
      <CandidateForm companyId={companyId} close={close} />,
      "Add a new candidate"
    );
  };

  // Filter and search candidates
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

  if (isPending)
    return (
      <div className="p-6 px-10 flex items-center gap-2">
        <LoaderCircle className="animate-spin text-primary font-medium" />{" "}
        Loading company details...
      </div>
    );

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
        columns={invitationColumns({
          actions: makeActions,
          companyId: companyId,
          router,
        })}
        data={filteredCandidates}
        noRecordsText="No candidates found 🔍"
      />
    );
  };

  const uploadLogo = () => {
    open(
      <UploadCompanyLogo close={close} company={company} />,
      `${company.name}`
    );
  };

  const renderIcon = () => {
    if (company.logo_url) {
      return (
        <Image
          onClick={() => uploadLogo()}
          width={50}
          height={50}
          src={company.logo_url}
          alt="Company Logo"
          className="w-12 h-12 rounded-lg cursor-pointer hover:opacity-70  object-cover border border-gray-200 dark:border-gray-700 bg-white"
        />
      );
    }
    return (
      <div
        onClick={() => uploadLogo()}
        className="w-12 cursor-pointer hover:opacity-70 h-12 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400"
      >
        <PlusIcon className="w-6 h-6" />
      </div>
    );
  };

  if (isFetched && error) return <div>Error: {error.message}</div>;
  return (
    <div className="relative">
      <FloatingSparkles />
      <ModalPortal />
      <SadminSpace>
        {/* Beautiful Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {renderIcon()}
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 flex items-center gap-2">
                  {company?.name || "..."} <Crown className="w-6 h-6 text-purple-500" />
                </h1>
                <p className="text-purple-600 dark:text-purple-300 font-medium">
                  Company management dashboard - manage with style! 💎
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={() => router.push(`/c/${companyId}/settings`)}
                variant="outline"
                className="bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Settings className="mr-2 w-4 h-4" />
                Settings ⚙️
              </Button>
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
        {/* Gorgeous Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {companyDashboardCards.map((card, index) => {
            const gradients = [
              "from-pink-400 via-rose-400 to-red-400",
              "from-purple-400 via-violet-400 to-indigo-400", 
              "from-blue-400 via-cyan-400 to-teal-400",
              "from-green-400 via-emerald-400 to-lime-400"
            ];
            const sparkleIcons = [Heart, Star, Gem, Sparkles];
            const SparkleIcon = sparkleIcons[index % sparkleIcons.length];
            
            return (
              <div
                key={card.title}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl dark:hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 rounded-3xl overflow-hidden relative"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                        {card.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {card.description}
                      </div>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradients[index % gradients.length]}`}>
                      {card.value}
                    </span>
                    <SparkleIcon className="w-5 h-5 text-pink-400 dark:text-pink-300 animate-pulse mb-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-8">
          <div className="lg:col-span-7">
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
                          Team Members 👥
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
          <div className="lg:col-span-3">
            {/* Right side content (30%) */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div>
                  <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Recent Activities ✨
                  </h2>
                  <ul className="space-y-3 overflow-y-scroll scrollbar-hide max-h-[500px]">
                    {ACTIVITIES_EXAMPLE.map((activity) => (
                      <React.Fragment key={activity.id}>
                        <ActivityCard activity={activity} />
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SadminSpace>
    </div>
  );
}

export default OneCompanyDashboard;

const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <li
      key={activity.id}
      className="group flex items-start gap-4 rounded-2xl p-4 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 border border-transparent hover:border-purple-200/50 dark:hover:border-purple-500/30"
    >
      <div
        className={`flex items-center justify-center rounded-2xl w-10 h-10 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110
          ${
            activity.type === "invite"
              ? "bg-gradient-to-r from-blue-400 to-cyan-400"
              : activity.type === "sign"
              ? "bg-gradient-to-r from-green-400 to-emerald-400"
              : activity.type === "add"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400"
              : activity.type === "accept"
              ? "bg-gradient-to-r from-purple-400 to-pink-400"
              : "bg-gradient-to-r from-gray-400 to-gray-500"
          }
        `}
      >
        {activity.type === "invite" && (
          <Mail className="w-5 h-5 text-white" />
        )}
        {activity.type === "sign" && (
          <Handshake className="w-5 h-5 text-white" />
        )}
        {activity.type === "add" && (
          <Plus className="w-5 h-5 text-white" />
        )}
        {activity.type === "accept" && (
          <PersonStanding className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-900 dark:text-white capitalize bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {activity.type}
          </span>
          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
        </div>
        <span className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {activity.notes}
        </span>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
          {new Date(activity.created_at).toLocaleString()}
        </div>
      </div>
    </li>
  );
};
