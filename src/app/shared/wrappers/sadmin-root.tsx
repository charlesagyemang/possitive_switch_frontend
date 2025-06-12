import React from "react";
import SadminProviders from "./sadmin-providers";
import SuperAdminWrapper from "../sadmin-frame";
import SuperAdminFrame from "../sadmin-frame";

function SuperAdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <SadminProviders>
      <SuperAdminFrame>{children}</SuperAdminFrame>
    </SadminProviders>
  );
}

export default SuperAdminRoot;
