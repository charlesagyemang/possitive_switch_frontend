"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CustomTabComponent,
  CustomTabItem,
} from "@/components/built/tabs/tab-component";
import useCustomTabs from "@/components/built/tabs/use-tab-component";
import { CheckCircle, ListTodo, Signature, UserCog, Sparkles, Crown, FileText, Share2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useCandidate } from "@/api/candidates/candidates-api";
import LoadingState from "@/components/built/loaders/loading-state";
import AppNotifications from "@/components/built/app-notifications";
import { ApiOnBoardingTask } from "@/app/types";
import CompanyConfigurationTab from "./company-configuration-tab";
import CompanyManageContractsTab from "./company-manage-contracts-tab";
import CompanyOnboardingTab from "./company-onboarding-tab";
import CandidateChecklistTab from "./candidate-checklist-tab";
import ShareCompanyDocumentsTab from "./share-company-documents-tab";

export default function CompanyManageCandidatePage() {
  const { TabComponent } = useCustomTabs({ defaultTab: "config" });
  const { candidate_id, api_key } = useParams();
  const [excluded, setExcluded] = useState<ApiOnBoardingTask[]>([]);
  const [checked, setChecked] = useState<ApiOnBoardingTask[]>([]);
  
  const [sparkles, setSparkles] = React.useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Generate sparkles only on client
    const newSparkles = [...Array(10)].map(() => ({
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

  const excludeATask = (task: ApiOnBoardingTask) => {
    setExcluded((prev) => {
      if (prev.some((t) => t.id === task.id)) {
        return prev.filter((t) => t.id !== task.id);
      }
      return [...prev, task];
    });
  };

  const markATaskAsChecked = (task: ApiOnBoardingTask) => {
    setChecked((prev) => {
      if (prev.some((t) => t.id === task.id)) {
        return prev.filter((t) => t.id !== task.id);
      }
      return [...prev, task];
    });
  };
  
  const {
    data: candidate,
    isPending,
    error,
    isFetched,
  } = useCandidate(candidate_id as string);

  // Get company data from localStorage to get company_id
  const [company, setCompany] = useState<any>(null);
  
  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      setCompany(JSON.parse(companyData));
    }
  }, []);

  const TABS: CustomTabItem[] = [
    {
      name: "Configurations",
      key: "config",
      icon: <UserCog className="h-4 w-4" />,
      render: () => (
        <CompanyConfigurationTab
          excluded={excluded}
          exclude={excludeATask}
          candidate={candidate}
          reset={() => setExcluded([])}
          companyId={company?.id}
        />
      ),
    },
    {
      name: "Contracts",
      key: "contracts",
      icon: <Signature className="h-4 w-4" />,
      render: () => <CompanyManageContractsTab candidate={candidate} api_key={api_key as string} company_id={company?.id} />,
    },
    {
      name: "OnBoarding Tasks",
      key: "onboarding-tasks",
      icon: <CheckCircle className="h-4 w-4" />,
      render: () => (
        <CompanyOnboardingTab
          tasks={candidate?.company_onboarding_tasks}
          checked={checked}
          markAsChecked={markATaskAsChecked}
          candidate={candidate}
          reset={() => setChecked([])}
        />
      ),
    },
    {
      name: "Candidate Checklist",
      key: "candidate-checklist",
      icon: <FileText className="h-4 w-4" />,
      render: () => (
        <CandidateChecklistTab
          candidateId={candidate_id as string}
          candidateName={candidate?.name}
        />
      ),
    },
    {
      name: "Share Documents",
      key: "share-documents",
      icon: <Share2 className="h-4 w-4" />,
      render: () => (
        <ShareCompanyDocumentsTab
          candidateId={candidate_id as string}
          candidateName={candidate?.name}
          apiKey={api_key as string}
        />
      ),
    },
  ];
  
  const renderProfilePhoto = () => {
    return (
      <>
        {candidate?.profile_photo_url ? (
          <Image
            src={candidate.profile_photo_url}
            alt={candidate.name || "Candidate Photo"}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-md"
          />
        ) : (
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/70 to-pink-200 text-2xl font-bold text-white shadow-sm">
            {candidate?.name
              ? candidate.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
              : ""}
          </div>
        )}
      </>
    );
  };

  if (isPending) return <LoadingState>Fetching candidate info...</LoadingState>;

  if (error)
    return (
      <div className="p-6">
        <AppNotifications.Error
          message={`Error fetching candidate: ${error.message}`}
        />
      </div>
    );

  if (!candidate && isFetched)
    return (
      <p>Sorry, we could not find the candidate you were looking for...</p>
    );

  return (
    <div className="relative">
      <FloatingSparkles />
      <div className="space-y-8">
        {/* Beautiful Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {renderProfilePhoto()}
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 flex items-center gap-2">
                  {candidate?.name || "..."} <Crown className="w-6 h-6 text-purple-500" />
                </h1>
                <p className="text-purple-600 dark:text-purple-300 font-medium">
                  {candidate?.job_title ? `${candidate.job_title} ✨` : "Managing candidate journey 💎"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>


        <div className="relative z-10">
          <TabComponent items={TABS} />
        </div>
      </div>
    </div>
  );
}
