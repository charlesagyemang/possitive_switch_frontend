"use client";
import {
  CandidateInvitation,
  INVITATION_EXAMPLES,
  INVITATION_STATUS,
} from "@/app/seed/candidates";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import CustomStepper, {
  Step,
  StepHeader,
} from "@/components/built/stepper/custom-stepper";
import PageTitle from "@/components/built/text/page-title";
import { Mail } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

function InvitationView() {
  const params = useParams();
  const { invitation_id } = params;

  const invitation: CandidateInvitation | undefined = useMemo(() => {
    return INVITATION_EXAMPLES.find((inv) => inv.id === invitation_id);
  }, [invitation_id]);

  const headers: StepHeader[] = useMemo(() => {
    return INVITATION_STATUS.map((status) => ({
      label: status.label,
      icon: status.Icon,
    }));
  }, []);

  const steps: Step[] = useMemo(() => {
    return INVITATION_STATUS.map((status) => ({
      component: () => (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">{status.label}</h2>
          <p className="text-sm text-gray-500">
            {`Details for ${invitation?.first_name} ${invitation?.last_name}`}
          </p>
        </div>
      ),
      props: {},
    }));
  }, [invitation]);

  const initialStep = useMemo(() => {
    return (
      INVITATION_STATUS.findIndex(
        (status) => status.value === invitation?.status
      ) || 0
    );
  }, [invitation]);
  return (
    <div>
      <SadminSpace>
        <PageTitle
          title={`${invitation?.first_name} ${invitation?.last_name} - Invitation`}
          description={`Invitation details for ${invitation?.email}`}
          Icon={Mail}
        />
      </SadminSpace>

      <div className="w-full mx-auto p-6">
        {/* <CustomStepper
          navigation={false}
          initialStep={initialStep}
          steps={steps}
          headers={headers}
        /> */}
      </div>
    </div>
  );
}

export default InvitationView;
