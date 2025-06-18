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
import React from "react";
import OnboardingTab from "./onboarding-tab";

export default function ManageCandidatePage() {
  const { TabComponent } = useCustomTabs({ defaultTab: "onboarding-tasks" });

  const TABS: CustomTabItem[] = [
    {
      name: "OnBoarding Tasks",
      key: "onboarding-tasks",
      icon: <CheckCircle className="h-4 w-4" />,
      render: () => <OnboardingTab />,
    },
    {
      name: "Contracts",
      key: "contracts",
      icon: <Signature className="h-4 w-4" />,
      render: () => <div>Create contracts for candidates</div>,
    },
    {
      name: "Configurations",
      key: "configurations",
      icon: <UserCog className="h-4 w-4" />,
      render: () => <div>Configure candidate contracts & templates</div>,
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

  return (
    <SadminSpace>
      <PageTitle
        customIcon={renderProfilePhoto}
        title="Stella Opoku Agyemang"
        description="Candidate Management"
      />

      <div className="mt-6">
        <TabComponent items={TABS} />
      </div>
    </SadminSpace>
  );
}
