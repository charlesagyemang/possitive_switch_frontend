import { prepareToPassUserToClient, requireAuthUser } from "@/api/server/auth";
import { HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import QueryClientWrapper from "../query-client";

async function ProtectSuperAdmin({ children }: { children: React.ReactNode }) {
  const user = await requireAuthUser();
  const { state } = await prepareToPassUserToClient(user);

  return (
    <QueryClientWrapper>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </QueryClientWrapper>
  );
}

export default ProtectSuperAdmin;
