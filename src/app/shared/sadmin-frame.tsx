"use client";
import React, { Fragment } from "react";
import SadminProviders from "./wrappers/sadmin-providers";
import { SuperAdminSidebar } from "@/components/built/sidebar/super-admin-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadCrumbs } from "@/hooks/context/bread-crumb-context";

function SuperAdminFrame({ children }: { children: React.ReactNode }) {
  const { crumbs } = useBreadCrumbs();
  return (
    <>
      {/* <SidebarInset> */}
      <SuperAdminSidebar />
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-gray-50">
        <header className="flex h-16 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadcrumbList>
              {crumbs?.map((crumb, index) => {
                return (
                  <Fragment key={crumb.key}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        key={crumb.key}
                        href={crumb.url}
                        className="text-gray-500 font-semibold cursor-pointer hover:underline capitalize hover:text-gray-900"
                      >
                        {crumb.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index !== crumbs.length - 1 ? (
                      <BreadcrumbSeparator className="hidden md:block" />
                    ) : null}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </div>
        </header>
        <main className="h-full w-full ">{children}</main>
        {/* </SidebarInset> */}
      </div>
    </>
  );
}

export default SuperAdminFrame;
