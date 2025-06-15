import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import React from "react";
import ProtectSuperAdmin from "../shared/wrappers/auth/protect-super-admin";

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectSuperAdmin>
      <SuperAdminRoot>{children}</SuperAdminRoot>
    </ProtectSuperAdmin>
  );
}

export default SuperAdminLayout;
