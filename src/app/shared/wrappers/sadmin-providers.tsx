"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BreadCrumbProvider } from "@/hooks/context/bread-crumb-context";
import React from "react";
import QueryClientWrapper from "./query-client";

function SadminProviders({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientWrapper>
      <BreadCrumbProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </BreadCrumbProvider>
    </QueryClientWrapper>
  );
}

export default SadminProviders;
