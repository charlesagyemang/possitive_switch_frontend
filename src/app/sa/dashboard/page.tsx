"use client";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";

export default function SadminDashboard() {
  return (
    <SuperAdminRoot>
      <SadminSpace>
        <h3>A preacher who fell from grace</h3>
      </SadminSpace>
    </SuperAdminRoot>
  );
}
