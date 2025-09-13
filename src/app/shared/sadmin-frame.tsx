"use client";
import React, { Fragment } from "react";
import { SuperAdminSidebar } from "@/components/built/sidebar/super-admin-sidebar";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadCrumbs } from "@/hooks/context/bread-crumb-context";
import NavigationLayout from "./app-nav";
import Link from "next/link";

function SuperAdminFrame({ children }: { children: React.ReactNode }) {
  const { crumbs } = useBreadCrumbs();
  return (
    <>
      {/* <SidebarInset> */}
      <SuperAdminSidebar />
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black">
        <header className="flex h-16 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <NavigationLayout />
        </header>
        <div className="w-full mx-12 my-4">
          <BreadcrumbList>
            {crumbs?.map((crumb, index) => {
              return (
                <Fragment key={crumb.key}>
                  <BreadcrumbItem className="hidden md:block">
                    <Link
                      key={crumb.key}
                      href={crumb.url}
                      className="text-gray-400 dark:text-gray-500 font-medium cursor-pointer hover:underline capitalize hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      {crumb.name}
                    </Link>
                  </BreadcrumbItem>
                  {index !== crumbs.length - 1 ? (
                    <BreadcrumbSeparator className="hidden md:block text-gray-400 dark:text-gray-600" />
                  ) : null}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </div>
        <main className="h-full w-full overflow-y-scroll scrollbar-hide pb-20 ">
          {children}
        </main>
      </div>
    </>
  );
}

export default SuperAdminFrame;
