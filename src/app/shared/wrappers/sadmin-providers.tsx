"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BreadCrumbProvider } from "@/hooks/context/bread-crumb-context";
import React from "react";

function SadminProviders({ children }: { children: React.ReactNode }) {
  return (
    <BreadCrumbProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </BreadCrumbProvider>
  );
}

export default SadminProviders;
