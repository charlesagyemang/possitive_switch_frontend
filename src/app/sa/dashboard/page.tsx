"use client";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import PageTitle from "@/components/built/text/page-title";

export default function SadminDashboard() {
  return (
    <SuperAdminRoot>
      <SadminSpace>
        <PageTitle
          title="Welcome, Mr Frimpong"
          description="You are a super admin, manage all the companies and candidates from here!"
        />
      </SadminSpace>
    </SuperAdminRoot>
  );
}
