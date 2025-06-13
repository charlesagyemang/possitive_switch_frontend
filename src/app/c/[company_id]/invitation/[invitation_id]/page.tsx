import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import PageTitle from "@/components/built/text/page-title";
import React from "react";

function InvitationView() {
  return (
    <SuperAdminRoot>
      <SadminSpace>
        <PageTitle
          title="Invitation View"
          description="View and manage invitations for candidates in this company."
        />
      </SadminSpace>
    </SuperAdminRoot>
  );
}

export default InvitationView;
