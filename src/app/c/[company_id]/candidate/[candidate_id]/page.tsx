"use client";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import {
  CustomTabComponent,
  CustomTabItem,
} from "@/components/built/tabs/tab-component";
import useCustomTabs from "@/components/built/tabs/use-tab-component";
import PageTitle from "@/components/built/text/page-title";
import { CheckCircle, ListTodo, Signature, UserCog } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import OnboardingTab from "./onboarding-tab";
import Configuration from "./manage-configurations-tab";
import { useCandidate } from "@/api/candidates/candidates-api";
import { useParams } from "next/navigation";
import LoadingState from "@/components/built/loaders/loading-state";
import AppNotifications from "@/components/built/app-notifications";
import { ApiOnBoardingTask } from "@/app/types";
import ManageCandidateContracts from "./manage-contracts-tab";

export default function ManageCandidatePage() {
  const { TabComponent } = useCustomTabs({ defaultTab: "config" });
  const { candidate_id } = useParams();
  const [excluded, setExcluded] = useState<ApiOnBoardingTask[]>([]);

  const excludeATask = (task: ApiOnBoardingTask) => {
    setExcluded((prev) => {
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

  const TABS: CustomTabItem[] = [
    {
      name: "OnBoarding Tasks",
      key: "onboarding-tasks",
      icon: <CheckCircle className="h-4 w-4" />,
      render: () => <OnboardingTab tasks={candidate.onboarding_tasks} />,
    },
    {
      name: "Contracts",
      key: "contracts",
      icon: <Signature className="h-4 w-4" />,
      render: () => <ManageCandidateContracts />,
    },
    {
      name: "Configurations",
      key: "config",
      icon: <UserCog className="h-4 w-4" />,
      render: () => (
        <Configuration
          excluded={excluded}
          exclude={excludeATask}
          candidate={candidate}
          reset={() => setExcluded([])}
        />
      ),
    },
  ];
  const renderProfilePhoto = () => {
    return (
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200">
        <Image
          width={56}
          height={56}
          src="https://randomuser.me/api/portraits/men/40.jpg"
          alt="Stella Opoku Agyemang"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
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
    <SadminSpace>
      <PageTitle
        customIcon={renderProfilePhoto}
        title={candidate?.name || "..."}
        description={candidate?.job_title}
      />

      <div className="mt-6">
        <TabComponent items={TABS} />
      </div>
    </SadminSpace>
  );
}
